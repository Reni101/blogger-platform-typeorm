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
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../guards/decorators/extract-user-from-request.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { UploadPhotoCommand } from '../application/use-cases/user/upload-photo.use-case';
import { UploadPhotoInputDto } from './input-dto/user-avatar.input-dto';

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

@Controller('user')
export class UserController {
    constructor(private commandBus: CommandBus) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Upload user photo' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadPhotoInputDto })
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            limits: { fileSize: MAX_PHOTO_SIZE_BYTES },
        }),
    )
    @HttpCode(HttpStatus.OK)
    @Post('upload-photo')
    async uploadPhoto(
        @ExtractUserFromRequest() user: UserContextDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.commandBus.execute(
            new UploadPhotoCommand({ userId: user.id, file }),
        );
    }
}
