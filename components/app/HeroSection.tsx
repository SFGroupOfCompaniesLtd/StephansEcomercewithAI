"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
    heroImageUrl?: string | null;
}

export function HeroSection({ heroImageUrl }: HeroSectionProps) {
    return (
        <section className="relative overflow-hidden min-h-[85vh] flex items-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-blue-900 to-slate-900">
            {/* Parallax-ready Background Layers */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] animate-pulse-slow delay-1000" />

                {/* Grid Overlay for Tech/Structure feel */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container relative z-10 mx-auto px-4">
                <div className="grid lg:grid-cols-12 gap-12 items-center">

                    {/* Glassmorphic Floating Action Panel */}
                    <div className="lg:col-span-7 relative">
                        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden p-8 md:p-12 animate-fade-in-up">
                            {/* Inner Glow */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider mb-8">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Premium Pet Care Ecosystem</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
                                Elevate Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                                    Pet's Lifestyle
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-300 max-w-xl mb-10 leading-relaxed font-light">
                                Experience the intersection of luxury and care. Curated essentials designed for the modern companion.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/">
                                    <Button className="h-14 px-8 text-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-900/20 border-0 rounded-xl transition-all hover:scale-[1.02]">
                                        Explore Collection
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/grooming">
                                    <Button variant="outline" className="h-14 px-8 text-lg border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white rounded-xl backdrop-blur-md transition-all hover:scale-[1.02]">
                                        Book Grooming
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-8 text-slate-400 text-sm">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                                    <span>Verified Quality</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-blue-400" />
                                    <span>Premium Support</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image / Visual */}
                    <div className="lg:col-span-5 relative hidden lg:block perspective-1000">
                        {heroImageUrl ? (
                            <div className="relative transform transition-transform duration-700 hover:rotate-y-[-5deg] hover:rotate-x-[5deg]">
                                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-[2rem] opacity-30 blur-2xl animate-pulse-slow" />
                                <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                                    <Image
                                        src={heroImageUrl}
                                        alt="Premium Pet Lifestyle"
                                        width={600}
                                        height={700}
                                        className="object-cover w-full h-full"
                                        priority
                                    />
                                    {/* Glass Overlay on Image */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                                    <div className="absolute bottom-8 left-8 right-8">
                                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-xl">
                                            <p className="text-white font-medium">New Collection</p>
                                            <p className="text-slate-300 text-sm">Valid until Dec 31</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[600px] w-full rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center">
                                <span className="text-slate-500">Image Placeholder</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
