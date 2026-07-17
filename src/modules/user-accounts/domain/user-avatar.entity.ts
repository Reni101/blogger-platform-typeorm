import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserAvatarDto } from './dto/create-user-avatar.domain.dto';

@Schema({ timestamps: true })
export class UserAvatar {
    @Prop({ type: Number, required: true })
    userId: number;
    @Prop({ type: String, required: true })
    file: string;

    createdAt: Date;
    updatedAt: Date;

    static createInstance(dto: CreateUserAvatarDto): UserAvatarDocument {
        const userAvatar = new this();
        userAvatar.userId = dto.userId;
        userAvatar.file = dto.file;
        return userAvatar as UserAvatarDocument;
    }
    //
    // updateSession(dto: { iat: number; exp: number }) {
    //     this.iat = dto.iat;
    //     this.exp = dto.exp;
    // }
}

export const SessionSchema = SchemaFactory.createForClass(UserAvatar);

SessionSchema.loadClass(UserAvatar);

export type UserAvatarDocument = HydratedDocument<UserAvatar>;

export type UserAvatarModelType = Model<UserAvatarDocument> & typeof UserAvatar;
