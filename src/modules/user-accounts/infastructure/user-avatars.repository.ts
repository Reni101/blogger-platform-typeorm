import { Injectable } from '@nestjs/common';
import { UserAvatar, UserAvatarModelType } from '../domain/user-avatar.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserAvatarsRepository {
    constructor(
        @InjectModel(UserAvatar.name)
        private userAvatarModel: UserAvatarModelType,
    ) {}
}
