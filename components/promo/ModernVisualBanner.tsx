"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Star, Award, CheckCircle2 } from "lucide-react";

interface ModernVisualBannerProps {
  locale: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export default function ModernVisualBanner({
  locale,
  title,
  subtitle,
  ctaText,
  ctaLink,
}: ModernVisualBannerProps) {
  const isBg = locale === "bg";
  
  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-16 sm:py-24 px-6 rounded-[2rem] mx-4 my-8 border border-border/50 shadow-sm group">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left: Content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-border/60 rounded-full mb-8 shadow-sm animate-fade-in-up">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              {isBg ? "Официален Дийлър във Варна" : "Authorized Dealer in Varna"}
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-foreground mb-6 tracking-tight leading-[1.05] animate-fade-in-up [animation-delay:100ms]">
            {title}
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up [animation-delay:200ms]">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 animate-fade-in-up [animation-delay:300ms]">
            <Link
              href={ctaLink}
              className="group relative flex items-center justify-center gap-2 px-10 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/20 overflow-hidden"
            >
              <div className="absolute inset-0 animate-shimmer-light pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              <span>{ctaText}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <div className="flex items-center gap-4 text-sm font-semibold text-foreground/70">
              <div className="flex -space-x-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-warning text-warning" />)}
              </div>
              <span>4.9/5 Google Rating</span>
            </div>
          </div>
        </div>

        {/* Right: Trust Markers Grid */}
        <div className="w-full lg:w-[420px] grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up [animation-delay:400ms]">
          {[
            { icon: Award, title: isBg ? "5г. Гаранция" : "5yr Warranty", desc: isBg ? "Пълна поддръжка" : "Full support" },
            { icon: CheckCircle2, title: isBg ? "Чист Монтаж" : "Clean Install", desc: isBg ? "Без прах и шум" : "No dust or mess" },
            { icon: ShieldCheck, title: isBg ? "Оригинални" : "Originals Only", desc: isBg ? "Daikin, Mitsubishi" : "Certified stock" },
            { icon: Star, title: isBg ? "Топ Сервиз" : "Top Service", desc: isBg ? "Екип във Варна" : "In-house crew" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-border/50 shadow-sm hover:border-primary/20 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center mb-3">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
