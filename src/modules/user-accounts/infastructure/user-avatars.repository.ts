import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    UserAvatar,
    UserAvatarDocument,
    UserAvatarModelType,
} from '../domain/user-avatar.shema';
import { CreateUserAvatarDto } from '../domain/dto/create-user-avatar.domain.dto';

@Injectable()
export class UserAvatarsRepository {
    constructor(
        @InjectModel(UserAvatar.name)
        private userAvatarModel: UserAvatarModelType,
    ) {}

    async findByUserId(userId: number): Promise<UserAvatarDocument | null> {
        return this.userAvatarModel.findOne({ userId });
    }

    async save(userAvatar: UserAvatarDocument): Promise<void> {
        await userAvatar.save();
    }

    async create(dto: CreateUserAvatarDto): Promise<UserAvatarDocument> {
        const userAvatar = this.userAvatarModel.createInstance(dto);
        await userAvatar.save();
        return userAvatar;
    }
}
