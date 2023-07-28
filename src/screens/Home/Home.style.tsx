import styled from 'styled-components/native';

export const StView = styled.View`
  flex: 1;
  padding: 0 30px;
  padding-top: 50px;
  background-color: ${({ theme }) => theme.bgColor};
`;

export const StTextTitle = styled.Text`
  margin-bottom: 100px;
  color: ${({ theme }) => theme.textColor};
  font-size: 38px;
`;

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

export const StBtnText = styled.Text`
  color: ${({ theme }) => theme.btnTextColor};
`;
