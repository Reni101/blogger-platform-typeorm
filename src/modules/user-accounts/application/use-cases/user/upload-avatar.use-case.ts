import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserAvatarRepository } from '../../../infastructure/user-avatar.repository';

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

        if (existingAvatar) {
            existingAvatar.file = file.buffer;
            existingAvatar.fileName = file.originalname;
            await this.userAvatarRepository.save(existingAvatar);
            return;
        }

        const avatar = this.userAvatarRepository.createAvatar({
            userId,
            file: file.buffer,
            fileName: file.originalname,
            mimeType: file.mimetype,
        });

        await this.userAvatarRepository.save(avatar);
    }
}
