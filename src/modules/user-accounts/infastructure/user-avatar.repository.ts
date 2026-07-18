import { Injectable } from '@nestjs/common';
import { UserAvatar, UserAvatarModelType } from '../domain/user-avatar.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserAvatarRepository {
    constructor(
        @InjectModel(UserAvatar.name) private UserModel: UserAvatarModelType,
    ) {}
}
