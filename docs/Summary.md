# Summary

## Stack

* Realm from MongoDB
* React Context
* Layout Animation
* AdMob
* Firebase (강의 내용 아님)

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

#### Try (Failed) - Async/Await for SplashScreen

아래는 시도해보았으나 실패한 방식. React Native에서 실패했으며 React에서는 시도해보지 않았다.

어쩌면, Async/Await가 필요한 위치는 `open()`이 아니라, Realm의 어떤 Connection이 만들어진 이후, `realm.objects()` 등의 Read 작업을 수행할 때일지도 모른다.

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

### Simple Usage

* `useRealm`
* `realm.write`
  * Write 작업은 항상 이 함수 아래에서 이루어져야 한다.
  * `realm.create`
  * `realm.objectForPrimaryKey`
  * `realm.delete`

```tsx
// Home.tsx
const Home: React.FC = () => {
  const realm = useRealm();
  const [feelings, setFeelings] = React.useState<Realm.Results<Feeling>>();

  React.useEffect(() => {
    const feelings = realm.objects('Feeling') as Realm.Results<Feeling>;
    feelings.addListener((feelings, changes) => {
      setFeelings(feelings.sorted('_id', true));
    });
    return () => {
      feelings.removeAllListeners();
    };
  }, []);

  const onPress = React.useCallback((item: Feeling) => {
    realm.write(() => {
      const feeling = realm.objectForPrimaryKey('Feeling', item._id);
      realm.delete(feeling);
    });
  }, []);

  return (
    ...
  )
}

// Write.tsx
const Write: React.FC = () => {
  const realm = useRealm();

  ...

  realm.write(() => {
    const feeling = realm.create('Feeling', {
      _id: Date.now(),
      emotion: selectedEmotion,
      message: feelings,
    });
    console.log(feeling);
    goBack();
  });
}
```

### Legacy Method (?)

아래 [React Context](#react-context) 섹션의 Example code는 Custom Context/Hook을 이용해 Realm을 사용하고 있는데, 이 방식은 Realm이 아직 React를 support 하지 않을 때의 방식이다.

지금은 Realm에서 지원하는 Context/Hook API가 있으므로 해당 APIs를 이용하자. 다만 [Realm Provider](#realmprovider) 섹션의 [Try (Failed) - Async/Await for SplashScreen](#try-failed---asyncawait-for-splashscreen)의 내용과 같이 Loading Screen을 띄우는 방법에 대한 조사가 필요하다.

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

## Layout Animation

React Native의 Layout Animation은 State에 변화로 View의 Layout이 변할 때, 변화 애니메이션을 아주 간단히 구현할 수 있도록 해준다.

<https://reactnative.dev/docs/layoutanimation>

### Only Android

Android에서는 기본적으로 LayoutAnimation이 적용되지 않는다. 따라서 아래와 같이 앱 Entry Point에서 `UIManager`를 통해 LayoutAnimation을 적용해야 한다.

```tsx
// App.tsx
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
```

### Usage

`setState` 호출 전에 다음과 같은 코드로 애니메이션을 적용한다.

```tsx
React.useEffect(() => {
  const feelings = realm.objects('Feeling') as Realm.Results<Feeling>;
  feelings.addListener((feelings, changes) => {
    LayoutAnimation.spring();  // 이 한줄이면 끝
    setFeelings(feelings.sorted('_id', true));
  });
  return () => {
    feelings.removeAllListeners();
  };
}, []);
```

## AdMob

* BannerAd
* InterstitialAd
* RewardedAd
  * 선택형, 전체화면 츨력형

### Platform Compatibility

Ad Unit Id를 Platform에 따라 다르게 설정하기. Platform에 따라 앱이 다르며 광고도 다르기 때문이다.

```tsx
import { Platform } from 'react-native';

const adUnitId = Platform.select({
  android: 'ca-app-pub-aaaaaaaaaaaaaaaa/bbbbbbbbbb',
  ios: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
});
```

### Android Simulator에서 TestIds를 사용하려는데 `BannerAd`가 안보여요

`TestIds`를 이용해서 `BannerAd` 컴포넌트를 테스트 할 때는 `requestOptions` 중 `requestNonPersonalizedAdsOnly`를 `true`로 설정해야 한다.

테스트가 아닐 때는 의도한 것이 아니라면 까먹지 말고 `false`로 설정하자!

```tsx
<BannerAd
  unitId={TestIds.BANNER}
  size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
  requestOptions={{
    requestNonPersonalizedAdsOnly: true,
  }}
/>
```

## Firebase

Firebase로 차후 앱 기능 고도화 뿐만 아니라, Firebase를 이용한 Google AdMob & Analytics 연동 체인을 구성하자.

이건 튜토리얼 강의에 포함된 내용이 아님. 아래 방식은 2023. 08. 02 기준.

최신 가이드는 "Firebase > 프로젝트 > 앱 추가(Android or iOS or ...)" 과정의 가이드를 확인하자.

### Installation

* "Firebase > 프로젝트 > 앱 추가(Android or iOS or ...)" 과정의 가이드 따라가기

  * `google-services.json` 파일 추가
    * Android의 경우 `android/app` 폴더에 추가

  * 프로젝트 gradle 설정 추가

    ```gradle
    buildscript {
      dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
      }
    }
    ```

  * 앱 gradle 설정 추가

    ```gradle
    apply plugin: 'com.google.gms.google-services'

    dependencies {
      implementation platform('com.google.firebase:firebase-bom:32.2.1')
      implementation 'com.google.firebase:firebase-analytics'
    }
    ```

  * AdMob 연동
    * AdMob > 설정 > 연결된 서비스 > 앱 연결 관리 섹션
      * 테이블의 `Firebase` 컬럼의 드롭다운 화살표 클릭 후 지시대로 진행

* React Native Firebase 패키지 설치

  * `npm i @react-native-firebase/app`
    * 또는 `yarn add @react-native-firebase/app`
    * iOS의 경우 `pod install` 등 추가 작업 필요

  * 필요한 패키지 추가 인스톨
    * `npm i @react-native-firebase/analytics` 등

* `npm run android` or `npm run ios`로 Re-Build
