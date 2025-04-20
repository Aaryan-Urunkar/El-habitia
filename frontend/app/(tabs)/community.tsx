import { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  FlatList, 
  RefreshControl,
  TextInput,
  Modal,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/ui/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// User profile data
const USER_PROFILE = {
  name: 'Jordan Smith',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100',
};

// Placeholder post data
interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
  mode: 'growth' | 'action';
  liked: boolean;
}

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: 'Sarah Lee',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100',
    content: 'Just completed my 30-day meditation streak! The morning clarity is real. Anyone else practice meditation?',
    likes: 24,
    comments: 7,
    timeAgo: '2h',
    mode: 'growth',
    liked: false,
  },
  {
    id: '2',
    author: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100',
    content: 'Crushed my workout today! 💪 New personal record on deadlifts - 315lbs for 5 reps.',
    likes: 18,
    comments: 5,
    timeAgo: '4h',
    mode: 'action',
    liked: false,
  },
  {
    id: '3',
    author: 'Taylor Jones',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100',
    content: 'Does anyone have recommendations for good habit tracking techniques? I\'m trying to build a consistent reading habit.',
    likes: 9,
    comments: 12,
    timeAgo: '8h',
    mode: 'growth',
    liked: false,
  },
  {
    id: '4',
    author: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100',
    content: 'Day 15 of drinking more water and less coffee. Sleep quality has improved dramatically!',
    likes: 31,
    comments: 8,
    timeAgo: '1d',
    mode: 'growth',
    liked: true,
  },
];

