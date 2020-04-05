import { Entity } from '@roomies/shared.data';

export interface User extends Entity {
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
}
