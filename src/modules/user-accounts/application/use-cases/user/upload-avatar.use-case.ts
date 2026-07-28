import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserAvatarRepository } from '../../../infastructure/user-avatar.repository';
import sharp from 'sharp';

export class UploadAvatarCommand {
    constructor(public dto: { userId: number; file: Express.Multer.File }) {}
}

@CommandHandler(UploadAvatarCommand)
export class UploadAvatarUseCase implements ICommandHandler<UploadAvatarCommand> {
    constructor(private userAvatarRepository: UserAvatarRepository) {}

    async execute({ dto }: UploadAvatarCommand) {
        const { userId, file } = dto;

        const existingAvatar =
            await this.userAvatarRepository.findByUserId(userId);

        const buffer = await sharp(file.buffer)
            .resize(300, 300, {
                fit: 'inside',
                withoutEnlargement: true,
            })
            .toBuffer();

        if (existingAvatar) {
            existingAvatar.file = buffer;
            existingAvatar.fileName = file.originalname;
            existingAvatar.mimeType = file.mimetype;
            await this.userAvatarRepository.save(existingAvatar);
            return;
        }

        const avatar = this.userAvatarRepository.createAvatar({
            userId,
            file: buffer,
            fileName: file.originalname,
            mimeType: file.mimetype,
        });

        await this.userAvatarRepository.save(avatar);
    }
}
