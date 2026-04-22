import Image from "next/image";
import { Shield, Truck, Wrench, Award } from "lucide-react";

async function getDictionary(locale: string) {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default;
  } catch {
    const dict = await import(`@/dictionaries/bg.json`);
    return dict.default;
  }
}

const icons = [Shield, Truck, Wrench, Award];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const c = dictionary.about;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">{c.title}</h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-8">{c.subtitle}</p>

      {/* Team photo */}
      <div className="rounded-2xl overflow-hidden shadow-xl mb-10">
        <Image
          src="/images/about-team.jpg"
          alt={c.title}
          width={1200}
          height={800}
          sizes="(max-width: 896px) 100vw, 896px"
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Team paragraph */}
      <p className="text-base text-muted-foreground leading-relaxed mb-10">{c.teamParagraph}</p>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {c.stats.map((stat: { value: string; label: string }) => (
          <div key={stat.label} className="text-center p-5 bg-white border border-border/80 rounded-2xl">
            <p className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {c.values.map((val: { title: string; desc: string }, i: number) => {
          const Icon = icons[i];
          return (
            <div key={val.title} className="p-6 bg-white border border-border/80 rounded-2xl">
              <div className="w-12 h-12 bg-primary-light/60 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{val.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
