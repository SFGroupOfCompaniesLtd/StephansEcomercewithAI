"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GroomingSection() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#5D3A22] p-8 md:p-12 lg:p-16">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/grooming-bg.png"
                        alt="Grooming background"
                        fill
                        className="object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#5D3A22] via-[#5D3A22]/90 to-[#5D3A22]/40" />
                </div>

                <div className="relative z-10 flex flex-col items-center justify-between gap-12 md:flex-row">
                    <div className="max-w-xl space-y-6 text-white text-center md:text-left">
                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Spoil Your Pet
                        </h2>
                        <p className="text-lg text-white/90 sm:text-xl">
                            Professional grooming services to keep your furry friend looking
                            and feeling their best. From baths to full spa treatments!
                        </p>
                        <div className="pt-4">
                            <Button
                                asChild
                                size="lg"
                                className="rounded-full bg-[#3E2718] hover:bg-[#2e1d12] px-8 py-6 text-lg font-semibold text-white border-none transition-all hover:scale-105 active:scale-95"
                            >
                                <Link href="/grooming" className="flex items-center gap-2">
                                    Book Grooming
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Circular Image on the right */}
                    <div className="relative h-64 w-64 shrink-0 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
                        <div className="absolute inset-0 rounded-full border-[6px] border-[#7A5C45]/50" />
                        <div className="absolute inset-2 overflow-hidden rounded-full">
                            <Image
                                src="/grooming-bg.png"
                                alt="Professional grooming"
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-110"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
