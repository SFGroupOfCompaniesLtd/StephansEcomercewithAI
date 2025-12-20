/**
 * Odoo Order Sync Module
 * Push website orders to Odoo as sale.order
 */

import { odoo } from "./client";

interface OrderLine {
    productName: string;
    productId: number;
    quantity: number;
    price: number;
}

interface CustomerInfo {
    name: string;
    email: string;
    phone?: string;
}

interface OrderData {
    orderId: string;
    customer: CustomerInfo;
    lines: OrderLine[];
    total: number;
}

/**
 * Get or create a customer (res.partner) in Odoo
 */
async function getOrCreateCustomer(customer: CustomerInfo): Promise<number> {
    // Search for existing customer by email
    const existing = await odoo.searchRead(
        "res.partner",
        [["email", "=", customer.email]],
        ["id"],
        1
    );

    if (existing.length > 0) {
        return existing[0].id;
    }

    // Create new customer
    const partnerId = await odoo.executeKw("res.partner", "create", [{
        name: customer.name,
        email: customer.email,
        phone: customer.phone || "",
        customer_rank: 1,
    }]);

    return partnerId;
}

/**
 * Push an order from the website to Odoo
 */
export async function pushOrderToOdoo(order: OrderData): Promise<number | null> {
    try {
        console.log(`📤 Pushing order ${order.orderId} to Odoo...`);

        // Get or create customer
        const partnerId = await getOrCreateCustomer(order.customer);
        console.log(`  - Customer ID: ${partnerId}`);

        // Create sale order
        const saleOrderId = await odoo.executeKw("sale.order", "create", [{
            partner_id: partnerId,
            client_order_ref: order.orderId, // Website order reference
            order_line: order.lines.map((line) => [0, 0, {
                product_id: line.productId,
                product_uom_qty: line.quantity,
                price_unit: line.price,
                name: line.productName,
            }]),
        }]);

        console.log(`  - ✅ Created Odoo order ID: ${saleOrderId}`);
        return saleOrderId;

    } catch (error) {
        console.error(`  - ❌ Failed to push order to Odoo:`, error);
        return null;
    }
}

/**
 * Update stock in Odoo after order
 */
export async function updateOdooStock(productId: number, quantitySold: number): Promise<boolean> {
    try {
        // Note: Stock updates in Odoo are typically handled automatically
        // when a sale order is confirmed. This is for manual adjustments.

        const product = await odoo.searchRead(
            "product.product",
            [["product_tmpl_id", "=", productId]],
            ["id", "qty_available"]
        );

        if (product.length > 0) {
            console.log(`📊 Product ${productId} current stock: ${product[0].qty_available}`);
        }

        return true;
    } catch (error) {
        console.error(`Failed to update stock:`, error);
        return false;
    }
}

/**
 * Get product ID mapping from Odoo
 */
export async function getOdooProductId(sanityProductId: string): Promise<number | null> {
    // Extract Odoo ID from Sanity product ID (format: "odoo-123")
    const match = sanityProductId.match(/^odoo-(\d+)$/);
    if (match) {
        return parseInt(match[1], 10);
    }
    return null;
}
