import React from 'react';
import styled from 'styled-components/native';

import { useLoading } from './Context';

const StLoading = styled.ActivityIndicator`
  width: 100%;
  height: 100%;
  position: absolute;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  background-color: ${({ theme }) => theme.bgColor};
`;

const Loading: React.FC<{}> = () => {
  const { isLoading } = useLoading();

  if (!isLoading) {
    return null;
  }
  return <StLoading size="large" />;
};

export default Loading;
