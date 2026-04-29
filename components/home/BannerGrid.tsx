import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import AiBannerButton from "./AiBannerButton";

interface Banner {
  id: string;
  title: Record<string, string>;
  subtitle: Record<string, string>;
  image_desktop: string | null;
  image_mobile: string | null;
  link: string;
  sort_order: number;
}

function BannerContent({
  title,
  subtitle,
  imgDesktop,
  imgMobile,
}: {
  title: string;
  subtitle: string;
  imgDesktop: string | null;
  imgMobile: string | null;
}) {
  return (
    <>
      {/* Desktop image */}
      {imgDesktop && (
        <Image
          src={imgDesktop}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
            imgMobile ? "hidden sm:block" : ""
          }`}
        />
      )}
      {/* Mobile image (fallback to desktop) */}
      {imgMobile && (
        <Image
          src={imgMobile}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03] sm:hidden"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <h3 className="text-white font-bold text-base sm:text-lg leading-tight drop-shadow-md">
          {title}
        </h3>
        {subtitle && (
          <p className="text-white/80 text-xs sm:text-sm mt-0.5 drop-shadow-sm">
            {subtitle}
          </p>
        )}
      </div>

      {/* Hover arrow */}
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </>
  );
}

export default async function BannerGrid({ locale }: { locale: string }) {
  const supabase = await createClient();
  const { data: banners } = await supabase
    .from("banners")
    .select("id, title, subtitle, image_desktop, image_mobile, link, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(6);

  if (!banners || banners.length === 0) return null;

  return (
    <section className="py-8 sm:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {banners.map((banner: Banner) => {
          const title = banner.title[locale] || banner.title.bg || "";
          const subtitle = banner.subtitle[locale] || banner.subtitle.bg || "";
          const imgDesktop = banner.image_desktop;
          const imgMobile = banner.image_mobile;
          const isAiConsultant = banner.link === "#ai-consultant";

          if (isAiConsultant) {
            return (
              <AiBannerButton key={banner.id}>
                <BannerContent title={title} subtitle={subtitle} imgDesktop={imgDesktop} imgMobile={imgMobile} />
              </AiBannerButton>
            );
          }

          return (
            <Link
              key={banner.id}
              href={`/${locale}${banner.link}`}
              className="group relative block aspect-[580/300] rounded-xl overflow-hidden bg-muted"
            >
              <BannerContent title={title} subtitle={subtitle} imgDesktop={imgDesktop} imgMobile={imgMobile} />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
