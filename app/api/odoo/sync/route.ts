import { NextResponse } from "next/server";
import { odoo } from "@/lib/odoo/client";
import { createClient } from "@sanity/client";

const sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: "2025-12-05",
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
});

/**
 * API endpoint to sync products from Odoo to Sanity
 * POST /api/odoo/sync
 * 
 * Can be called by:
 * - Vercel Cron Jobs (scheduled)
 * - Odoo Webhooks (real-time)
 * - Admin manually
 */
export async function POST(request: Request) {
    try {
        // Optional: Verify secret for cron/webhook security
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("🚀 Starting Odoo product sync...");

        // Fetch products from Odoo
        const odooProducts = await odoo.searchRead(
            "product.template",
            [["sale_ok", "=", true]],
            ["id", "name", "list_price", "description_sale", "categ_id", "qty_available"],
            100 // Limit for performance
        );

        console.log(`📦 Fetched ${odooProducts.length} products from Odoo`);

        let synced = 0;
        let errors = 0;

        for (const product of odooProducts) {
            try {
                const sanityId = `odoo-${product.id}`;

                // Upsert: update if exists, create if not
                await sanityClient.createOrReplace({
                    _type: "product",
                    _id: sanityId,
                    name: product.name,
                    slug: {
                        _type: "slug",
                        current: product.name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "") + `-${product.id}`,
                    },
                    description: product.description_sale || product.name,
                    price: product.list_price || 0,
                    stock: Math.max(0, Math.floor(product.qty_available || 0)),
                    odooId: product.id,
                });

                synced++;
            } catch (err) {
                console.error(`Failed to sync product ${product.name}:`, err);
                errors++;
            }
        }

        console.log(`✅ Sync complete: ${synced} synced, ${errors} errors`);

        return NextResponse.json({
            success: true,
            synced,
            errors,
            total: odooProducts.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Odoo sync failed:", error);
        return NextResponse.json(
            { error: "Sync failed", details: String(error) },
            { status: 500 }
        );
    }
}

// GET endpoint to check sync status
export async function GET() {
    return NextResponse.json({
        endpoint: "/api/odoo/sync",
        methods: ["POST"],
        description: "Sync products from Odoo ERP to Sanity CMS",
        lastSync: "Check Sanity for product timestamps",
    });
}
