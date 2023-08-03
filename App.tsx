import React from 'react';
import { Platform, UIManager, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { MobileAds } from 'react-native-google-mobile-ads';
import { ThemeProvider } from 'styled-components/native';

// Components
import Loading, { LoadingProvider } from '~/components/molecules/Loading';
import RootNavigator from '~/navigations/Root';

// DB
import { RealmProvider } from '~/db/realm';

// Styles
import defaultTheme from '~/styles/theme';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);
  const [adMobIsReady, setAdMobIsReady] = React.useState(false);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Load AdMob
  React.useEffect(() => {
    // mobileAds()
    MobileAds()
      .initialize()
      .then((adapterStatuses) => {
        console.log('Ad Statuses:', adapterStatuses);
        setAdMobIsReady(true);
      });
  }, []);

  // Final Loading Check
  React.useEffect(() => {
    // Do final loading check stuff
    if (adMobIsReady) {
      setAppIsReady(true);
    }
  }, [adMobIsReady]);

  return (
    <RealmProvider>
      <ThemeProvider theme={defaultTheme}>
        <LoadingProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Loading />
            <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
              <RootNavigator />
            </View>
          </NavigationContainer>
        </LoadingProvider>
      </ThemeProvider>
    </RealmProvider>
  );
}
