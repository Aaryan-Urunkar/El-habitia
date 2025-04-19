import { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { ThemedText } from '@/components/ui/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useAuthStore } from '@/store/authStore';

// Message type
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Initial welcome message
const WELCOME_MESSAGE: Message = {
  id: '0',
  text: "Hello! I'm your El-habitia assistant. How can I help with your habits today?",
  sender: 'bot',
  timestamp: new Date(),
};

// Suggested questions
const SUGGESTIONS = [
  "How do I build a meditation habit?",
  "Tips for drinking more water",
  "How to track my progress better?",
  "Help me stay motivated"
];

// Bot responses for demo
const BOT_RESPONSES: {[key: string]: string} = {
  "how do i build a meditation habit?": 
    "Start with just 2 minutes a day. Find a quiet place and focus on your breath. Consistency is more important than duration. Try using the same time and place each day to establish a strong habit cue.",
  "tips for drinking more water":
    "1. Keep a water bottle with you at all times. 2. Set reminders on your phone. 3. Replace one sugary drink with water each day. 4. Add flavor with fruit if plain water is boring.",
  "how to track my progress better?":
    "Use El-habitia's streak feature to track consecutive days. Also, consider journaling your experience briefly, noting how you feel after completing your habit. Visual progress like charts can be very motivating.",
  "help me stay motivated":
    "Try the 'don't break the chain' method - each day you complete your habit, you build momentum. Also, find an accountability partner or join our community to share your journey."
};

export default function ChatbotScreen() {
  const { colors, scheme } = useTheme();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Handle message sending
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const lowerCaseInput = inputText.trim().toLowerCase();
      
      // Find matching response or use default
      let responseText = "I'm not sure about that. Could you try asking something about habit formation or tracking?";
      
      // Check for approximate matches
      for (const key of Object.keys(BOT_RESPONSES)) {
        if (lowerCaseInput.includes(key) || key.includes(lowerCaseInput)) {
          responseText = BOT_RESPONSES[key];
          break;
        }
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle suggestion tap
  const handleSuggestionTap = (suggestion: string) => {
    setInputText(suggestion);
    // Optional: automatically send the suggestion
    // setTimeout(() => handleSendMessage(), 100);
  };

  // Render each message
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isUser = item.sender === 'user';
    
    return (
      <Animated.View
        entering={FadeInUp.delay(index * 50).springify()}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.botMessageContainer,
          { backgroundColor: isUser ? colors.primary + '20' : colors.card }
        ]}
      >
        {!isUser && (
          <View 
            style={[
              styles.botAvatar, 
              { backgroundColor: colors.primary }
            ]}
          >
            <IconSymbol name="bubble.left.fill" color="#FFFFFF" size={16} />
          </View>
        )}
        
        <View style={[
          styles.messageContent,
          isUser ? styles.userMessageContent : styles.botMessageContent
        ]}>
          <ThemedText>{item.text}</ThemedText>
          <ThemedText 
            variant="caption" 
            style={[
              styles.timestamp,
              { color: colors.subtext }
            ]}
          >
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </ThemedText>
        </View>
      </Animated.View>
    );
  };

  // Render suggestions
  const renderSuggestions = () => {
    if (messages.length > 1) return null;
    
    return (
      <View style={styles.suggestionsContainer}>
        <ThemedText variant="subtitle" style={styles.suggestionsTitle}>
          Try asking:
        </ThemedText>
        <View style={styles.suggestions}>
          {SUGGESTIONS.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.suggestionChip,
                { backgroundColor: colors.background, borderColor: colors.border }
              ]}
              onPress={() => handleSuggestionTap(suggestion)}
            >
              <ThemedText style={styles.suggestionText}>{suggestion}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.botInfoContainer}>
            <View style={[styles.botIconContainer, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="bubble.left.right.fill" color={colors.primary} size={24} />
            </View>
            <View>
              <ThemedText variant="subtitle">Habit Assistant</ThemedText>
              <View style={styles.statusContainer}>
                <View style={[styles.statusIndicator, { backgroundColor: colors.success }]} />
                <ThemedText variant="caption" style={{ color: colors.success }}>Online</ThemedText>
              </View>
            </View>
          </View>
        </View>
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesContainer}
          ListFooterComponent={
            isTyping ? (
              <View style={[
                styles.typingIndicator,
                { backgroundColor: colors.card }
              ]}>
                <ActivityIndicator size="small" color={colors.primary} />
                <ThemedText style={{ marginLeft: 8 }}>Thinking...</ThemedText>
              </View>
            ) : renderSuggestions()
          }
        />
        
        <View style={[
          styles.inputContainer,
          { 
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          }
        ]}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor={colors.subtext}
            style={[
              styles.input,
              { 
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text,
              }
            ]}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: colors.primary },
              !inputText.trim() && { opacity: 0.5 }
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <IconSymbol name="arrow.up" color="#FFFFFF" size={18} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  botInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    flexDirection: 'row',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageContent: {
    flexShrink: 1,
  },
  userMessageContent: {
    alignItems: 'flex-end',
  },
  botMessageContent: {
    alignItems: 'flex-start',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    marginRight: 12,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    maxHeight: 120,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  suggestionsContainer: {
    marginTop: 20,
  },
  suggestionsTitle: {
    marginBottom: 12,
  },
  suggestions: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    margin: 4,
  },
  suggestionText: {
    fontSize: 14,
  },
});
