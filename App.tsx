import React from 'react';
import { Platform, UIManager, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from 'styled-components/native';

// Components
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

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Final Loading Check
  React.useEffect(() => {
    // Do final loading check stuff
    setAppIsReady(true);
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <RealmProvider>
      <ThemeProvider theme={defaultTheme}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
            <RootNavigator />
          </View>
        </NavigationContainer>
      </ThemeProvider>
    </RealmProvider>
  );
}
