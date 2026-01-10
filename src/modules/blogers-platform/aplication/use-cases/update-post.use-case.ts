import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostInputDto } from '../../api/input-dto/post/update-post.input-dto';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class UpdatePostCommand {
    constructor(
        public dto: UpdatePostInputDto,
        public blogId: number,
        public postId: number,
    ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
    constructor(private postsRepository: PostsRepository) {}

    async execute({ dto, postId, blogId }: UpdatePostCommand) {
        const post = await this.postsRepository.findByIdOrThrow(postId, blogId);
        post.title = dto.title;
        post.shortDescription = dto.shortDescription;
        post.content = dto.content;
        await this.postsRepository.save(post);
    }
}
