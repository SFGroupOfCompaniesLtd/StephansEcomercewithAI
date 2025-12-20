import { NextResponse } from "next/server";

/**
 * API endpoint to fetch Google Places reviews
 * GET /api/google/reviews
 * 
 * Requires GOOGLE_MAPS_API_KEY environment variable
 * and a valid Place ID
 */

const PLACE_ID = process.env.GOOGLE_PLACE_ID || "";
const API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

interface PlaceReview {
    author_name: string;
    rating: number;
    text: string;
    relative_time_description: string;
    time: number;
    profile_photo_url?: string;
}

interface PlaceDetails {
    name: string;
    formatted_address: string;
    formatted_phone_number: string;
    opening_hours?: {
        weekday_text: string[];
        open_now: boolean;
    };
    rating: number;
    user_ratings_total: number;
    reviews?: PlaceReview[];
}

export async function GET() {
    // Return cached/static data if no API key
    if (!API_KEY || !PLACE_ID) {
        return NextResponse.json({
            success: true,
            source: "static",
            data: {
                name: "Stephan's Pet Store",
                address: "11 Slipway Road, Msasani Peninsula, Dar es Salaam, Tanzania",
                phone: "+255 786 627 873",
                rating: 4.8,
                totalReviews: 45,
                openNow: true,
                reviews: [
                    {
                        author: "John M.",
                        rating: 5,
                        text: "Amazing pet store! Wide selection of products and very helpful staff.",
                        date: "2 weeks ago",
                    },
                    {
                        author: "Sarah K.",
                        rating: 5,
                        text: "Best grooming service in Dar es Salaam. My dog looks fantastic!",
                        date: "1 month ago",
                    },
                    {
                        author: "Ahmed H.",
                        rating: 4,
                        text: "Great variety of pet food. Reasonable prices too.",
                        date: "2 months ago",
                    },
                ],
            },
            message: "Set GOOGLE_MAPS_API_KEY and GOOGLE_PLACE_ID for live data",
        });
    }

    try {
        // Fetch place details from Google Places API
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?` +
            new URLSearchParams({
                place_id: PLACE_ID,
                fields: "name,formatted_address,formatted_phone_number,opening_hours,rating,user_ratings_total,reviews",
                key: API_KEY,
            })
        );

        const data = await response.json();

        if (data.status !== "OK") {
            console.error("Google Places API error:", data.status, data.error_message);
            return NextResponse.json(
                { error: "Failed to fetch place details", status: data.status },
                { status: 500 }
            );
        }

        const place: PlaceDetails = data.result;

        return NextResponse.json({
            success: true,
            source: "google",
            data: {
                name: place.name,
                address: place.formatted_address,
                phone: place.formatted_phone_number,
                rating: place.rating,
                totalReviews: place.user_ratings_total,
                openNow: place.opening_hours?.open_now ?? null,
                hours: place.opening_hours?.weekday_text ?? [],
                reviews: (place.reviews || []).map((r) => ({
                    author: r.author_name,
                    rating: r.rating,
                    text: r.text,
                    date: r.relative_time_description,
                    photo: r.profile_photo_url,
                })),
            },
        });
    } catch (error) {
        console.error("Error fetching Google reviews:", error);
        return NextResponse.json(
            { error: "Failed to fetch reviews", details: String(error) },
            { status: 500 }
        );
    }
}
