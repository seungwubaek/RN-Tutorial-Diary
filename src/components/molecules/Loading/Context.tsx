import React from 'react';

const LoadingContext = React.createContext<{
  isLoading: boolean;
  show: () => void;
  hide: () => void;
}>({
  isLoading: false,
  show: () => {},
  hide: () => {},
});

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

export const useLoading = () => {
  return React.useContext(LoadingContext);
};
