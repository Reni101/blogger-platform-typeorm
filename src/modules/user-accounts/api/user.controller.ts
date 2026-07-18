import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { ExtractUserFromRequest } from '../guards/decorators/extract-user-from-request.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { UploadPhotoCommand } from '../application/use-cases/user/upload-photo.use-case';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
    constructor(private commandBus: CommandBus) {}

    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('upload-photo')
    @UseInterceptors(FileInterceptor('file'))
    async login(
        @ExtractUserFromRequest() user: UserContextDto,
        @UploadedFile() file: Express.Multer.File,
        promise: Promise<void> = this.commandBus.execute<
            UploadPhotoCommand,
            void
        >(new UploadPhotoCommand({ userId: user.id, file })),
    ) {
        return promise;
    }
}
