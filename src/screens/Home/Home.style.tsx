import { FlatList } from 'react-native';
import styled from 'styled-components/native';

export const StView = styled.View`
  flex: 1;
  padding: 0 30px;
  padding-top: 50px;
  background-color: ${({ theme }) => theme.bgColor};
  justify-content: flex-start;
  align-items: center;
`;

export const StTextTitle = styled.Text`
  width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 38px;
  margin-bottom: 20px;
`;

export const StFlatListFeelings = styled.FlatList`
  width: 100%;
  margin-top: 20px;
` as typeof FlatList;

export const StViewFlatListFeelingsSep = styled.View`
  height: 10px;
`;

export const StViewRecordCard = styled.View`
  background-color: ${({ theme }) => theme.cardColor};
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 10px;
  border-radius: 10px;
`;

export const StViewCardContent = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const StTextEmotion = styled.Text`
  font-size: 18px;
  margin-right: 10px;
`;

export const StTextMessage = styled.Text`
  font-size: 14px;
`;

export const StViewCardBtnSet = styled.View`
  flex-direction: row;
  gap: 20px;
  align-items: center;
`;

export const StBtnCardBtnWrapper = styled.TouchableOpacity``;

export const StBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 50px;
  right: 50px;
  background-color: ${({ theme }) => theme.btnColor};
  height: 80px;
  width: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  // Shadow
  // Android
  elevation: 8;
  // iOS
  shadow-color: #000;
  shadow-offset: 0px 5px;
  shadow-opacity: 0.34;
  shadow-radius: 6.27px;
`;
