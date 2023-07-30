import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { Realm } from '@realm/react';
import { ThemeProvider } from 'styled-components/native';

// Components
import RootNavigator from '~/navigations/Root';

// DB
import { FeelingSchema } from '~/db/realm/schema';

// Contexts & Hooks
import { RealmProvider } from '~/contexts/realm';

// Styles
import defaultTheme from '~/styles/theme';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [realm, setRealm] = useState(null);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Loading
  useEffect(() => {
    const startAppLoading = async () => {
      const realm = await Realm.open({
        path: 'diaryDB',
        schema: [FeelingSchema],
      });
      setRealm(realm);
    };
    startAppLoading();
  }, []);

  // Final Loading Check
  useEffect(() => {
    if (realm) {
      setAppIsReady(true);
    }
  }, [realm]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <NavigationContainer>
        <RealmProvider value={realm}>
          <StatusBar style="auto" />
          <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
            <RootNavigator />
          </View>
        </RealmProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
}
