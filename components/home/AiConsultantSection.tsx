"use client";

import { MessageCircle, Zap, Brain, ArrowRight } from "lucide-react";

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
    <section className="relative overflow-hidden bg-[#f0fdf8] border-y border-emerald-200/60">
      {/* Subtle gradient mesh background -- replaces flat color */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 70% 40%, rgba(16,185,129,0.08) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 80%, rgba(13,148,136,0.06) 0%, transparent 50%)",
        }}
      />
      {/* Faint grid pattern for texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left -- text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                {labels.title}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[2.125rem] font-bold text-foreground mb-4 leading-tight">
              {labels.subtitle}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {labels.desc}
            </p>

            {/* Features -- card-style items */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 justify-center lg:justify-start">
              {labels.features.map((feature, i) => {
                const Icon = featureIcons[i] || Zap;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white/80 backdrop-blur-sm border border-emerald-200/60 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.04)]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgb(16_185_129/0.25)]">
                      <Icon className="w-4 h-4 text-white" />
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
              className="group inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-[0_4px_20px_0_rgb(16_185_129/0.35)] hover:shadow-[0_8px_30px_0_rgb(16_185_129/0.45)] hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {labels.cta}
              <ArrowRight className="w-4.5 h-4.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Right -- modern chat mockup visual */}
          <div className="flex-shrink-0 w-72 sm:w-80 lg:w-[340px]">
            <div className="relative">
              {/* Main card -- chat window mockup */}
              <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgb(0_0_0/0.08)] border border-emerald-100/80 overflow-hidden">
                {/* Header bar */}
                <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">AI Consultant</div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
                      <span className="text-[11px] text-white/80">Online</span>
                    </div>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="p-4 space-y-3">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="px-3.5 py-2 bg-primary/10 rounded-2xl rounded-br-md max-w-[75%]">
                      <span className="text-[13px] text-foreground">30 m2, budget 1200 EUR?</span>
                    </div>
                  </div>
                  {/* AI response */}
                  <div className="flex justify-start">
                    <div className="px-3.5 py-2.5 bg-emerald-50 border border-emerald-100/80 rounded-2xl rounded-bl-md max-w-[85%]">
                      <span className="text-[13px] text-foreground leading-relaxed">
                        Daikin Sensira FTXF35 -- 12000 BTU, A++, 1089 EUR
                      </span>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="w-1 h-1 rounded-full bg-emerald-500" />
                        <span className="text-[11px] text-emerald-600 font-medium">Best match</span>
                      </div>
                    </div>
                  </div>
                  {/* Typing indicator */}
                  <div className="flex justify-start">
                    <div className="px-4 py-2.5 bg-gray-50 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:0ms]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:150ms]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating accent -- subtle glow behind card */}
              <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-emerald-200/30 to-teal-200/20 rounded-3xl blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
