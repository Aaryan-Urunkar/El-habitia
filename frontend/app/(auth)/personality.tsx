import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  key: 'procrastinationResponse' | 'sleepResponse' | 'alcoholSmokingResponse';
}

export default function Personality() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState({
    procrastinationResponse: '',
    sleepResponse: '',
    alcoholSmokingResponse: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const router = useRouter();

  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: "How do you typically handle tasks?",
      options: ["I do them right away", "I plan and follow schedules", "I wait until the deadline approaches", "I often miss deadlines"],
      key: "procrastinationResponse"
    },
    {
      id: 2, 
      question: "How would you describe your sleep habits?",
      options: ["Regular 7-8 hours", "Variable but usually sufficient", "Often less than needed", "Very irregular"],
      key: "sleepResponse"
    },
    {
      id: 3,
      question: "Regarding alcohol/smoking habits:",
      options: ["I don't drink/smoke", "Occasional social use", "Regular moderate use", "Heavy use"],
      key: "alcoholSmokingResponse"
    }
  ];

  useEffect(() => {
    // Animation when question changes
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
    
    return () => {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    };
  }, [currentQuestion]);

  const handleOptionSelect = (option: string) => {
    const currentQuestionData = questions[currentQuestion];
    setAnswers(prev => ({
      ...prev,
      [currentQuestionData.key]: option
    }));

    if (currentQuestion < questions.length - 1) {
      // Prepare for next question with animation reset
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    }
  };

  const submitAnswers = async () => {
    try {
      setIsSubmitting(true);
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      
      if (!token || !userId) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/auth/personality', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          uid: userId,
          procrastinationResponse: answers.procrastinationResponse,
          sleepResponse: answers.sleepResponse,
          alcoholSmokingResponse: answers.alcoholSmokingResponse
        })
      });

      if (response.ok) {
        router.push('/(tabs)'); // Redirect after successful submission
      } else {
        throw new Error('Failed to submit personality data');
      }
    } catch (error) {
      console.error('Error submitting personality quiz:', error);
      alert('Failed to submit your answers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    const questionData = questions[currentQuestion];
    
    return (
      <Animated.View 
        style={[
          styles.questionContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
      >
        <Text style={styles.questionText}>{questionData.question}</Text>
        
        <View style={styles.optionsContainer}>
          {questionData.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                answers[questionData.key] === option && styles.selectedOption
              ]}
              onPress={() => handleOptionSelect(option)}
            >
              <Text 
                style={[
                  styles.optionText, 
                  answers[questionData.key] === option && styles.selectedOptionText
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {currentQuestion === questions.length - 1 && (
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              (!answers.procrastinationResponse || !answers.sleepResponse || !answers.alcoholSmokingResponse) && styles.disabledButton
            ]}
            onPress={submitAnswers}
            disabled={!answers.procrastinationResponse || !answers.sleepResponse || !answers.alcoholSmokingResponse || isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit Answers'}
            </Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.progressContainer}>
          {questions.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.progressDot,
                index === currentQuestion ? styles.activeDot : 
                index < currentQuestion ? styles.completedDot : {}
              ]} 
            />
          ))}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personality Quiz</Text>
      <Text style={styles.subtitle}>Help us understand you better!</Text>
      
      {renderQuestion()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4E4FEB',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
    textAlign: 'center',
  },
  questionContainer: {
    width: '100%',
    maxWidth: 500,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    padding: 15,
    backgroundColor: '#f0f0f7',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e7',
  },
  selectedOption: {
    backgroundColor: '#4E4FEB20',
    borderColor: '#4E4FEB',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#4E4FEB',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4E4FEB',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#c0c0c0',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e7',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#4E4FEB',
    transform: [{ scale: 1.2 }],
  },
  completedDot: {
    backgroundColor: '#a0a0fc',
  },
});