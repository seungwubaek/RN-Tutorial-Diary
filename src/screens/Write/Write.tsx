import React, { useCallback } from 'react';
import { View, Alert } from 'react-native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

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

const emotions = ['😊', '😐', '🥰', '🤩', '😡'];
// const emotions = ['😊', '😐', '🥰', '🤩', '😭', '😡'];

const Write = () => {
  // States
  const [selectedEmotion, setSelectedEmotion] = React.useState<string>('');
  const [feelings, setFeelings] = React.useState<string>('');

  console.log(selectedEmotion, feelings);

  // Functions
  const onChangeFeelings = useCallback((text: string) => {
    setFeelings(text);
  }, []);

  const onEmotionPress = useCallback((emotion: string) => {
    setSelectedEmotion(emotion);
  }, []);

  const onSubmit = useCallback(() => {
    if (feelings === '' || selectedEmotion === '') {
      return Alert.alert('', 'Please fill in all fields');
    }
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
