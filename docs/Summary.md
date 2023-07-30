# Summary

## Stack

* Realm from MongoDB
* React Context

## Realm from MongoDB

local database

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
