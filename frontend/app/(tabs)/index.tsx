import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import MoodCategoryButton from "../../components/mood-category-button"
import SleepMetrics from "../../components/sleep-metric"

type HomeScreenProps = {}

export default function HomeScreen({}: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>👩‍🚀</Text>
          </View>
          <View style={styles.headerDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <TouchableOpacity style={styles.refreshButton}>
            <Feather name="refresh-cw" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Question based on your mood</Text>

        <LinearGradient
          colors={["#E0F7FA", "#B2EBF2"]}
          style={styles.questionCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.questionText}>
            Everything falls in place when you feel grateful, why are you feeling greatful?
          </Text>

          <View style={styles.categoriesContainer}>
            <View style={styles.categoryRow}>
              <MoodCategoryButton icon="😴" label="Sleep" />
              <MoodCategoryButton icon="🛍️" label="Shopping" />
              <MoodCategoryButton icon="🏃‍♂️" label="Activity" />
            </View>
            <View style={styles.categoryRow}>
              <MoodCategoryButton icon="🌤️" label="Weather" />
              <MoodCategoryButton icon="🎉" label="Party" />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Other answer..." placeholderTextColor="#A0A0A0" />
            <TouchableOpacity style={styles.sendButton}>
              <Feather name="send" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Recommendation based on mood</Text>

        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationTitle}>Improve your sleep</Text>

          <View style={styles.sleepInfoContainer}>
            <View style={styles.sleepCircleContainer}>
              <View style={styles.sleepCircleOuter}>
                <View style={styles.sleepCircleInner}>
                  <View style={styles.sleepCircleCore} />
                </View>
              </View>
            </View>

            <View style={styles.sleepTextContainer}>
              <Text style={styles.sleepMainText}>You wakeup 4 times during sleep which is not good</Text>
              <TouchableOpacity>
                <Text style={styles.courseText}>Take a course</Text>
              </TouchableOpacity>
            </View>
          </View>

          <SleepMetrics />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#9C27B0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
  },
  headerDots: {
    flexDirection: "row",
    marginLeft: 10,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#000",
    marginRight: 3,
  },
  refreshButton: {
    marginLeft: "auto",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  questionCard: {
    backgroundColor: "#E0F7FA",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  questionText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "#000",
    marginBottom: 20,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  recommendationCard: {
    backgroundColor: "#FFF5F7",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  recommendationTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#000",
    marginBottom: 15,
  },
  sleepInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sleepCircleContainer: {
    width: 70,
    height: 70,
    marginRight: 15,
  },
  sleepCircleOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 8,
    borderColor: "#9C27B0",
    opacity: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  sleepCircleInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 8,
    borderColor: "#9C27B0",
    opacity: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  sleepCircleCore: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#9C27B0",
    opacity: 0.9,
  },
  sleepTextContainer: {
    flex: 1,
  },
  sleepMainText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#000",
    marginBottom: 5,
  },
  courseText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#9C27B0",
  },
})
