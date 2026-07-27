import { Controller, UploadedFile } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ExtractUserFromRequest } from '../guards/decorators/extract-user-from-request.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { UploadAvatarCommand } from '../application/use-cases/user/upload-avatar.use-case';
import { uploadAvatarFilePipe } from '../pipes/upload-avatar-file.pipe';
import { UploadAvatar } from '../decorators/upload-avatar.decorator';

@Controller('user')
export class UserController {
    constructor(private commandBus: CommandBus) {}

    @UploadAvatar()
    async uploadAvatar(
        @ExtractUserFromRequest() user: UserContextDto,
        @UploadedFile(uploadAvatarFilePipe)
        file: Express.Multer.File,
    ) {
        return this.commandBus.execute<UploadAvatarCommand, void>(
            new UploadAvatarCommand({ userId: user.id, file }),
        );
    }
}
