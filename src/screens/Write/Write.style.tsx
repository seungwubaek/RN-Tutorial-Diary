import styled from 'styled-components/native';

export const StView = styled.View`
  background-color: ${({ theme }) => theme.bgColor};
  flex: 1;
  padding: 0 30px;
`;

export const StTextTitle = styled.Text`
  color: ${({ theme }) => theme.textColor};
  margin: 50px 0;
  text-align: center;
  font-size: 28px;
  font-weight: 500;
`;

export const StViewEmotions = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
  justify-content: space-between;
`;

export const StBtnEmotion = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: white;
  elevation: 5;
  padding: 10px;
  border-radius: 10px;
  border-width: 2px;
  border-color: ${({ selected }) =>
    selected ? 'rgba(0, 0, 0, 0.7)' : 'transparent'};
`;

export const StTextEmotion = styled.Text`
  font-size: 24px;
`;

export const StTextInput = styled.TextInput`
  background-color: white;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 18px;
`;

export const StBtnSave = styled.TouchableOpacity`
  width: 100%;
  margin-top: 20px;
  background-color: ${({ theme }) => theme.btnColor};
  padding: 10px 20px;
  align-items: center;
  border-radius: 20px;
`;

export const StBtnSaveText = styled.Text`
  color: ${({ theme }) => theme.btnTextColor};
  font-size: 18px;
  font-weight: 500;
`;
