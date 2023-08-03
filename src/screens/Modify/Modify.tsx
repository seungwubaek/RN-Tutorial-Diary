import React from 'react';
import { Alert } from 'react-native';
import { styled } from 'styled-components/native';

// Components
import { useLoading } from '~/components/molecules/Loading';

// DB
import { useRealm } from '~/db/realm';

// Styles
import {
  StBtnEmotion,
  StBtnSave,
  StBtnSaveText,
  StTextTitle,
  StTextEmotion,
  StTextInput,
  StView,
  StViewEmotions,
} from '~/screens/Write/Write.style';

const StTextModifyTitle = styled(StTextTitle)`
  font-size: 20px;
`;

// Types
import { RootStackScreenProps } from '~/types/react-navigations';

// Emotions
import { emotions } from '~/screens/Write/Write';
import { Feeling } from '~/db/realm/models';

const Modify: React.FC<RootStackScreenProps<'Modify'>> = ({
  route: { params },
  navigation: { goBack },
}) => {
  // States & Hooks
  const { show, hide } = useLoading();
  const realm = useRealm();
  const [selectedEmotion, setSelectedEmotion] = React.useState<string>('');
  const [feelingMsg, setFeelingMsg] = React.useState<string>('');

  const onChangeFeelings = React.useCallback((text: string) => {
    setFeelingMsg(text);
  }, []);

  const onEmotionPress = React.useCallback((emotion: string) => {
    setSelectedEmotion(emotion);
  }, []);

  const onSubmit = React.useCallback(() => {
    if (feelingMsg === '' || selectedEmotion === '') {
      return Alert.alert('', 'Please fill in all fields');
    }
    realm.write(() => {
      const item = params.item;
      const feeling = realm.objectForPrimaryKey<Feeling>('Feeling', item._id);
      if (!feeling) return;
      feeling.emotion = selectedEmotion;
      feeling.message = feelingMsg;
    });
    goBack();
  }, [feelingMsg, selectedEmotion, realm, params, goBack]);

  React.useEffect(() => {
    const { item } = params;
    console.log(item);
    setSelectedEmotion(item.emotion);
    setFeelingMsg(item.message);
  }, []);

  return (
    <StView>
      <StTextModifyTitle>
        {new Date(params.item._id).toLocaleString('ko-KR', {
          timeZone: 'Asia/Seoul',
        })}
      </StTextModifyTitle>
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
        value={feelingMsg}
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

export default Modify;
