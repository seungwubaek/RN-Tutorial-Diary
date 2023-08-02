import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

const StViewLoadingWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Loading = () => {
  return (
    <StViewLoadingWrapper>
      <ActivityIndicator size="large" />
    </StViewLoadingWrapper>
  );
};

export default Loading;
