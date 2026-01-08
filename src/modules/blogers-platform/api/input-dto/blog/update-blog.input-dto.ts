import { CreateBlogDto } from '../../../domain/dto/create-blog.dto';
import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/transform/trim';
import {
    descriptionConstraints,
    nameConstraints,
} from '../../../domain/blog.entity';

export class UpdateBlogInputDto implements CreateBlogDto {
    @IsString()
    @Trim()
    @Length(nameConstraints.minLength, nameConstraints.maxLength)
    name: string;

    @Trim()
    @IsString()
    @Length(descriptionConstraints.minLength, descriptionConstraints.maxLength)
    description: string;

    @Trim()
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    websiteUrl: string;
}
