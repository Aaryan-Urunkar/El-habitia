import { View, StyleSheet } from "react-native"
import { ThemedText } from "@/components/ui/ThemedText"
import { useTheme } from "@/components/theme/ThemeProvider"

export default function SleepMetrics() {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderRadius: 10 }]}>
      <View style={styles.metricItem}>
        <View style={styles.metricValueContainer}>
          <ThemedText style={[styles.metricValue, { color: colors.primary }]}>6</ThemedText>
          <ThemedText style={[styles.metricUnit, { color: colors.subtext }]}>hr</ThemedText>
        </View>
        <ThemedText style={[styles.metricLabel, { color: colors.subtext }]}>short sleep</ThemedText>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.metricItem}>
        <View style={styles.metricValueContainer}>
          <ThemedText style={[styles.metricValue, { color: colors.primary }]}>2.2</ThemedText>
          <ThemedText style={[styles.metricUnit, { color: colors.subtext }]}>hr</ThemedText>
        </View>
        <ThemedText style={[styles.metricLabel, { color: colors.subtext }]}>deep sleep</ThemedText>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.metricItem}>
        <View style={styles.metricValueContainer}>
          <ThemedText style={[styles.metricValue, { color: colors.primary }]}>4</ThemedText>
          <ThemedText style={[styles.metricUnit, { color: colors.subtext }]}>wakes</ThemedText>
        </View>
        <ThemedText style={[styles.metricLabel, { color: colors.subtext }]}>during the night</ThemedText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricValueContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  metricValue: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 18,
  },
  metricUnit: {
    fontFamily: "Nunito-Regular",
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 2,
  },
  metricLabel: {
    fontFamily: "Nunito-Regular",
    fontSize: 12,
    marginTop: 5,
  },
  divider: {
    width: 1,
    height: "100%",
  },
})
