import React, { useState } from 'react';

// Types
import type { Realm } from '@realm/react';

export const useRealm = () => {
  const [realm, setRealm] = useState<Realm | null>(null);

  return [realm, setRealm];
};
