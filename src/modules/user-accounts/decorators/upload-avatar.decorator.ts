import {
    applyDecorators,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { uploadAvatarApiSchema } from '../api/input-dto/api';
import { MAX_AVATAR_SIZE_BYTES } from '../pipes/upload-avatar-file.pipe';

export function UploadAvatar() {
    return applyDecorators(
        UseGuards(JwtAuthGuard),
        HttpCode(HttpStatus.OK),
        ApiBearerAuth(),
        ApiConsumes('multipart/form-data'),
        ApiBody({ schema: uploadAvatarApiSchema }),
        Post('upload-avatar'),
        UseInterceptors(
            FileInterceptor('file', {
                limits: { fileSize: MAX_AVATAR_SIZE_BYTES },
            }),
        ),
    );
}
