import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBlogInputDto } from '../../api/input-dto/blog/update-blog.input-dto';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class UpdateBlogCommand {
    constructor(
        public dto: UpdateBlogInputDto,
        public blogId: number,
    ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
    constructor(private blogsRepository: BlogsRepository) {}

    async execute({ dto, blogId }: UpdateBlogCommand) {
        const blog = await this.blogsRepository.findByIdOrThrow(blogId);
        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl;
        await this.blogsRepository.save(blog);
    }
}
