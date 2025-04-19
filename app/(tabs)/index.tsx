import { Image, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { checkFirebaseConnection } from '@/firebase/utils';

export default function HomeScreen() {
  const [firebaseStatus, setFirebaseStatus] = useState<{
    isConnected: boolean | null;
    message: string;
  }>({
    isConnected: null,
    message: 'Checking Firebase connection...',
  });

  useEffect(() => {
    const checkConnection = async () => {
      const result = await checkFirebaseConnection();
      setFirebaseStatus(result);
    };
    
    checkConnection();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Firebase Connection Status */}
      <ThemedView style={styles.firebaseContainer}>
        <ThemedText type="subtitle">Firebase Status</ThemedText>
        
        {firebaseStatus.isConnected === null ? (
          <ThemedView style={styles.statusRow}>
            <ActivityIndicator size="small" />
            <ThemedText>{firebaseStatus.message}</ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.statusRow}>
            <ThemedText 
              style={{ 
                color: firebaseStatus.isConnected ? '#4CAF50' : '#F44336',
                fontWeight: 'bold'
              }}
            >
              {firebaseStatus.isConnected ? '✓ Connected' : '✗ Disconnected'}
            </ThemedText>
            <ThemedText>{firebaseStatus.message}</ThemedText>
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12'
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  firebaseContainer: {
    gap: 8,
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
