import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserAvatarDomainDto } from './dto/create-user-avatar.domain.dto';

@Schema({ timestamps: true })
export class UserAvatar {
    @Prop({ type: Number, required: true })
    userId: number;
    @Prop({ type: Buffer, required: true })
    file: Buffer;
    @Prop({ type: String, required: true })
    fileName: string;
    @Prop({ type: String, required: true })
    mimeType: string;

    createdAt: Date;
    updatedAt: Date;

    static createInstance(dto: CreateUserAvatarDomainDto): UserAvatarDocument {
        const userAvatar = new this();
        userAvatar.userId = dto.userId;
        userAvatar.file = dto.file;
        userAvatar.fileName = dto.fileName;
        userAvatar.mimeType = dto.mimeType;
        return userAvatar as UserAvatarDocument;
    }
}

export const UserAvatarSchema = SchemaFactory.createForClass(UserAvatar);

UserAvatarSchema.loadClass(UserAvatar);

export type UserAvatarDocument = HydratedDocument<UserAvatar>;

export type UserAvatarModelType = Model<UserAvatarDocument> & typeof UserAvatar;
