import {
    Controller,
    Get,
    Res,
    StreamableFile,
    UploadedFile,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ExtractUserFromRequest } from '../guards/decorators/extract-user-from-request.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { UploadAvatarCommand } from '../application/use-cases/user/upload-avatar.use-case';
import { uploadAvatarFilePipe } from '../pipes/upload-avatar-file.pipe';
import { UploadAvatar } from '../decorators/upload-avatar.decorator';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { GetUserAvatarQuery } from '../application/queries/get-user-avatar.query';
import { Response } from 'express';
import { UserAvatar } from '../domain/user-avatar.schema';

@Controller('user')
export class UserController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('avatar')
    async getAvatar(
        @ExtractUserFromRequest() user: UserContextDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const avatar = await this.queryBus.execute<
            GetUserAvatarQuery,
            UserAvatar | null
        >(new GetUserAvatarQuery(user.id));

        if (!avatar) {
            return null;
        }
        res.set({
            'Content-Type': avatar.mimeType,
            'Cache-Control': 'private, max-age=3600',
        });

        return new StreamableFile(avatar.file);
    }

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
