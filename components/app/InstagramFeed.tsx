"use client";

import { Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Instagram Profile URL
const INSTAGRAM_URL = "https://www.instagram.com/stephans_ps/";
const INSTAGRAM_HANDLE = "@stephans_ps";

// Sample/Static posts - replace with dynamic feed when Graph API is configured
// Note: Instagram Basic Display API was deprecated Dec 4, 2024
// Use Instagram Graph API with a Business/Creator account
const SAMPLE_POSTS = [
    {
        id: "1",
        imageUrl: "/instagram/post1.jpg",
        caption: "Happy pets, happy life! 🐕",
        likes: 234,
        permalink: INSTAGRAM_URL,
    },
    {
        id: "2",
        imageUrl: "/instagram/post2.jpg",
        caption: "New arrivals in store! 🎉",
        likes: 189,
        permalink: INSTAGRAM_URL,
    },
    {
        id: "3",
        imageUrl: "/instagram/post3.jpg",
        caption: "Grooming day! ✨",
        likes: 312,
        permalink: INSTAGRAM_URL,
    },
    {
        id: "4",
        imageUrl: "/instagram/post4.jpg",
        caption: "Quality pet food 🍖",
        likes: 156,
        permalink: INSTAGRAM_URL,
    },
];

export function InstagramFeed() {
    return (
        <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col items-center justify-between gap-4 mb-10 sm:flex-row">
                    <div className="text-center sm:text-left">
                        <div className="flex items-center gap-3 justify-center sm:justify-start">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
                                <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                                    <Instagram className="h-6 w-6 text-pink-500" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-zinc-900">Follow Us on Instagram</h2>
                                <a
                                    href={INSTAGRAM_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-pink-600 hover:text-pink-700 font-medium"
                                >
                                    {INSTAGRAM_HANDLE}
                                </a>
                            </div>
                        </div>
                    </div>

                    <Button asChild className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500">
                        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                            <Instagram className="h-4 w-4 mr-2" />
                            Follow Us
                            <ExternalLink className="h-3 w-3 ml-2" />
                        </a>
                    </Button>
                </div>

                {/* Instagram Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {SAMPLE_POSTS.map((post) => (
                        <a
                            key={post.id}
                            href={post.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-200"
                        >
                            {/* Placeholder gradient - replace with actual images */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${post.id === "1" ? "from-amber-300 to-orange-400" :
                                    post.id === "2" ? "from-blue-300 to-purple-400" :
                                        post.id === "3" ? "from-green-300 to-teal-400" :
                                            "from-pink-300 to-rose-400"
                                }`} />

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <Instagram className="h-8 w-8 mx-auto mb-2" />
                                    <p className="text-sm font-medium">View on Instagram</p>
                                </div>
                            </div>

                            {/* Caption preview */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-white text-sm line-clamp-2">{post.caption}</p>
                            </div>
                        </a>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-8 text-center">
                    <p className="text-zinc-600 mb-4">
                        Stay updated with our latest products, grooming tips, and pet care advice!
                    </p>
                    <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
                    >
                        See more on Instagram
                        <ExternalLink className="h-4 w-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}

/**
 * INTEGRATION OPTIONS FOR LIVE INSTAGRAM FEED:
 * 
 * 1. Instagram Graph API (Recommended)
 *    - Requires Business or Creator account
 *    - Create Meta Developer App
 *    - Generate long-lived access token
 *    - Call: GET /{user-id}/media?fields=id,caption,media_url,permalink
 * 
 * 2. Third-party services:
 *    - Elfsight (https://elfsight.com)
 *    - SnapWidget (https://snapwidget.com)
 *    - LightWidget (https://lightwidget.com)
 *    - EmbedSocial (https://embedsocial.com)
 * 
 * 3. Embed individual posts:
 *    - Use Instagram's native embed feature for specific posts
 *    - Works without API access
 */
