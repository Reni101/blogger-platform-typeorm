import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserAvatarRepository } from '../../../infastructure/user-avatar.repository';

export class UploadPhotoCommand {
    constructor(public dto: { userId: number; file: Express.Multer.File }) {}
}

@CommandHandler(UploadPhotoCommand)
export class UploadPhotoUseCase implements ICommandHandler<UploadPhotoCommand> {
    constructor(private userAvatarRepository: UserAvatarRepository) {}

    async execute({ dto }: UploadPhotoCommand) {}
}
