import React, { createContext, useState } from 'react';

// Types
import type { Realm } from '@realm/react';

const RealmContext = createContext<
  [Realm | null, (realm: Realm | null) => void]
>([null, () => {}]);

export const RealmProvider: React.FC<{
  value: Realm;
  children: React.ReactNode;
}> = ({ value, children }) => {
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
