"use client";

import { Sparkles, MessageCircle, Zap, Brain } from "lucide-react";

interface AiConsultantSectionProps {
  labels: {
    title: string;
    subtitle: string;
    desc: string;
    features: string[];
    cta: string;
  };
}

const featureIcons = [Zap, Brain, MessageCircle];

export default function AiConsultantSection({ labels }: AiConsultantSectionProps) {
  function openConsultant() {
    window.dispatchEvent(new CustomEvent("pesnopoets:open-consultant"));
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-y border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left — text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                {labels.title}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              {labels.subtitle}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-lg mx-auto lg:mx-0">
              {labels.desc}
            </p>

            {/* Features */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mb-8 justify-center lg:justify-start">
              {labels.features.map((feature, i) => {
                const Icon = featureIcons[i] || Zap;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{feature}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={openConsultant}
              className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all duration-200 shadow-[0_4px_20px_0_rgb(16_185_129/0.4)] hover:shadow-[0_6px_24px_0_rgb(16_185_129/0.5)] hover:-translate-y-0.5 text-sm sm:text-base"
            >
              <Sparkles className="w-5 h-5" />
              {labels.cta}
            </button>
          </div>

          {/* Right — visual */}
          <div className="flex-shrink-0 w-64 h-64 sm:w-80 sm:h-80 relative">
            {/* Decorative circles */}
            <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-emerald-500/10" />
            <div className="absolute inset-8 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <div className="relative">
                <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-500" />
                {/* Chat bubbles decoration */}
                <div className="absolute -top-3 -right-6 px-2.5 py-1 bg-white rounded-lg shadow-md text-[10px] font-medium text-foreground border border-border/60">
                  9000 BTU?
                </div>
                <div className="absolute -bottom-2 -left-8 px-2.5 py-1 bg-emerald-500 rounded-lg shadow-md text-[10px] font-medium text-white">
                  Daikin ✓
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
