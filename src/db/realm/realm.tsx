import { Realm, createRealmContext } from '@realm/react';

import { Feeling } from './models';

export const realmConfig: Realm.Configuration = {
  path: 'diaryDB',
  schema: [Feeling],
};

export const { RealmProvider, useObject, useQuery, useRealm } =
  createRealmContext(realmConfig);
