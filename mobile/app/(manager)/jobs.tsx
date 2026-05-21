import { CalendarDays } from "lucide-react-native";
import { Screen } from "@/components/Screen";
import { EmptyState } from "@/components/EmptyState";
import { colors } from "@/lib/theme";

export default function ManagerJobsScreen() {
  return (
    <Screen title="Поръчки" subtitle="Монтажи и профилактики — разпределение към техниците.">
      <EmptyState
        icon={<CalendarDays color={colors.primary} size={32} />}
        title="Няма поръчки"
        description="Заявките за профилактика и монтаж се появяват тук за разпределение."
      />
    </Screen>
  );
}
