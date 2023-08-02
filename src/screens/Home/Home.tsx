import React from 'react';
import { LayoutAnimation } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

// Styles
import {
  StBtn,
  StBtnRecordCard,
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

// Ads
const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-9480069633849139/1340536908';

const Home: React.FC<RootStackScreenProps<'Home'>> = ({
  navigation: { navigate },
}) => {
  const realm = useRealm();
  const [feelings, setFeelings] = React.useState<Realm.Results<Feeling>>();

  React.useEffect(() => {
    const feelings = realm.objects('Feeling') as Realm.Results<Feeling>;
    feelings.addListener((feelings, changes) => {
      LayoutAnimation.spring();
      setFeelings(feelings.sorted('_id', true));
    });
    return () => {
      feelings.removeAllListeners();
    };
  }, []);

  const onPress = React.useCallback((item: Feeling) => {
    realm.write(() => {
      const feeling = realm.objectForPrimaryKey('Feeling', item._id);
      realm.delete(feeling);
    });
  }, []);

  return (
    <StView>
      <StTextTitle>My Journal</StTextTitle>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
      <StFlatListFeelings
        ItemSeparatorComponent={StViewFlatListFeelingsSep}
        data={feelings}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <StBtnRecordCard onPress={() => onPress(item)}>
            <StViewRecordCard>
              <StTextEmotion>{item.emotion}</StTextEmotion>
              <StTextMessage>{item.message}</StTextMessage>
            </StViewRecordCard>
          </StBtnRecordCard>
        )}
      />
      <StBtn onPress={() => navigate('Write')}>
        <AntDesign name="plus" size={40} color="white" />
      </StBtn>
    </StView>
  );
};

export default Home;
