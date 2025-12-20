"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GroomingSectionProps {
    images?: string[];
}

// Default fallback images if none from CMS
const DEFAULT_IMAGES = [
    "/grooming-1.jpg",
    "/grooming-2.png",
    "/grooming-3.png",
];

export function GroomingSection({ images }: GroomingSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const backgroundImages = images && images.length > 0 ? images : DEFAULT_IMAGES;

    // Auto-rotate images every 5 seconds
    useEffect(() => {
        if (backgroundImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    return (
        <section className="w-full">
            <div className="relative overflow-hidden bg-[#5D3A22] py-8 md:py-10">
                {/* Background Image Slider */}
                <div className="absolute inset-0 z-0">
                    {backgroundImages.map((src, index) => (
                        <div
                            key={src}
                            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-30" : "opacity-0"
                                }`}
                        >
                            <Image
                                src={src}
                                alt={`Grooming background ${index + 1}`}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                        </div>
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#5D3A22] via-[#5D3A22]/80 to-[#5D3A22]/40" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="max-w-xl space-y-4 text-white text-center md:text-left">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                                Spoil Your Pet
                            </h2>
                            <p className="text-base text-white/90 sm:text-lg">
                                Professional grooming services to keep your furry friend looking
                                and feeling their best. From baths to full spa treatments!
                            </p>
                            <div className="pt-2">
                                <Button
                                    asChild
                                    size="lg"
                                    className="rounded-full bg-[#3E2718] hover:bg-[#2e1d12] px-6 py-5 text-base font-semibold text-white border-none transition-all hover:scale-105 active:scale-95"
                                >
                                    <Link href="/grooming" className="flex items-center gap-2">
                                        Book Grooming
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Circular Image on the right - shows current slide */}
                        <div className="relative h-40 w-40 shrink-0 sm:h-48 sm:w-48 lg:h-56 lg:w-56">
                            <div className="absolute inset-0 rounded-full border-4 border-[#7A5C45]/50" />
                            <div className="absolute inset-1 overflow-hidden rounded-full">
                                <Image
                                    src={backgroundImages[currentIndex]}
                                    alt="Professional grooming"
                                    fill
                                    className="object-cover transition-transform duration-700 hover:scale-110"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Slide Indicators */}
                    {backgroundImages.length > 1 && (
                        <div className="flex justify-center gap-2 mt-4 md:justify-start">
                            {backgroundImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                            ? "w-6 bg-white"
                                            : "w-1.5 bg-white/40 hover:bg-white/60"
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
