import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogInputDto } from '../../api/input-dto/blog/create-blog.input-dto';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogViewDto } from '../../api/view-dto/blogs.view-dto';

export class CreateBlogCommand {
    constructor(public dto: CreateBlogInputDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
    constructor(private blogsRepository: BlogsRepository) {}

    async execute({ dto }: CreateBlogCommand): Promise<BlogViewDto> {
        const blog = await this.blogsRepository.createBlog(dto);
        return {
            id: blog.id.toString(),
            name: blog.name,
            description: blog.description,
            createdAt: blog.createdAt,
            websiteUrl: blog.websiteUrl,
            isMembership: blog.isMembership,
        };
    }
}
