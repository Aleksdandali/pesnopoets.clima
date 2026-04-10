import { Zap, Home, Sun, ClipboardList } from "lucide-react";

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

export default function SpecsTable({ features, locale }: SpecsTableProps) {
  if (!features || Object.keys(features).length === 0) return null;

  return (
    <div className="space-y-8">
      {Object.entries(features).map(([key, group]) => {
        const IconComp = sectionIcons[group.name] || defaultIcon;
        return (
          <div key={key}>
            <h3 className="flex items-center gap-2.5 text-base font-semibold text-foreground mb-4">
              <div className="w-8 h-8 bg-primary-light/60 rounded-lg flex items-center justify-center">
                <IconComp className="w-4 h-4 text-primary" />
              </div>
              {group.name}
            </h3>
            <div className="rounded-xl border border-border/80 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {group.items.map((item, i) => (
                    <tr
                      key={i}
                      className={`${
                        i % 2 === 0 ? "bg-muted/40" : "bg-white"
                      } ${i < group.items.length - 1 ? "border-b border-border/40" : ""}`}
                    >
                      <td className="px-5 py-3 text-muted-foreground font-medium w-1/2">
                        {item.name}
                      </td>
                      <td className="px-5 py-3 text-foreground font-mono text-xs">
                        {item.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
