import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '@roomies/shared.data';
import { RefreshToken } from '../refresh-token.model';
import { DocType } from '@roomies/shared.data';

@Injectable()
export class RefreshTokensRepository extends EntityRepository<RefreshToken> {
  constructor(
    @InjectModel('RefreshToken')
    public readonly RefreshTokenModel: Model<DocType<RefreshToken>>
  ) {
    super(RefreshTokenModel);
  }
}
