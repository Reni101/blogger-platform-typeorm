import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';
import { UserAvatarsRepository } from '../../../infastructure/user-avatars.repository';

const MAX_PHOTO_SIZE_BYTES = 4 * 1024 * 1024; // 5MB

export class UploadPhotoCommand {
    constructor(public dto: { userId: number; file: Express.Multer.File }) {}
}

@CommandHandler(UploadPhotoCommand)
export class UploadPhotoUseCase implements ICommandHandler<UploadPhotoCommand> {
    constructor(private userAvatarsRepository: UserAvatarsRepository) {}

    async execute({ dto }: UploadPhotoCommand) {
        const { userId, file } = dto;

        if (!file) {
            throw new DomainException({
                code: DomainExceptionCode.BadRequest,
                message: 'Photo is required',
                extensions: [{ field: 'file', message: 'Photo is required' }],
            });
        }

        if (file.size > MAX_PHOTO_SIZE_BYTES) {
            throw new DomainException({
                code: DomainExceptionCode.BadRequest,
                message: 'File size must not exceed 4MB',
                extensions: [
                    {
                        field: 'file',
                        message: 'File size must not exceed 5MB',
                    },
                ],
            });
        }

        const fileBase64 = file.buffer.toString('base64');
        const existingAvatar =
            await this.userAvatarsRepository.findByUserId(userId);

        if (existingAvatar) {
            existingAvatar.updatePhoto(fileBase64);
            await this.userAvatarsRepository.save(existingAvatar);
            return;
        }

        await this.userAvatarsRepository.create({
            userId,
            file: fileBase64,
        });
    }
}
