interface FeatureGroup {
  name: string;
  items: Array<{ name: string; value: string }>;
}

interface SpecsTableProps {
  features: Record<string, FeatureGroup>;
  locale: string;
}

const sectionIcons: Record<string, string> = {
  "Основни характеристики": "⚡",
  "Вътрешно тяло": "🏠",
  "Външно тяло": "🌤️",
};

export default function SpecsTable({ features, locale }: SpecsTableProps) {
  if (!features || Object.keys(features).length === 0) return null;

  return (
    <div className="space-y-6">
      {Object.entries(features).map(([key, group]) => (
        <div key={key}>
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground mb-3">
            <span>{sectionIcons[group.name] || "📋"}</span>
            {group.name}
          </h3>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {group.items.map((item, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-muted/50" : "bg-white"}
                  >
                    <td className="px-4 py-2.5 text-muted-foreground font-medium w-1/2 border-r border-border">
                      {item.name}
                    </td>
                    <td className="px-4 py-2.5 text-foreground font-mono text-xs">
                      {item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
