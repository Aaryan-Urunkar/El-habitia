import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/ui/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/components/theme/ThemeProvider';

// Placeholder post data
const MOCK_POSTS = [
  {
    id: '1',
    author: 'Sarah Lee',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100',
    content: 'Just completed my 30-day meditation streak! The morning clarity is real. Anyone else practice meditation?',
    likes: 24,
    comments: 7,
    timeAgo: '2h',
    mode: 'growth',
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
  },
  {
    id: '3',
    author: 'Taylor Jones',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100',
    content: 'Does anyone have recommendations for good habit tracking techniques? Im trying to build a consistent reading habit.',
    likes: 9,
    comments: 12,
    timeAgo: '8h',
    mode: 'growth',
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
  },
];

export default function CommunityScreen() {
  const { colors, scheme } = useTheme();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Filter posts based on selected filter
  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(post => post.mode === activeFilter);

  const renderPost = ({ item, index }: { item: typeof MOCK_POSTS[0]; index: number }) => (
    <Animated.View 
      entering={FadeIn.delay(index * 100).springify()}
      style={[styles.postCard, { backgroundColor: colors.card }]}
    >
      <View style={styles.postHeader}>
        <View style={styles.authorContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View>
            <ThemedText variant="subtitle">{item.author}</ThemedText>
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
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="heart" size={18} color={colors.subtext} />
          <ThemedText variant="caption" style={{ color: colors.subtext, marginLeft: 4 }}>
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
      <View style={styles.container}>
        {/* Header with filters */}
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
        
        {/* Posts List */}
        <FlatList
          data={filteredPosts}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.postsContainer}
          showsVerticalScrollIndicator={false}
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
            </View>
          }
        />
        
        {/* Floating Action Button */}
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => {}}
        >
          <IconSymbol name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersScroll: {
    paddingVertical: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  postsContainer: {
    paddingBottom: 80, // Space for FAB
  },
  postCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingHorizontal: 8,
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
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
  },
});
