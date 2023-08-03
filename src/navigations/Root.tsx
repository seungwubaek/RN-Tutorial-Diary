import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Components
import Home from '~/screens/Home';
import Write from '~/screens/Write';
import Modify from '~/screens/Modify';

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
      <RootTabs.Screen
        name="Modify"
        component={Modify}
        options={{
          title: 'Modify Diary',
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
