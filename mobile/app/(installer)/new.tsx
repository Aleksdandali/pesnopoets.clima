import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin } from "lucide-react-native";
import * as Location from "expo-location";
import { colors, fontSize, fontWeight, radius, spacing, shadow } from "@/lib/theme";
import { FormField } from "@/components/FormField";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Chips } from "@/components/Chips";
import { PrimaryButton } from "@/components/PrimaryButton";
import {
  createInstallation,
  generateUuid,
  uploadInstallationPhoto,
  type PhotoKind,
} from "@/lib/installer";

const BRAND_OPTIONS = [
  { value: "Daikin", label: "Daikin" },
  { value: "Mitsubishi", label: "Mitsubishi" },
  { value: "Toshiba", label: "Toshiba" },
  { value: "Gree", label: "Gree" },
  { value: "Inventor", label: "Inventor" },
  { value: "TCL", label: "TCL" },
  { value: "Friax", label: "Friax" },
  { value: "Other", label: "Друга" },
] as const;

const BTU_OPTIONS = [
  { value: 9000, label: "9 000" },
  { value: 12000, label: "12 000" },
  { value: 18000, label: "18 000" },
  { value: 24000, label: "24 000" },
  { value: 36000, label: "36 000" },
] as const;

const WARRANTY_OPTIONS = [
  { value: 12, label: "12 м." },
  { value: 24, label: "24 м." },
  { value: 36, label: "36 м." },
  { value: 60, label: "60 м." },
] as const;

interface PhotoState {
  localUri: string | null;
  remotePath: string | null;
  uploading: boolean;
}

const emptyPhoto: PhotoState = { localUri: null, remotePath: null, uploading: false };

type BrandValue = (typeof BRAND_OPTIONS)[number]["value"];

