import { Entity } from '../interfaces';

export interface User extends Entity {
  name: string;
  email: string;
  avatarUrl: string;
}
