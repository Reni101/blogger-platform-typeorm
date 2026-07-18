import { ApiProperty } from '@nestjs/swagger';

export class UploadPhotoInputDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'User photo (max 5MB)',
    })
    file: Express.Multer.File;
}
