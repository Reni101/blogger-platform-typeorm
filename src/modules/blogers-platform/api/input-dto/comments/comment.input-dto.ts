import { Trim } from '../../../../../core/decorators/transform/trim';
import { IsString, Length } from 'class-validator';
import { contentConstraints } from '../../../domain/comment.entity';

export class CommentInputDto {
    @Trim()
    @IsString()
    @Length(contentConstraints.minLength, contentConstraints.maxLength)
    content: string;
}

export class UpdateCommentInputDto {
    @Trim()
    @IsString()
    @Length(contentConstraints.minLength, contentConstraints.maxLength)
    content: string;
}
