import React from 'react';
import { Alert } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  AdEventType,
  RewardedInterstitialAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Components
import Loading from '~/components/atoms/Loading';

// DB
import { useRealm } from '~/db/realm';

// Styles
import {
  StBtnSave,
  StBtnSaveText,
  StBtnEmotion,
  StTextInput,
  StTextTitle,
  StView,
  StViewEmotions,
  StTextEmotion,
} from './Write.style';

// Types
import { RootStackScreenProps } from '~/types/react-navigations';

SplashScreen.preventAutoHideAsync();

// Ads
const adUnitId = __DEV__
  ? TestIds.REWARDED_INTERSTITIAL
  : 'ca-app-pub-9480069633849139/8179130192';

const rewardedInterstitialAd = RewardedInterstitialAd.createForAdRequest(
  adUnitId,
  {
    requestNonPersonalizedAdsOnly: true,
    serverSideVerificationOptions: {
      userId: 'test_user',
      customData: JSON.stringify({ data: 'something' }),
    },
  }
);

// Emotions
const emotions = ['😊', '😐', '🥰', '🤩', '😭', '😡'];

// Main
const Write: React.FC<RootStackScreenProps<'Write'>> = ({
  navigation: { goBack },
}) => {
  // States
  const [adLoaded, setAdLoaded] = React.useState<boolean>(false);
  const [rewardEarned, setRewardEarned] = React.useState<boolean>(false);
  const [selectedEmotion, setSelectedEmotion] = React.useState<string>('');
  const [feelings, setFeelings] = React.useState<string>('');
  const realm = useRealm();

  const onChangeFeelings = React.useCallback((text: string) => {
    setFeelings(text);
  }, []);

  const onEmotionPress = React.useCallback((emotion: string) => {
    setSelectedEmotion(emotion);
  }, []);

  const onSubmit = React.useCallback(() => {
    if (feelings === '' || selectedEmotion === '') {
      return Alert.alert('', 'Please fill in all fields');
    }
    rewardedInterstitialAd.show();
  }, [selectedEmotion, feelings]);

  React.useEffect(() => {
    const unsubscribeAfterLoad = rewardedInterstitialAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setAdLoaded(true);
      }
    );
    const unsubscribeAfterReward = rewardedInterstitialAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        setRewardEarned(true);
      }
    );
    rewardedInterstitialAd.load();
    return () => {
      unsubscribeAfterLoad();
      unsubscribeAfterReward();
    };
  }, []);

  React.useEffect(() => {
    const unsubscribeAfterClose = rewardedInterstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        if (rewardEarned) {
          realm.write(() => {
            const feeling = realm.create('Feeling', {
              _id: Date.now(),
              emotion: selectedEmotion,
              message: feelings,
            });
            goBack();
          });
        }
      }
    );
    return unsubscribeAfterClose;
  }, [rewardEarned]);

  if (!adLoaded || !realm) {
    return <Loading />;
  }

  return (
    <StView>
      <StTextTitle>How do you feel today?</StTextTitle>
      <StViewEmotions>
        {emotions.map((emotion, index) => (
          <StBtnEmotion
            key={index}
            selected={emotion === selectedEmotion}
            onPress={() => onEmotionPress(emotion)}
          >
            <StTextEmotion>{emotion}</StTextEmotion>
          </StBtnEmotion>
        ))}
      </StViewEmotions>
      <StTextInput
        value={feelings}
        placeholder="Write your feelings..."
        // multiline
        returnKeyType="done"
        onChangeText={onChangeFeelings}
        onSubmitEditing={onSubmit}
      />
      <StBtnSave onPress={onSubmit}>
        <StBtnSaveText>Save</StBtnSaveText>
      </StBtnSave>
    </StView>
  );
};

export default Write;
