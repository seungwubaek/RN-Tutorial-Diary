import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Components
import Home from '~/screens/Home/Home';
import Write from '~/screens/Write/Write';

// Types
import type { RootStackParamList } from '~/types/react-navigations';
import { useTheme } from 'styled-components/native';

const RootTabs = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const theme = useTheme();

  return (
    <RootTabs.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        animation: 'fade_from_bottom',
      }}
    >
      <RootTabs.Screen name="Home" component={Home} />
      <RootTabs.Screen
        name="Write"
        component={Write}
        options={{
          title: 'New Diary',
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.headerColor,
          },
        }}
      />
    </RootTabs.Navigator>
  );
};

export default RootNavigator;
