"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wrench, ShieldCheck, Clock } from "lucide-react";

export default function InteractiveACBanner({ locale }: { locale: string }) {
  const isBg = locale === "bg";
  
  return (
    <section className="relative overflow-hidden bg-white border border-border/50 rounded-[2rem] mx-4 my-8 shadow-sm group min-h-[400px] flex items-center">
      {/* Background Image: Real Installation Case */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/montazh/after-indoor.jpg"
          alt="Clean AC Installation"
          fill
          className="object-cover opacity-20 lg:opacity-100 lg:translate-x-1/4 transition-transform duration-1000 group-hover:scale-105"
        />
        {/* Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/10 lg:to-transparent z-10" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-8 py-16 w-full lg:w-1/2 lg:ml-0 lg:mr-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-black tracking-widest uppercase rounded-full mb-6">
          <Wrench className="w-3.5 h-3.5" />
          {isBg ? "ЕКСПЕРТЕН МОНТАЖ" : "EXPERT INSTALLATION"}
        </div>
        
        <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6 leading-tight tracking-tight">
          {isBg ? "Чиста работа, " : "Clean work, "}
          <span className="text-primary">{isBg ? "без изненади" : "no surprises"}</span>
        </h2>
        
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-md font-medium">
          {isBg 
            ? "Използваме промишлени прахосмукачки и професионално оборудване. Плащате фиксирана цена без скрити такси."
            : "We use industrial vacuums and professional tools. You pay a fixed price with no hidden fees."}
        </p>
        
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-foreground/80">{isBg ? "До 24 часа" : "Within 24h"}</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-foreground/80">{isBg ? "Гаранция 12м." : "12m Warranty"}</span>
          </div>
        </div>
        
        <Link
          href={`/${locale}/montazh`}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0a1628] text-white font-bold rounded-xl hover:bg-primary transition-all shadow-xl hover:shadow-primary/25 overflow-hidden"
        >
          <div className="absolute inset-0 animate-shimmer-light pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
          <span>{isBg ? "Вижте цените" : "View Pricing"}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Decorative Brand Badge */}
      <div className="absolute top-8 right-8 hidden lg:flex items-center gap-4 animate-fade-in-up">
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-border/50 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Premium Quality</div>
            <div className="text-sm font-black text-foreground">Varna Approved</div>
          </div>
        </div>
      </div>
    </section>
  );
}
