import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class DeleteBlogCommand {
    constructor(public blogId: number) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
    constructor(private blogsRepository: BlogsRepository) {}

    async execute({ blogId }: DeleteBlogCommand) {
        const blog = await this.blogsRepository.findByIdOrThrow(blogId);
        await this.blogsRepository.delete(blog.id);
    }
}
