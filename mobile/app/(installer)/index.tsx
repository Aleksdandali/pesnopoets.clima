import { ClipboardList } from "lucide-react-native";
import { Screen } from "@/components/Screen";
import { EmptyState } from "@/components/EmptyState";
import { colors } from "@/lib/theme";

export default function InstallerTodayScreen() {
  return (
    <Screen title="За днес" subtitle="Назначени монтажи и профилактики.">
      <EmptyState
        icon={<ClipboardList color={colors.primary} size={32} />}
        title="Няма задачи за днес"
        description="Графикът се появява тук, когато мениджърът ви назначи."
      />
    </Screen>
  );
}