export default function CommunityScreen() {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedMode, setSelectedMode] = useState<'growth' | 'action'>('growth');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  
  const fabScale = useSharedValue(1);
  const fabOpacity = useSharedValue(1);
  const scrollY = useSharedValue(0);
  const headerOpacity = useSharedValue(1);
  const modalTranslateY = useSharedValue(500);
  
  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        fabOpacity.value = withSpring(0);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        fabOpacity.value = withSpring(1);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  interface ScrollEvent {
    nativeEvent: {
      contentOffset: {
        y: number;
      };
    };
  }

  const onScroll = (event: ScrollEvent) => {
    const scrollingUp = event.nativeEvent.contentOffset.y < scrollY.value;
    scrollY.value = event.nativeEvent.contentOffset.y;
    
    if (scrollY.value > 100 && !scrollingUp) {
      fabOpacity.value = withSpring(0);
      headerOpacity.value = withSpring(0.95);
    } else {
      fabOpacity.value = withSpring(1);
      headerOpacity.value = withSpring(1);
    }
  };

  const fabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: fabScale.value }],
      opacity: fabOpacity.value,
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    };
  });

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleFabPress = () => {
    fabScale.value = withSpring(0.9);
    setTimeout(() => {
      fabScale.value = withSpring(1);
      setShowPostModal(true);
      modalTranslateY.value = withSpring(0);
    }, 100);
  };

  const handlePostSubmit = () => {
    if (newPostContent.trim() === '') return;
    
    const newPost = {
      id: (Date.now().toString()),
      author: USER_PROFILE.name,
      avatar: USER_PROFILE.avatar,
      content: newPostContent,
      likes: 0,
      comments: 0,
      timeAgo: 'just now',
      mode: selectedMode,
      liked: false,
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setShowPostModal(false);
    setSelectedMode('growth');
  };

  interface Post {
    id: string;
    author: string;
    avatar: string;
    content: string;
    likes: number;
    comments: number;
    timeAgo: string;
    mode: 'growth' | 'action';
    liked: boolean;
  }

  const handleLikePress = (postId: string): void => {
    setPosts(posts.map((post: Post) => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    }));
  };

  // Filter posts based on selected filter
  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(post => post.mode === activeFilter);

  const renderPost = ({ item, index }: { item: typeof posts[0]; index: number }) => (
    <Animated.View 
      entering={FadeIn.delay(index * 100).springify()}
      style={[styles.postCard, { backgroundColor: colors.card }]}
    >
      <View style={styles.postHeader}>
        <View style={styles.authorContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View>
            <ThemedText variant="subtitle" style={styles.authorName}>{item.author}</ThemedText>
            <ThemedText variant="caption" style={{ color: colors.subtext }}>{item.timeAgo}</ThemedText>
          </View>
        </View>
        
        <View 
          style={[
            styles.modeBadge, 
            { 
              backgroundColor: item.mode === 'growth' 
                ? colors.success + '20' 
                : colors.primary + '20'
            }
          ]}
        >
          <IconSymbol 
            name={item.mode === 'growth' ? 'leaf.fill' : 'flame.fill'}
            size={12}
            color={item.mode === 'growth' ? colors.success : colors.primary}
          />
          <ThemedText 
            style={[
              styles.modeText, 
              { 
                color: item.mode === 'growth' ? colors.success : colors.primary,
                fontFamily: colors.fonts.medium
              }
            ]}
          >
            {item.mode === 'growth' ? 'Growth' : 'Action'}
          </ThemedText>
        </View>
      </View>
      
      <ThemedText style={styles.postContent}>{item.content}</ThemedText>
      
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLikePress(item.id)}
        >
          <IconSymbol 
            name={item.liked ? "heart.fill" : "heart"} 
            size={18} 
            color={item.liked ? "#FF4F67" : colors.subtext} 
          />
          <ThemedText 
            variant="caption" 
            style={{ 
              color: item.liked ? "#FF4F67" : colors.subtext, 
              marginLeft: 4 
            }}
          >
            {item.likes}
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="bubble" size={18} color={colors.subtext} />
          <ThemedText variant="caption" style={{ color: colors.subtext, marginLeft: 4 }}>
            {item.comments}
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="arrowshape.turn.up.right" size={18} color={colors.subtext} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={scheme === 'chill' ? 'light' : 'dark'} />
      <View style={styles.container}>
        {/* Header with title and filters */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <ThemedText style={styles.headerTitle}>Community</ThemedText>
          
          <View style={styles.filtersContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScroll}
            >
              <TouchableOpacity 
                style={[
                  styles.filterButton, 
                  activeFilter === 'all' && { backgroundColor: colors.primary },
                ]}
                onPress={() => setActiveFilter('all')}
              >
                <ThemedText 
                  style={[
                    styles.filterText, 
                    { color: activeFilter === 'all' ? '#FFFFFF' : colors.text }
                  ]}
                >
                  All Posts
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterButton, 
                  activeFilter === 'growth' && { backgroundColor: colors.success },
                ]}
                onPress={() => setActiveFilter('growth')}
              >
                <IconSymbol name="leaf.fill" size={14} color={activeFilter === 'growth' ? '#FFFFFF' : colors.success} />
                <ThemedText 
                  style={[
                    styles.filterText, 
                    { color: activeFilter === 'growth' ? '#FFFFFF' : colors.text }
                  ]}
                >
                  Growth
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterButton, 
                  activeFilter === 'action' && { backgroundColor: colors.primary },
                ]}
                onPress={() => setActiveFilter('action')}
              >
                <IconSymbol name="flame.fill" size={14} color={activeFilter === 'action' ? '#FFFFFF' : colors.primary} />
                <ThemedText 
                  style={[
                    styles.filterText, 
                    { color: activeFilter === 'action' ? '#FFFFFF' : colors.text }
                  ]}
                >
                  Action
                </ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Animated.View>
        
        {/* Posts List */}
        <FlatList
          data={filteredPosts}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.postsContainer}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="bubble.left.and.bubble.right" size={48} color={colors.subtext} />
              <ThemedText style={styles.emptyText}>No posts found</ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Be the first to share your journey with the community
              </ThemedText>
            </View>
          }
        />
        
        {/* Floating Action Button */}
        <AnimatedTouchable 
          style={[styles.fab, { backgroundColor: colors.primary }, fabAnimatedStyle]}
          onPress={handleFabPress}
          activeOpacity={0.9}
        >
          <IconSymbol name="plus" size={24} color="#FFFFFF" />
        </AnimatedTouchable>

        {/* New Post Modal */}
        <Modal
          visible={showPostModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPostModal(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <Animated.View 
              style={[
                styles.modalContent, 
                { backgroundColor: colors.card },
                {
                  transform: [{ translateY: modalTranslateY }]
                }
              ]}
            >
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>Create Post</ThemedText>
                <TouchableOpacity 
                  onPress={() => setShowPostModal(false)}
                  style={styles.closeButton}
                >
                  <IconSymbol name="xmark" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.userInfoContainer}>
                <Image source={{ uri: USER_PROFILE.avatar }} style={styles.userAvatar} />
                <ThemedText style={styles.userName}>{USER_PROFILE.name}</ThemedText>
              </View>
              
              <View style={styles.modeSelector}>
                <ThemedText style={styles.modeSelectorLabel}>Post Type:</ThemedText>
                
                <View style={styles.modeButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.modeButton,
                      selectedMode === 'growth' && { 
                        backgroundColor: colors.success + '20',
                        borderColor: colors.success 
                      },
                    ]}
                    onPress={() => setSelectedMode('growth')}
                  >
                    <IconSymbol 
                      name="leaf.fill" 
                      size={16} 
                      color={colors.success} 
                    />
                    <ThemedText 
                      style={[
                        styles.modeButtonText,
                        { color: colors.success }
                      ]}
                    >
                      Growth
                    </ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.modeButton,
                      selectedMode === 'action' && { 
                        backgroundColor: colors.primary + '20',
                        borderColor: colors.primary 
                      },
                    ]}
                    onPress={() => setSelectedMode('action')}
                  >
                    <IconSymbol 
                      name="flame.fill" 
                      size={16} 
                      color={colors.primary} 
                    />
                    <ThemedText 
                      style={[
                        styles.modeButtonText,
                        { color: colors.primary }
                      ]}
                    >
                      Action
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
              
              <TextInput
                style={[
                  styles.postInput,
                  { 
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border 
                  }
                ]}
                placeholder="Share your journey with the community..."
                placeholderTextColor={colors.subtext}
                multiline
                value={newPostContent}
                onChangeText={setNewPostContent}
                autoFocus
              />
              
              <TouchableOpacity 
                style={[
                  styles.submitButton, 
                  { 
                    backgroundColor: newPostContent.trim() ? colors.primary : colors.subtext,
                    opacity: newPostContent.trim() ? 1 : 0.6
                  }
                ]}
                onPress={handlePostSubmit}
                disabled={!newPostContent.trim()}
              >
                <ThemedText style={styles.submitButtonText}>Post</ThemedText>
              </TouchableOpacity>
            </Animated.View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 12,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#FFFFFF10',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  filtersContainer: {
    marginBottom: 8,
  },
  filtersScroll: {
    paddingVertical: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 10,
    backgroundColor: '#F3F4F6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  postsContainer: {
    paddingBottom: 100, // Space for FAB
  },
  postCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.5,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontWeight: '600',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  postContent: {
    marginBottom: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    paddingVertical: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 6,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  userName: {
    fontWeight: '600',
  },
  modeSelector: {
    marginBottom: 16,
  },
  modeSelectorLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  modeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  postInput: {
    height: 120,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 24,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});