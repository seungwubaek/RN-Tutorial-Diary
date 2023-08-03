import React from 'react';
import { Alert } from 'react-native';
import {
  TestIds,
  useRewardedInterstitialAd,
} from 'react-native-google-mobile-ads';

// Components
import Loading from '~/components/molecules/Loading/Loading';

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

// Ads
const adUnitId = TestIds.REWARDED_INTERSTITIAL;

// Emotions
const emotions = ['😊', '😐', '🥰', '🤩', '😭', '😡'];

// Main
const Write: React.FC<RootStackScreenProps<'Write'>> = ({
  navigation: { goBack },
}) => {
  // States & Hooks
  const {
    isLoaded: isLoadedRewardAdForSave,
    isEarnedReward: isEarnedRewardRewardAdForSave,
    isClosed: isClosedRewardAdForSave,
    load: loadRewardAdForSave,
    show: showRewardAdForSave,
  } = useRewardedInterstitialAd(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });
  const realm = useRealm();
  const [selectedEmotion, setSelectedEmotion] = React.useState<string>('');
  const [feelings, setFeelings] = React.useState<string>('');

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
    showRewardAdForSave();
  }, [selectedEmotion, feelings, showRewardAdForSave]);

  React.useEffect(() => {
    loadRewardAdForSave();
  }, [loadRewardAdForSave]);

  React.useEffect(() => {
    if (isEarnedRewardRewardAdForSave && isClosedRewardAdForSave) {
      realm.write(() => {
        const feeling = realm.create('Feeling', {
          _id: Date.now(),
          emotion: selectedEmotion,
          message: feelings,
        });
        goBack();
      });
    }
    // 본 useEffect의 dependency에 selectedEmotion, feelings는 넣지 않는다.
    // isEarnedRewardRewardAdForSave와 isClosedRewardAdForSave가 변경되어 본 useEffect가 실행돼야하는 시점에는
    // 이미 selectedEmotion과 feelings의 값이 수정 완료된 시점이기 때문이다.
  }, [isEarnedRewardRewardAdForSave, isClosedRewardAdForSave]);

  if (!isLoadedRewardAdForSave || !realm) {
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
