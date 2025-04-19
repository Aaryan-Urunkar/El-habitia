import { View, Text, StyleSheet } from "react-native"

export default function SleepMetrics() {
  return (
    <View style={styles.container}>
      <View style={styles.metricItem}>
        <View style={styles.metricValueContainer}>
          <Text style={styles.metricValue}>6</Text>
          <Text style={styles.metricUnit}>hr</Text>
        </View>
        <Text style={styles.metricLabel}>short sleep</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.metricItem}>
        <View style={styles.metricValueContainer}>
          <Text style={styles.metricValue}>2.2</Text>
          <Text style={styles.metricUnit}>hr</Text>
        </View>
        <Text style={styles.metricLabel}>deep sleep</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.metricItem}>
        <View style={styles.metricValueContainer}>
          <Text style={styles.metricValue}>4</Text>
          <Text style={styles.metricUnit}>wakes</Text>
        </View>
        <Text style={styles.metricLabel}>during the night</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
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
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "#9C27B0",
  },
  metricUnit: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#555",
    marginBottom: 2,
    marginLeft: 2,
  },
  metricLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#555",
    marginTop: 5,
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#DDD",
  },
})
