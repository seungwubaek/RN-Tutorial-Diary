import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// types
import { Feeling } from '~/db/realm/models';

export type RootStackParamList = {
  Home: undefined;
  Write: undefined;
  Modify: { item: Feeling };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
