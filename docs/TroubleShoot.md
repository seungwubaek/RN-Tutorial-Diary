# Trouble Shoot

## Layout Animation not showing

### 1. 맨 처음 앱을 실행했을 때 Layout Animation이 작동하지 않는 경우

앱을 처음 실행했을때에만 Home 화면 feelings `FlatList`의 Layout Animation이 작동하지 않는다.

Metro Server에서 Reload 했을때는 Layout Animation이 정상적으로 작동한다.

Simulator에서만 발생하는 문제일 것이라는 추측을 하고 있다. 실제 기기에서 테스트 후 내용 업데이트가 필요하다.

### 2. Layout Animation이 작동하는 동시에 또다른 re-rendering이 발생하는 경우

Layout Animation이 재생되는 순간, 또다른 `setState`에 의해 re-render가 호출되면 Layout Animation이 작동하지 않는다.

다음과 같은 Layout Animation이 적용 코드를 보자. `setFeelings()`가 호출되면 re-rendering이 발생하고 Layout Animation이 재생될 것이다.

그런데 뒤이어 `setTriggerShowRewardAdForEdit` 함수가 호출된다. 이 함수는 Google AdMob의 Rewarded Ad의 재생을 Trigger 하기 위한 `state`이다. 그리고 이 함수가 호출되는 것으로 인해 re-rendering이 **한번 더** 발생한다.

따라서 `setFeelings` 함수의 호출이 발생시킨 re-rendering은 Layout Animation을 재생시키는데, 뒤이어 `setTriggerShowRewardAdForEdit` 함수의 호출이 발생시킨 두번째 re-rendering으로 인해 Layout Animation이 끊긴다.

```tsx
React.useEffect(() => {
  const feelings = realm.objects('Feeling') as Realm.Results<Feeling>;
  feelings.addListener((feelings, changes) => {
    LayoutAnimation.spring();
    setFeelings(feelings.sorted('_id', true));
    setTriggerShowRewardAdForEdit(false);  // 이 코드가 추가되면 Layout Animation이 작동하지 않는다.
  });
  return () => {
    feelings.removeAllListeners();
  };
}, []);
```

#### 해결 방법

`useRef`를 사용하고, LayoutAnimation의 callback을 사용해서 `setTriggerShowRewardAdForEdit` 함수를 호출하도록 로직을 수정하자.

```tsx
const feelingAnimationFinishedCallbackRef = React.useRef<() => void>(
  () => {}
);

// 광고 시청 후 실행되는 콜백
React.useEffect(() => {
  const editMode = editModeRef.current;
  const editItem = editItemRef.current;
  if (!editMode || !editItem) return;
  if (isEarnedRewardRewardAdForEdit && isClosedRewardAdForEdit) {
    feelingAnimationFinishedCallbackRef.current = () =>
      setTriggerShowRewardAdForEdit(false);  // Layout Animation이 재생된 후 호출될 callback을 설정하는 위치
    deleteFeelingFromRealm(editItem);
  }
}, [
  isEarnedRewardRewardAdForEdit,
  isClosedRewardAdForEdit,
  setTriggerShowRewardAdForEdit,
]);

React.useEffect(() => {
    const feelings = realm.objects('Feeling') as Realm.Results<Feeling>;
    feelings.removeAllListeners();
    feelings.addListener((feelings, changes) => {
      LayoutAnimation.spring(() =>
        feelingAnimationFinishedCallbackRef.current()  // Layout Animation이 재생된 후 호출될 callback
      );
      setFeelings(feelings.sorted('_id', true));
    });
    return () => {
      feelings.removeAllListeners();
    };
  }, [feelingAnimationFinishedCallbackRef]);

```

### 3. 새 Diary를 작성하고 Home으로 돌아갔을때 feeling FlatList의 Layout Animation이 재생되지 않는 경우

이 문제는 Simulator 환경에서만 발생하는 문제이다. 그래픽 구현 성능에 좌우되는 것으로 추정한다.

EAS를 이용해 APK로 빌드(`eas build -p android --profile preview-apk`)한 앱을 실제 기기에서 실행시키면 문제없이 재생된다.

Layout Animation이 재생하는 시점에 활성화된 키보드가 비활성화되는 애니메이션(키보드가 내려가는 애니메이션)이 동시에 발생하면 Layout Animation이 재생되지 않는다.

* 과정
  * `Write.tsx`에서 새로운 Diary를 작성하기 위해 `TextInput`에 텍스트를 입력한다.
    * 이때 키보드가 활성화(키보드가 올라오는 애니메이션 재생)된다.
  * <kbd>Enter</kbd>를 누르거나 `Save` 버튼을 누른다
  * `Diary`가 생성된고 `goBack()` 함수가 호출된다.
    * 이때 키보드가 비활성화(키보드가 내려가는 애니메이션 재생)된다.
  * `Home.tsx`로 이동하면서 `useEffect()`가 호출된다.
    * `useEffect()`에서 Layout Animation이 재생된다.
    * Layout Animation의 재생 시점이 키보드 비활성화 애니메이션의 재생 시간대와 겹치는 상황 발생

#### 해결 방법

임시로, 위 과정에서 `TextInput`에 입력을 완료한 다음, 키보드를 수동으로 비활성화(내려가는 애니메이션 재생)하자.

키보드 비활성화가 완료되면 `Save` 버튼을 클릭한다. 그러면 Layout Animation이 정상적으로 재생된다.

## Provider 내부의 Rendering 작동안함

아래 코드의 Provider는 내부에 렌더링 해야할 컴포넌트를 가지고 있다.

이때, 만약 `LoadingProvider`가 `<View onLayout...` 컴포넌트 바깥에 위치하면 해당 컴포넌트가 렌더링 되지 않으므로 주의하자.
Expo Go에서는 정상 작동하는 것 처럼 보이지만, Build 한 APK를 실행했을 때 렌더링 되지 않는다.

### Solved 코드

`LoadingProvider`는 Return 값에 `<LoadingIndicator>` 컴포넌트가 같이 들어있다.

`<LoadingIndicator>`는 다른 child 컴포넌트에서 `useLoading`으로 가져온 `show()`/`hide()` 함수를 이용해서 보이기/숨기기 할 수 있다.

```tsx
// Loading.tsx

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
      <LoadingIndicator isLoading={isLoading} />
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
const LoadingIndicator: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const theme = useTheme();

  if (!isLoading) {
    return null;
  }
  return <StLoading size="large" color={theme.loadingTintColor} />;
};
```

그러나, 아래와 같이 Provider는 `View` 컴포넌트의 내부에 작성하여야 한다.

```tsx
// App.tsx

export default function App() {
  ...

  return (
    <RealmProvider>
      <ThemeProvider theme={defaultTheme}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
            <LoadingProvider>
              <RootNavigator />
            </LoadingProvider>
          </View>
        </NavigationContainer>
      </ThemeProvider>
    </RealmProvider>
  );
}
```
