import React from 'react';
import { AntDesign } from '@expo/vector-icons';

// Styles
import { StBtn, StBtnText, StTextTitle, StView } from './Home.style';

// Types
import type { RootStackScreenProps } from '~/types/react-navigations';

const Home: React.FC<RootStackScreenProps<'Home'>> = ({
  navigation: { navigate },
}) => {
  return (
    <StView>
      <StTextTitle>My Journal</StTextTitle>
      <StBtn onPress={() => navigate('Write')}>
        <AntDesign name="plus" size={40} color="white" />
      </StBtn>
    </StView>
  );
};

export default Home;
