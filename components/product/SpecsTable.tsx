import {
  Zap,
  Home,
  Sun,
  ClipboardList,
  Thermometer,
  Wind,
  Ruler,
  Weight,
  Volume2,
  Shield,
  Gauge,
  Snowflake,
  Cable,
  Plug,
  Calendar,
  SquareStack,
} from "lucide-react";

interface FeatureGroup {
  name: string;
  items: Array<{ name: string; value: string }>;
}

interface SpecsTableProps {
  features: Record<string, FeatureGroup>;
  locale: string;
}

const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Основни характеристики": Zap,
  "Вътрешно тяло": Home,
  "Външно тяло": Sun,
};

const defaultIcon = ClipboardList;

// Map spec names to icons for visual identification
const specIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Мощност (BTU)": Zap,
  "SEER": Gauge,
  "SCOP": Gauge,
  "EER": Gauge,
  "COP": Gauge,
  "Енергиен клас": Shield,
  "Работна температура": Thermometer,
  "Подходящ за помещения": SquareStack,
  "Хладилен агент": Snowflake,
  "Гаранция": Calendar,
  "Захранване": Plug,
  "Размери": Ruler,
  "Тегло": Weight,
  "Ниво на шум": Volume2,
  "Тръбни връзки": Cable,
  "Компресор": Wind,
  "Годишен разход": Zap,
  "Отдавана мощност": Thermometer,
  "Консумирана мощност": Plug,
  "Максимален брой": SquareStack,
};

function getSpecIcon(name: string): React.ComponentType<{ className?: string }> | null {
  for (const [key, icon] of Object.entries(specIcons)) {
    if (name.includes(key)) return icon;
  }
  return null;
}

// Highlight important specs with colored badges
const highlightSpecs: Record<string, string> = {
  "Мощност (BTU)": "bg-primary-light text-primary",
  "Енергиен клас": "bg-success-light text-success",
  "Подходящ за помещения": "bg-accent-light text-accent",
  "Гаранция": "bg-primary-light text-primary",
};

function getHighlight(name: string): string | null {
  for (const [key, classes] of Object.entries(highlightSpecs)) {
    if (name.includes(key)) return classes;
  }
  return null;
}

export default function SpecsTable({ features }: SpecsTableProps) {
  if (!features || Object.keys(features).length === 0) return null;

  return (
    <div className="space-y-6 sm:space-y-8">
      {Object.entries(features).map(([key, group]) => {
        const IconComp = sectionIcons[group.name] || defaultIcon;
        return (
          <div key={key}>
            <h3 className="flex items-center gap-2.5 text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-light/60 rounded-lg flex items-center justify-center">
                <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" aria-hidden="true" />
              </div>
              {group.name}
            </h3>
            <div className="rounded-xl border border-border/80 overflow-hidden">
              {group.items.map((item, i) => {
                const SpecIcon = getSpecIcon(item.name);
                const highlight = getHighlight(item.name);

                return (
                  <div
                    key={i}
                    className={`flex items-start sm:items-center gap-2.5 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3 ${
                      i % 2 === 0 ? "bg-muted/30" : "bg-white"
                    } ${i < group.items.length - 1 ? "border-b border-border/30" : ""}`}
                  >
                    {/* Icon */}
                    {SpecIcon && (
                      <div className="shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-muted flex items-center justify-center mt-0.5 sm:mt-0">
                        <SpecIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" aria-hidden="true" />
                      </div>
                    )}

                    {/* Name + Value — stacked on mobile, side by side on desktop */}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4">
                      <span className="text-xs sm:text-sm text-muted-foreground leading-snug">
                        {item.name}
                      </span>
                      {highlight ? (
                        <span className={`inline-flex self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold ${highlight} whitespace-nowrap`}>
                          {item.value.trim()}
                        </span>
                      ) : (
                        <span className="text-xs sm:text-sm font-medium text-foreground font-mono break-words sm:whitespace-nowrap">
                          {item.value.trim()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
