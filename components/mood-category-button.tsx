import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

interface MoodCategoryButtonProps {
  icon: string
  label: string
}

export default function MoodCategoryButton({ icon, label }: MoodCategoryButtonProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: "#000",
  },
})
