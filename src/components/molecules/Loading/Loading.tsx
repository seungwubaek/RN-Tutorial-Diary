import React from 'react';
import styled, { useTheme } from 'styled-components/native';

// Context
const LoadingContext = React.createContext<{
  isLoading: boolean;
  show: () => void;
  hide: () => void;
}>({
  isLoading: false,
  show: () => {},
  hide: () => {},
});

// Provider
export const LoadingProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const show = React.useCallback(() => {
    setIsLoading(true);
  }, []);

  const hide = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, show, hide }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Hook
export const useLoading = () => {
  return React.useContext(LoadingContext);
};

// Styles
const StLoading = styled.ActivityIndicator`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 9999;
  background-color: ${({ theme }) => theme.loadingBgColor};
`;

// Component
export const LoadingIndicator: React.FC = () => {
  const theme = useTheme();
  const { isLoading } = useLoading();

  if (!isLoading) {
    return null;
  }
  return <StLoading size="large" color={theme.loadingTintColor} />;
};
