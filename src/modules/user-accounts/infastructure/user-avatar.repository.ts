import { Injectable } from '@nestjs/common';
import {
    UserAvatar,
    UserAvatarDocument,
    UserAvatarModelType,
} from '../domain/user-avatar.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserAvatarDomainDto } from '../domain/dto/create-user-avatar.domain.dto';

@Injectable()
export class UserAvatarRepository {
    constructor(
        @InjectModel(UserAvatar.name)
        private userAvatarModel: UserAvatarModelType,
    ) {}

    findByUserId(userId: number) {
        return this.userAvatarModel.findOne({ userId });
    }

    createAvatar(dto: CreateUserAvatarDomainDto) {
        return this.userAvatarModel.createInstance(dto);
    }

    async save(avatar: UserAvatarDocument) {
        await avatar.save();
    }
}
