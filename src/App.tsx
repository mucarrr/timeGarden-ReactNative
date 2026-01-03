import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OnboardingScreen from './screens/OnboardingScreen';
import GardenScreen from './screens/GardenScreen';
import LoadingScreen from './screens/LoadingScreen';
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import PrayerTimesSelectionScreen from './screens/PrayerTimesSelectionScreen';
import GoalSelectionScreen from './screens/GoalSelectionScreen';
import StartScreen from './screens/StartScreen';
import AbdestAlmaScreen from './screens/AbdestAlmaScreen';
import NamazVakitleriScreen from './screens/NamazVakitleriScreen';
import BadgeScreen from './screens/BadgeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import BadgesGalleryScreen from './screens/BadgesGalleryScreen';
import LevelProgressScreen from './screens/LevelProgressScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { GardenState, Character, Language } from './types';
import {
  loadGardenState,
  saveGardenState,
  getDefaultGardenState,
} from './utils/storage';
import { detectLanguage } from './utils/languageDetector';
import { changeLanguage } from './i18n';
import './i18n';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator - Giriş yapıldıktan sonra gösterilecek
const MainTabs: React.FC<{
  gardenState: GardenState | null;
  onGardenStateUpdate: (state: GardenState) => void;
  onResetToOnboarding: () => void;
}> = ({ gardenState, onGardenStateUpdate, onResetToOnboarding }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="GardenTab"
        options={{
          tabBarLabel: 'Bahçe',
          tabBarIcon: ({ color, size }) => (
            <Icon name="eco" size={size} color={color} />
          ),
        }}>
        {props => (
          <GardenScreen
            {...props}
            initialGardenState={gardenState || getDefaultGardenState('tr')}
            onStateUpdate={onGardenStateUpdate}
            onResetToOnboarding={onResetToOnboarding}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Levels"
        component={LevelProgressScreen}
        options={{
          tabBarLabel: 'Seviyeler',
          tabBarIcon: ({ color, size }) => (
            <Icon name="trending-up" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Badges"
        component={BadgesGalleryScreen}
        options={{
          tabBarLabel: 'Rozetlerim',
          tabBarIcon: ({ color, size }) => (
            <Icon name="emoji-events" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  const [gardenState, setGardenState] = useState<GardenState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  // Garden state'i yeniden yükle (yeni kullanıcı kaydı/girişi sonrası)
  const refreshGardenState = async () => {
    try {
      console.log('🔄 Refreshing garden state from server...');
      const savedState = await loadGardenState();
      if (savedState) {
        console.log('✅ Loaded garden state from server:', JSON.stringify(savedState, null, 2));
        setGardenState(savedState);
      } else {
        const detectedLang = await detectLanguage();
        const defaultState = getDefaultGardenState(detectedLang);
        console.log('✅ Using default garden state');
        setGardenState(defaultState);
      }
    } catch (error) {
      console.error('❌ Error refreshing garden state:', error);
      const defaultState = getDefaultGardenState('tr');
      setGardenState(defaultState);
    }
  };

  const initializeApp = async () => {
    try {
      const detectedLang = await detectLanguage();
      changeLanguage(detectedLang);

      const savedState = await loadGardenState();

      if (savedState) {
        setGardenState(savedState);
      } else {
        const defaultState = getDefaultGardenState(detectedLang);
        setGardenState(defaultState);
      }
    } catch (error) {
      console.error('App initialization error:', error);
      const defaultState = getDefaultGardenState('en');
      setGardenState(defaultState);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async (
    character: Character,
    language: Language,
  ) => {
    const newState: GardenState = {
      ...gardenState!,
      character,
      language,
      isOnboardingComplete: true,
    };

    changeLanguage(language);
    setGardenState(newState);
    await saveGardenState(newState);
  };

  const handleGardenStateUpdate = async (newState: GardenState) => {
    setGardenState(newState);
    await saveGardenState(newState);
  };

  const handleResetToOnboarding = async () => {
    const detectedLang = await detectLanguage();
    const defaultState = getDefaultGardenState(detectedLang);
    setGardenState(defaultState);
    await saveGardenState(defaultState);
  };

  const handleLoadingComplete = () => {
    console.log('✅ Loading complete - setting showLoadingScreen to false');
    setShowLoadingScreen(false);
  };

  // 1. Loading Screen
  if (showLoadingScreen) {
    console.log('⏳ Showing Loading Screen');
    return (
      <ErrorBoundary>
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      </ErrorBoundary>
    );
  }

  // 2. After loading, ALWAYS show SignUp screen (for testing)
  console.log('✅ After loading screen:', { isLoading, hasGardenState: !!gardenState });
  console.log('📱 Showing SignUp Screen NOW!');
  
  // Don't wait for initialization - show SignUp immediately
  return (
    <ErrorBoundary>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          // Navigation ready
        }}
        onStateChange={(state) => {
          // Welcome screen'e gidildiğinde state'i yeniden yükle
          const currentRoute = navigationRef.current?.getCurrentRoute();
          if (currentRoute?.name === 'Welcome') {
            console.log('📍 Welcome screen detected, refreshing garden state...');
            refreshGardenState();
          }
        }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Onboarding">
            {props => (
              <OnboardingScreen
                {...props}
                initialLanguage={gardenState?.language || 'tr'}
                onComplete={(character: Character, language: Language) => {
                  handleOnboardingComplete(character, language);
                  if (props.navigation) {
                    props.navigation.navigate('PrayerTimesSelection');
                  }
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="PrayerTimesSelection">
            {props => (
              <PrayerTimesSelectionScreen
                {...props}
                onComplete={() => {
                  if (props.navigation) {
                    props.navigation.navigate('GoalSelection');
                  }
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="GoalSelection">
            {props => (
              <GoalSelectionScreen
                {...props}
                onComplete={() => {
                  if (props.navigation) {
                    props.navigation.navigate('Start');
                  }
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Start">
            {props => (
              <StartScreen
                {...props}
                character={gardenState?.character || 'boy'}
                onComplete={() => {
                  if (props.navigation) {
                    props.navigation.navigate('MainTabs');
                  }
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="AbdestAlma">
            {props => <AbdestAlmaScreen {...props} character={gardenState?.character || 'boy'} />}
          </Stack.Screen>
          <Stack.Screen name="NamazVakitleri">
            {props => <NamazVakitleriScreen {...props} character={gardenState?.character || 'boy'} />}
          </Stack.Screen>
          <Stack.Screen name="MainTabs">
            {props => (
              <MainTabs
                {...props}
                gardenState={gardenState}
                onGardenStateUpdate={handleGardenStateUpdate}
                onResetToOnboarding={handleResetToOnboarding}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="LevelProgress" component={LevelProgressScreen} />
          <Stack.Screen name="Badge">
            {props => <BadgeScreen {...props} badgeType={(props.route?.params as any)?.badgeType} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );

};

export default App;
