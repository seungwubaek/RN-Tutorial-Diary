import React from 'react';
import { Alert } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

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

const emotions = ['😊', '😐', '🥰', '🤩', '😡'];
// const emotions = ['😊', '😐', '🥰', '🤩', '😭', '😡'];

const Write: React.FC<RootStackScreenProps<'Write'>> = ({
  navigation: { goBack },
}) => {
  // States
  const [selectedEmotion, setSelectedEmotion] = React.useState<string>('');
  const [feelings, setFeelings] = React.useState<string>('');
  const realm = useRealm();

  if (!realm) {
    return null;
  }

  // Functions
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
    realm.write(() => {
      const feeling = realm.create('Feeling', {
        _id: Date.now(),
        emotion: selectedEmotion,
        message: feelings,
      });
      console.log(feeling);
      goBack();
    });
  }, [feelings, selectedEmotion]);

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
