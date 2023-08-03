# Trouble Shoot

## Layout Animation not showing

### 1. Layout Animation이 작동하는 동시에 또다른 re-rendering이 발생하는 경우

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

### 2. Simulator 환경에서 잘 작동하지 않는 경우

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

Simulator 환경에서만 발생하는 문제로 추정되며, 실제 기기에서 테스트 후 내용 업데이트가 필요하다.

임시로, 위 과정에서 `TextInput`에 입력을 완료한 다음, 키보드를 수동으로 비활성화(내려가는 애니메이션 재생)하자.

키보드 비활성화가 완료되면 `Save` 버튼을 클릭한다. 그러면 Layout Animation이 정상적으로 재생된다.
