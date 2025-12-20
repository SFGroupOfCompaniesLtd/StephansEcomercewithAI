"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function HeaderSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/?q=${encodeURIComponent(query.trim())}`);
            setIsOpen(false);
            setQuery("");
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setQuery("");
    };

    if (!isOpen) {
        return (
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                className="hidden sm:flex text-white hover:bg-white/20"
                aria-label="Search products"
            >
                <Search className="h-5 w-5" />
            </Button>
        );
    }

    return (
        <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                    ref={inputRef}
                    type="search"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-48 pl-9 pr-8 sm:w-64 bg-white/90 border-white/20 text-zinc-900 placeholder:text-zinc-500"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-white hover:bg-white/20"
            >
                <X className="h-5 w-5" />
            </Button>
        </form>
    );
}
