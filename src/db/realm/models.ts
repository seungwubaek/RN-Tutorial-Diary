import { Realm } from '@realm/react';

export class Feeling extends Realm.Object {
  _id!: number;
  emotion!: string;
  message!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Feeling',
    properties: {
      _id: 'int',
      emotion: 'string',
      message: 'string',
    },
    primaryKey: '_id',
  };
}
