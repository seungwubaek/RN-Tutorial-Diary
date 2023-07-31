import React from 'react';
import { AntDesign } from '@expo/vector-icons';

// Styles
import {
  StBtn,
  StFlatListFeelings,
  StTextEmotion,
  StTextMessage,
  StTextTitle,
  StView,
  StViewFlatListFeelingsSep,
  StViewRecordCard,
} from './Home.style';

// DB
import { useRealm } from '~/db/realm';
import { Feeling } from '~/db/realm/models';

// Types
import type { RootStackScreenProps } from '~/types/react-navigations';

const Home: React.FC<RootStackScreenProps<'Home'>> = ({
  navigation: { navigate },
}) => {
  const realm = useRealm();
  const [feelings, setFeelings] = React.useState<Realm.Results<Feeling>>();

  React.useEffect(() => {
    const feelings = realm.objects('Feeling') as Realm.Results<Feeling>;
    feelings.addListener(() => {
      const feelings = realm.objects('Feeling') as Realm.Results<Feeling>;
      setFeelings(feelings);
    });
    return () => {
      feelings.removeAllListeners();
    };
  }, []);

  return (
    <StView>
      <StTextTitle>My Journal</StTextTitle>
      <StFlatListFeelings
        ItemSeparatorComponent={StViewFlatListFeelingsSep}
        data={feelings}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <StViewRecordCard>
            <StTextEmotion>{item.emotion}</StTextEmotion>
            <StTextMessage>{item.message}</StTextMessage>
          </StViewRecordCard>
        )}
      />
      <StBtn onPress={() => navigate('Write')}>
        <AntDesign name="plus" size={40} color="white" />
      </StBtn>
    </StView>
  );
};

export default Home;
