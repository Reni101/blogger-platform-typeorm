import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateSessionDomainDto } from './dto/create-session.domain.dto';

@Schema({ timestamps: true })
export class Session {
    @Prop({ type: Number, required: true })
    userId: number;

    @Prop({ type: String, required: true })
    deviceId: string;

    @Prop({ type: String, required: true })
    deviceName: string;

    @Prop({ type: String, required: true })
    ip: string;

    @Prop({ type: Number, required: true })
    exp: number;

    @Prop({ type: Number, required: true })
    iat: number;

    createdAt: Date;
    updatedAt: Date;

    static createInstance(dto: CreateSessionDomainDto): SessionDocument {
        const session = new this();
        session.deviceName = dto.deviceName;
        session.userId = dto.userId;
        session.ip = dto.ip;
        session.exp = dto.exp;
        session.iat = dto.iat;
        session.deviceId = dto.deviceId;
        return session as SessionDocument;
    }
}
export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.loadClass(Session);

export type SessionDocument = HydratedDocument<Session>;

export type SessionModelType = Model<SessionDocument> & typeof Session;
