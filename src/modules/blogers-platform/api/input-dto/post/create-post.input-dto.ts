import { CreatePostDto } from '../../../domain/dto/create-post.dto';
import { Trim } from '../../../../../core/decorators/transform/trim';
import { IsString, Length } from 'class-validator';
import {
    contentDescriptionConstraints,
    shortDescriptionConstraints,
    titleConstraints,
} from '../../../domain/post.entity';

export class CreatePostInputDto implements CreatePostDto {
    @Trim()
    @IsString()
    @Length(titleConstraints.minLength, titleConstraints.maxLength)
    title: string;

    @Trim()
    @IsString()
    @Length(
        shortDescriptionConstraints.minLength,
        shortDescriptionConstraints.maxLength,
    )
    shortDescription: string;

    @Trim()
    @IsString()
    @Length(
        contentDescriptionConstraints.minLength,
        contentDescriptionConstraints.maxLength,
    )
    content: string;
}
