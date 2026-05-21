import { useState } from "react";
import { View, Text, Pressable, Image, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { Camera, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { colors, fontSize, fontWeight, radius, spacing } from "@/lib/theme";

interface PhotoSlotProps {
  label: string;
  required?: boolean;
  uri: string | null;
  uploading?: boolean;
  onCapture: (localUri: string) => void;
  onRemove?: () => void;
}

export function PhotoSlot({
  label,
  required,
  uri,
  uploading,
  onCapture,
  onRemove,
}: PhotoSlotProps) {
  const [opening, setOpening] = useState(false);

  async function pick() {
    setOpening(true);
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert(
          "Достъп до камерата",
          "Разрешете достъп до камерата в настройките на устройството.",
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.6,
        exif: false,
      });
      if (!result.canceled && result.assets[0]) {
        onCapture(result.assets[0].uri);
      }
    } finally {
      setOpening(false);
    }
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
        {uri && onRemove ? (
          <Pressable onPress={onRemove} hitSlop={8}>
            <X color={colors.mutedForeground} size={16} />
          </Pressable>
        ) : null}
      </View>

      <Pressable
        onPress={pick}
        style={({ pressed }) => [
          styles.box,
          uri ? styles.boxFilled : null,
          pressed && styles.boxPressed,
        ]}
        disabled={opening || uploading}
      >
        {uri ? (
          <>
            <Image source={{ uri }} style={styles.image} resizeMode="cover" />
            {uploading ? (
              <View style={styles.overlay}>
                <ActivityIndicator color={colors.primaryForeground} />
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.placeholder}>
            {opening ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <Camera color={colors.primary} size={28} />
                <Text style={styles.placeholderText}>Снимай</Text>
              </>
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
}

const SIZE = 112;

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs, width: SIZE },
  labelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: fontSize.xs, fontWeight: fontWeight.medium, color: colors.foreground },
  required: { color: colors.danger },
  box: {
    width: SIZE,
    height: SIZE,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.border,
    backgroundColor: colors.muted,
    overflow: "hidden",
  },
  boxFilled: {
    borderStyle: "solid",
    borderColor: colors.primary,
  },
  boxPressed: { opacity: 0.85 },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  placeholderText: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    fontWeight: fontWeight.medium,
  },
  image: { width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
});
