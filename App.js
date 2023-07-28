import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { Realm } from '@realm/react';
import { ThemeProvider } from 'styled-components/native';

// Components
import RootNavigator from '~/navigations/Root';

// DB
import { FeelingSchema } from '~/db/realm/schema';

// Hooks
import { useRealm } from './src/hooks/realm';

// Styles
import defaultTheme from '~/styles/theme';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [realm, setRealm] = useRealm();

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

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
        <StatusBar
          backgroundColor={defaultTheme.bgColor}
          barStyle={'default'}
        />
        <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
          <RootNavigator />
        </View>
      </NavigationContainer>
    </ThemeProvider>
  );
}
