import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../../shared/generics';
import { RefreshToken } from '../refresh-token.model';
import { DocType } from '../../shared/interfaces/document.type';

@Injectable()
export class RefreshTokensRepository extends EntityRepository<RefreshToken> {
  constructor(
    @InjectModel('RefreshToken')
    public readonly RefreshTokenModel: Model<DocType<RefreshToken>>
  ) {
    super(RefreshTokenModel);
  }
}
