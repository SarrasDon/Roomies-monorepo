import { Injectable } from '@nestjs/common';
import { GenericService } from '../../shared/generics';
import { RefreshTokensRepository } from '../repositories';
import { RefreshToken } from '../refresh-token.model';

@Injectable()
export class RefreshTokensService extends GenericService<RefreshToken, {}> {
  constructor(public repository: RefreshTokensRepository) {
    super(repository);
  }
}