export default function NewInstallationScreen() {
  // Generate a stable installation id for the session — used for photo paths
  // and the eventual DB row. Re-generated when the form resets after save.
  const [installationId, setInstallationId] = useState(() => generateUuid());

  const [phone, setPhone] = useState("+359");
  const [clientName, setClientName] = useState("");
  const [brand, setBrand] = useState<BrandValue | null>(null);
  const [brandOther, setBrandOther] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [btu, setBtu] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [warrantyMonths, setWarrantyMonths] = useState(36);
  const [notes, setNotes] = useState("");

  const [indoor, setIndoor] = useState<PhotoState>(emptyPhoto);
  const [outdoor, setOutdoor] = useState<PhotoState>(emptyPhoto);
  const [label, setLabel] = useState<PhotoState>(emptyPhoto);
  const [extras, setExtras] = useState<PhotoState[]>([]);

  const [gpsBusy, setGpsBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resolvedBrand = brand === "Other" ? brandOther.trim() : brand ?? "";
  const requiredReady =
    !!indoor.remotePath && !!outdoor.remotePath && !!label.remotePath;
  const anyUploading =
    indoor.uploading || outdoor.uploading || label.uploading ||
    extras.some((e) => e.uploading);

  function setPhotoFor(kind: PhotoKind, value: PhotoState, index?: number) {
    if (kind === "indoor") setIndoor(value);
    else if (kind === "outdoor") setOutdoor(value);
    else if (kind === "label") setLabel(value);
    else {
      setExtras((arr) => {
        const next = [...arr];
        if (typeof index === "number") next[index] = value;
        return next;
      });
    }
  }

  async function handlePhotoCapture(kind: PhotoKind, localUri: string, index?: number) {
    setPhotoFor(kind, { localUri, remotePath: null, uploading: true }, index);
    try {
      const remotePath = await uploadInstallationPhoto({
        localUri,
        installationId,
        kind,
        index,
      });
      setPhotoFor(kind, { localUri, remotePath, uploading: false }, index);
    } catch (e) {
      setPhotoFor(kind, { localUri, remotePath: null, uploading: false }, index);
      Alert.alert("Грешка при качване", (e as Error).message);
    }
  }

  function handlePhotoRemove(kind: PhotoKind, index?: number) {
    if (kind === "extra" && typeof index === "number") {
      setExtras((arr) => arr.filter((_, i) => i !== index));
    } else {
      setPhotoFor(kind, emptyPhoto);
    }
  }

  function addExtraSlot() {
    setExtras((arr) => [...arr, emptyPhoto]);
  }

  async function handleAutoFillLocation() {
    setGpsBusy(true);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert("Достъп до локацията", "Разрешете в настройките на устройството.");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });

      const places = await Location.reverseGeocodeAsync(pos.coords);
      const p = places[0];
      if (p) {
        const parts = [p.street, p.streetNumber, p.city].filter(Boolean);
        if (parts.length) setAddress(parts.join(" "));
      }
    } catch (e) {
      Alert.alert("Грешка GPS", (e as Error).message);
    } finally {
      setGpsBusy(false);
    }
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!/^\+\d{10,15}$/.test(phone.trim())) next.phone = "Невалиден телефон (+359...)";
    if (!resolvedBrand) next.brand = "Изберете марка";
    if (!model.trim()) next.model = "Моделът е задължителен";
    if (!indoor.remotePath) next.indoor = "Снимка на вътрешното тяло";
    if (!outdoor.remotePath) next.outdoor = "Снимка на външното тяло";
    if (!label.remotePath) next.label = "Снимка на табелката";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function resetForm() {
    setInstallationId(generateUuid());
    setPhone("+359");
    setClientName("");
    setBrand(null);
    setBrandOther("");
    setModel("");
    setSerial("");
    setBtu(null);
    setAddress("");
    setCoords(null);
    setWarrantyMonths(36);
    setNotes("");
    setIndoor(emptyPhoto);
    setOutdoor(emptyPhoto);
    setLabel(emptyPhoto);
    setExtras([]);
    setErrors({});
  }

  async function handleSave() {
    if (!validate()) return;
    if (anyUploading) {
      Alert.alert("Изчакайте", "Снимките още се качват.");
      return;
    }
    setSaving(true);
    try {
      await createInstallation({
        installationId,
        phone: phone.trim(),
        clientName: clientName.trim() || undefined,
        brand: resolvedBrand,
        model: model.trim(),
        serial: serial.trim() || undefined,
        btu: btu ?? undefined,
        address: address.trim() || undefined,
        lat: coords?.lat,
        lng: coords?.lng,
        warrantyMonths,
        notes: notes.trim() || undefined,
        indoorPhotoPath: indoor.remotePath!,
        outdoorPhotoPath: outdoor.remotePath!,
        labelPhotoPath: label.remotePath!,
        extraPhotoPaths: extras.map((e) => e.remotePath).filter((p): p is string => !!p),
      });
      Alert.alert("Готово", "Монтажът е записан. Клиентът ще получи SMS.", [
        { text: "Нов монтаж", onPress: resetForm },
      ]);
    } catch (e) {
      Alert.alert("Грешка при запис", (e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const saveLabel = useMemo(
    () => (anyUploading ? "Изчакване..." : requiredReady ? "Запази монтаж" : "Запази монтаж"),
    [anyUploading, requiredReady],
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.headerWrap}>
            <Text style={styles.h1}>Нов монтаж</Text>
            <Text style={styles.h1Sub}>Попълнете на място, преди да си тръгнете.</Text>
          </View>

          {/* Client */}
          <Section title="Клиент">
            <FormField
              label="Телефон"
              required
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
              placeholder="+359..."
              error={errors.phone}
            />
            <FormField
              label="Име"
              value={clientName}
              onChangeText={setClientName}
              placeholder="По избор"
              autoComplete="name"
            />
          </Section>

          {/* Climate unit */}
          <Section title="Климатик">
            <Chips
              label="Марка"
              required
              options={BRAND_OPTIONS}
              value={brand}
              onChange={(v) => setBrand(v)}
            />
            {errors.brand ? <Text style={styles.inlineError}>{errors.brand}</Text> : null}
            {brand === "Other" ? (
              <FormField
                label="Друга марка"
                value={brandOther}
                onChangeText={setBrandOther}
                placeholder="Въведете марка"
              />
            ) : null}
            <FormField
              label="Модел"
              required
              value={model}
              onChangeText={setModel}
              placeholder="напр. FTXJ25MW"
              error={errors.model}
            />
            <FormField
              label="Сериен номер"
              value={serial}
              onChangeText={setSerial}
              placeholder="От табелката"
              autoCapitalize="characters"
            />
            <Chips
              label="BTU"
              options={BTU_OPTIONS}
              value={btu}
              onChange={(v) => setBtu(v)}
            />
          </Section>

          {/* Photos */}
          <Section title="Снимки (задължителни)" subtitle="Тапни, за да направиш снимка.">
            <View style={styles.photoRow}>
              <PhotoSlot
                label="Вътрешно"
                required
                uri={indoor.localUri}
                uploading={indoor.uploading}
                onCapture={(uri) => handlePhotoCapture("indoor", uri)}
                onRemove={() => handlePhotoRemove("indoor")}
              />
              <PhotoSlot
                label="Външно"
                required
                uri={outdoor.localUri}
                uploading={outdoor.uploading}
                onCapture={(uri) => handlePhotoCapture("outdoor", uri)}
                onRemove={() => handlePhotoRemove("outdoor")}
              />
              <PhotoSlot
                label="Табелка"
                required
                uri={label.localUri}
                uploading={label.uploading}
                onCapture={(uri) => handlePhotoCapture("label", uri)}
                onRemove={() => handlePhotoRemove("label")}
              />
            </View>
            {errors.indoor || errors.outdoor || errors.label ? (
              <Text style={styles.inlineError}>
                {[errors.indoor, errors.outdoor, errors.label].filter(Boolean).join(" • ")}
              </Text>
            ) : null}

            {extras.length > 0 ? (
              <View style={styles.photoRow}>
                {extras.map((p, i) => (
                  <PhotoSlot
                    key={i}
                    label={`Доп. ${i + 1}`}
                    uri={p.localUri}
                    uploading={p.uploading}
                    onCapture={(uri) => handlePhotoCapture("extra", uri, i)}
                    onRemove={() => handlePhotoRemove("extra", i)}
                  />
                ))}
              </View>
            ) : null}

            <Pressable onPress={addExtraSlot} style={styles.addExtra}>
              <Text style={styles.addExtraText}>+ Допълнителна снимка</Text>
            </Pressable>
          </Section>

          {/* Location */}
          <Section title="Място">
            <FormField
              label="Адрес"
              value={address}
              onChangeText={setAddress}
              placeholder="ул. ..., Варна"
              trailing={
                <Pressable onPress={handleAutoFillLocation} hitSlop={6} style={styles.gpsBtn}>
                  {gpsBusy ? (
                    <ActivityIndicator color={colors.primary} size="small" />
                  ) : (
                    <MapPin color={colors.primary} size={20} />
                  )}
                </Pressable>
              }
            />
            {coords ? (
              <Text style={styles.hint}>
                GPS: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </Text>
            ) : null}
          </Section>

          {/* Warranty */}
          <Section title="Гаранция">
            <Chips
              label="Срок"
              options={WARRANTY_OPTIONS}
              value={warrantyMonths}
              onChange={setWarrantyMonths}
            />
          </Section>

          {/* Notes */}
          <Section title="Бележки">
            <FormField
              label="Свободен текст"
              value={notes}
              onChangeText={setNotes}
              placeholder="Дължина на трасе, особености..."
              multiline
              numberOfLines={3}
              style={{ height: 88, paddingTop: spacing.md, textAlignVertical: "top" }}
            />
          </Section>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Sticky save */}
        <View style={styles.stickyBar}>
          <PrimaryButton
            label={saveLabel}
            onPress={handleSave}
            loading={saving}
            disabled={anyUploading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSub}>{subtitle}</Text> : null}
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing["2xl"],
  },
  headerWrap: { gap: 2 },
  h1: {
    fontSize: fontSize["3xl"],
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  h1Sub: { fontSize: fontSize.sm, color: colors.mutedForeground },
  section: { gap: spacing.md },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  sectionSub: { fontSize: fontSize.xs, color: colors.mutedForeground, marginTop: 2 },
  sectionBody: { gap: spacing.md },
  photoRow: { flexDirection: "row", gap: spacing.md, flexWrap: "wrap" },
  addExtra: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  addExtraText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  inlineError: { fontSize: fontSize.xs, color: colors.danger },
  hint: { fontSize: fontSize.xs, color: colors.mutedForeground },
  gpsBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  stickyBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadow.lg,
  },
});
