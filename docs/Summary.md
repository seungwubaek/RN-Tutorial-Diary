# Summary

## Stack

* Realm from MongoDB
* React Context

## Realm from MongoDB

local nosql database

아래 섹션([React Context](#react-context))의 Custom Hook/Context 방법을 통해 Realm을 가져오지만, 공식 문서에 Realm을 가져오는 방법이 따로 있음

* <https://www.mongodb.com/docs/realm/sdk/react-native/use-realm-react/#createrealmcontext-->
* <https://www.mongodb.com/docs/realm/sdk/react-native/use-realm-react/#realmprovider>
* <https://www.mongodb.com/docs/realm/sdk/react-native/use-realm-react/#userealm-->
* <https://www.mongodb.com/docs/realm/sdk/react-native/use-realm-react/#useobject-->
* <https://www.mongodb.com/docs/realm/sdk/react-native/use-realm-react/#usequery-->

### RealmProvider

<https://github.com/realm/realm-js/tree/main/packages/realm-react#realmprovider>

Realm에 저장된 데이터 양이 방대할 때, Read에 렉이 걸린다면 어떻게해야할까? Loading Screen을 보여줘야하겠지.
그런데 아직까지 그 과정을 구현할 수 있는 방법을 찾지 못했다.

#### Try

아래는 시도해보았으나 실패한 방식. React Native에서 실패했으며 React에서는 시도해보지 않았다.

* Entry Point (`App.tsx`)에서 Realm을 async/await 기법 `await Realm.open()` 으로 로드하고,
* 해당 메소드가 완료되는 동안 Splash Screen을 띄움
* `await Realm.open()`의 반환값을 `const realmRef = React.useRef<Realm | null>(null);`로 저장
* `RealmProvider`의 property `realmRef`에 로드된 `realm` 객체를 할당

그러나 child component에서 `useRealm()`을 통해 `realm`을 가져오면 기본값이 반환된다. (설정했음에도 반영 안됐다는 뜻)

```tsx
// App.tsx
SplashScreen.preventAutoHideAsync();

const [appIsReady, setAppIsReady] = useState(false);
const realmRef = React.useRef<Realm | null>(null);

const onLayoutRootView = React.useCallback(async () => {
  if (appIsReady) {
    await SplashScreen.hideAsync();
  }
}, [appIsReady]);

useEffect(()=> {
  // Some Loading Logic including Realm.open()
  // Set setAppIsReady to `True` when Realm is loaded
  ...
  setAppIsReady(true);
}, ][])

return (
  <RealmProvider realmRef={realmRef}>
    <View onLayout={onLayoutRootView} style={{flex: 1}}>
      ...
    </View>
  </RealmProvider>
)

// screen/articles/ArticlesScreen.tsx
const ArticlesScreen = () => {
  const [realm, setRealm] = useRealm();

  // App.tsx에서 설정한 realm configuration이 반영되지 않음

  return (
    ...
  )
```

## React Context

global state management

특정 state를 React Tree의 어느 곳에서나 접근할 수 있도록 함

Root Node를 Provider로 감싸고, custom hook을 통해 state를 가져옴

### 코드 예

```tsx
// realm.tsx

import React, { createContext, useState } from 'react';

// Types
import type { Realm } from '@realm/react';

const RealmContext = createContext<
  [Realm | null, (realm: Realm | null) => void]
>([null, () => {}]);

export const RealmProvider: React.FC<{
  value: Realm;
  children: React.ReactNode;
}> = ({
  value,
  children,
}) => {
  const [realm, setRealm] = useState<Realm | null>(value);

  console.log(typeof realm, realm?.path);

  return (
    <RealmContext.Provider value={[realm, setRealm]}>
      {children}
    </RealmContext.Provider>
  );
};

export const useRealm = () => {
  return React.useContext(RealmContext);
};
```

```tsx
// App.tsx

export default function App() {
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    const realm = await Realm.open({
      path: 'diaryDB',
      schema: [FeelingSchema],
    });
    setRealm(realm);
  }, []);

  return (
    <RealmProvider value={realm}>
      <StatusBar style="auto" />
      <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
        <RootNavigator />
      </View>
    </RealmProvider>
  )
}
```
