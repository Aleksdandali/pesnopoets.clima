import { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Pressable,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Snowflake, CalendarDays, ShieldCheck, MapPin } from "lucide-react-native";
import { Badge, type BadgeTone } from "@/components/Badge";
import { PrimaryButton } from "@/components/PrimaryButton";
import {
  fetchInstallation,
  fetchInstallationJobs,
  getSignedPhotoUrls,
  requestMaintenance,
  daysUntilService,
  type InstallationFull,
  type ServiceJobSummary,
} from "@/lib/client";
import { colors, fontSize, fontWeight, radius, spacing, shadow } from "@/lib/theme";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function InstallationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [installation, setInstallation] = useState<InstallationFull | null | undefined>(undefined);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [jobs, setJobs] = useState<ServiceJobSummary[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const [inst, jobsData] = await Promise.all([fetchInstallation(id), fetchInstallationJobs(id)]);
      setInstallation(inst);
      setJobs(jobsData);

      if (inst) {
        const paths = [
          inst.indoor_photo_path,
          inst.outdoor_photo_path,
          inst.label_photo_path,
          ...inst.extra_photo_paths,
        ];
        const urls = (await getSignedPhotoUrls(paths)).filter((u): u is string => !!u);
        setPhotoUrls(urls);
      }
    } catch (e) {
      Alert.alert("Грешка", (e as Error).message);
      setInstallation(null);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  const pendingRequest = useMemo(
    () => jobs.find((j) => j.type === "maintenance" && (j.status === "requested" || j.status === "scheduled")),
    [jobs],
  );

  async function onRequestMaintenance() {
    if (!installation) return;
    setRequesting(true);
    try {
      await requestMaintenance(installation.id);
      await load();
      Alert.alert("Заявката е изпратена", "Наш техник ще се свърже с вас за уговаряне на час.");
    } catch (e) {
      Alert.alert("Грешка", (e as Error).message);
    } finally {
      setRequesting(false);
    }
  }

  if (installation === undefined) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (installation === null) {
    return (
      <SafeAreaView style={styles.safe}>
        <TopBar onBack={() => router.back()} />
        <View style={styles.center}>
          <Text style={styles.notFound}>Климатикът не е намерен.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const days = daysUntilService(installation.next_service_at);
  const badge = serviceBadge(days);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <TopBar onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Hero carousel */}
        <View style={styles.heroWrap}>
          {photoUrls.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.hero}
            >
              {photoUrls.map((url, i) => (
                <Image
                  key={i}
                  source={{ uri: url }}
                  style={[styles.heroImage, { width: SCREEN_WIDTH }]}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.hero, styles.heroEmpty, { width: SCREEN_WIDTH }]}>
              <Snowflake color={colors.primary} size={48} />
            </View>
          )}
        </View>

        <View style={styles.body}>
          {/* Title */}
          <View style={{ gap: 4 }}>
            <Text style={styles.brand}>{installation.brand || "Климатик"}</Text>
            <Text style={styles.model}>
              {installation.model}
              {installation.btu ? ` • ${installation.btu.toLocaleString("bg-BG")} BTU` : ""}
            </Text>
          </View>

          {/* Service status card */}
          <View style={styles.serviceCard}>
            <View style={styles.serviceHead}>
              <CalendarDays color={colors.primary} size={20} />
              <Text style={styles.serviceLabel}>Следваща профилактика</Text>
            </View>
            <Text style={styles.serviceDate}>{formatDate(installation.next_service_at)}</Text>
            <Badge tone={badge.tone} label={badge.label} />
            {pendingRequest ? (
              <View style={styles.pendingNotice}>
                <Text style={styles.pendingText}>
                  {pendingRequest.status === "scheduled"
                    ? "Уговорена за " + (pendingRequest.scheduled_at ? formatDate(pendingRequest.scheduled_at) : "—")
                    : "Заявката е получена — ще се свържем с вас."}
                </Text>
              </View>
            ) : (
              <PrimaryButton
                label="Заяви профилактика"
                onPress={onRequestMaintenance}
                loading={requesting}
                style={{ marginTop: spacing.sm }}
              />
            )}
          </View>

          {/* Specs */}
          <SpecRow icon={<ShieldCheck color={colors.mutedForeground} size={18} />} label="Гаранция до">
            <Text style={styles.specValue}>{formatDate(installation.warranty_until)}</Text>
          </SpecRow>
          <SpecRow icon={<CalendarDays color={colors.mutedForeground} size={18} />} label="Монтиран на">
            <Text style={styles.specValue}>{formatDate(installation.install_date)}</Text>
          </SpecRow>
          {installation.serial ? (
            <SpecRow icon={<ShieldCheck color={colors.mutedForeground} size={18} />} label="Сериен номер">
              <Text style={[styles.specValue, styles.specMono]}>{installation.serial}</Text>
            </SpecRow>
          ) : null}
          {installation.address ? (
            <SpecRow icon={<MapPin color={colors.mutedForeground} size={18} />} label="Адрес">
              <Text style={styles.specValue}>{installation.address}</Text>
            </SpecRow>
          ) : null}

          {installation.notes ? (
            <View style={styles.notesCard}>
              <Text style={styles.notesLabel}>Бележки от техник</Text>
              <Text style={styles.notesBody}>{installation.notes}</Text>
            </View>
          ) : null}

          {/* Service history */}
          {jobs.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>История на работите</Text>
              {jobs.map((job) => (
                <JobRow key={job.id} job={job} />
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TopBar({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.topBar}>
      <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
        <ChevronLeft color={colors.foreground} size={24} />
      </Pressable>
    </View>
  );
}

function SpecRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.specRow}>
      <View style={styles.specLabelWrap}>
        {icon}
        <Text style={styles.specLabel}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

function JobRow({ job }: { job: ServiceJobSummary }) {
  const tone: BadgeTone =
    job.status === "done"
      ? "success"
      : job.status === "cancelled"
        ? "neutral"
        : job.status === "scheduled" || job.status === "in_progress"
          ? "primary"
          : "warning";
  const label = jobLabel(job);
  const date = job.completed_at ?? job.scheduled_at ?? job.created_at;
  return (
    <View style={styles.jobRow}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={styles.jobTitle}>{jobTypeLabel(job.type)}</Text>
        <Text style={styles.jobDate}>{formatDate(date)}</Text>
        {job.work_done ? <Text style={styles.jobNotes}>{job.work_done}</Text> : null}
      </View>
      <Badge tone={tone} label={label} />
    </View>
  );
}

function jobTypeLabel(type: ServiceJobSummary["type"]): string {
  return type === "maintenance" ? "Профилактика" : "Ремонт";
}

function jobLabel(job: ServiceJobSummary): string {
  switch (job.status) {
    case "requested":
      return "Заявена";
    case "scheduled":
      return "Уговорена";
    case "in_progress":
      return "В процес";
    case "done":
      return "Завършена";
    case "cancelled":
      return "Отказана";
  }
}

function serviceBadge(days: number): { tone: BadgeTone; label: string } {
  if (days < 0) return { tone: "danger", label: `Просрочена с ${-days} дни` };
  if (days === 0) return { tone: "warning", label: "Днес" };
  if (days <= 7) return { tone: "warning", label: `След ${days} дни` };
  if (days <= 30) return { tone: "primary", label: `След ${days} дни` };
  return { tone: "success", label: `След ${days} дни` };
}

function formatDate(iso: string): string {
  const d = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
  return d.toLocaleDateString("bg-BG", { day: "2-digit", month: "long", year: "numeric" });
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFound: { color: colors.mutedForeground, fontSize: fontSize.base },
  topBar: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.muted,
  },
  scroll: { paddingBottom: spacing["3xl"] },
  heroWrap: {
    backgroundColor: colors.primaryLight,
    height: 260,
  },
  hero: { height: 260 },
  heroImage: { height: 260 },
  heroEmpty: { alignItems: "center", justifyContent: "center" },
  body: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  brand: {
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    letterSpacing: -0.3,
  },
  model: { fontSize: fontSize.base, color: colors.mutedForeground },
  serviceCard: {
    backgroundColor: colors.muted,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  serviceHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  serviceLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.mutedForeground,
  },
  serviceDate: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  pendingNotice: {
    marginTop: spacing.sm,
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  pendingText: {
    fontSize: fontSize.sm,
    color: colors.primaryDark,
    fontWeight: fontWeight.medium,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  specLabelWrap: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  specLabel: { fontSize: fontSize.sm, color: colors.mutedForeground },
  specValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
    maxWidth: "60%",
    textAlign: "right",
  },
  specMono: { fontFamily: undefined, letterSpacing: 0.5 },
  notesCard: {
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  notesLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  notesBody: { fontSize: fontSize.sm, color: colors.foreground, lineHeight: 22 },
  section: { gap: spacing.md, marginTop: spacing.sm },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  jobRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  jobTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  jobDate: { fontSize: fontSize.xs, color: colors.mutedForeground },
  jobNotes: { fontSize: fontSize.xs, color: colors.mutedForeground, marginTop: 2 },
});
