import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { GetPostsQueryParams } from './input-dto/post/get-posts-query-params.input-dto';
import { JwtOptionalAuthGuard } from '../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { UserContextDto } from '../../user-accounts/guards/dto/user-context.dto';
import { ExtractUserIfExistsFromRequest } from '../../user-accounts/guards/decorators/extract-user-if-exists-from-request.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PostsQueryRepository } from '../infrastructure/posts-query.repository';

@Controller('posts')
export class PostsController {
    constructor(private postsQueryRepository: PostsQueryRepository) {}

    @ApiBearerAuth()
    @Get()
    @UseGuards(JwtOptionalAuthGuard)
    async getPosts(
        @Query() query: GetPostsQueryParams,
        @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
    ) {
        return this.postsQueryRepository.getPosts(query, { userId: user?.id });
    }
    @ApiBearerAuth()
    @Get(':id')
    @UseGuards(JwtOptionalAuthGuard)
    async getPostById(
        @Param('id') id: number,
        @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
    ) {
        return this.postsQueryRepository.getByIdOrThrow({
            postId: id,
            userId: user?.id,
        });
    }

    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    // @HttpCode(HttpStatus.NO_CONTENT)
    // @Put(':postId/like-status')
    // async likeStatus(
    //     @Param('postId') postId: number,
    //     @Body() body: likeStatusInputDto,
    //     @ExtractUserFromRequest() user: UserContextDto,
    // ) {
    //     return this.commandBus.execute<ToggleLikePostsCommand, void>(
    //         new ToggleLikePostsCommand({
    //             status: body.likeStatus,
    //             postId: postId,
    //             userId: user.id,
    //         }),
    //     );
    // }
    //
    // // comments
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    // @Post(':postId/comments')
    // async createComment(
    //     @Param('postId') postId: number,
    //     @Body() dto: CommentInputDto,
    //     @ExtractUserFromRequest() user: UserContextDto,
    // ) {
    //     return await this.commandBus.execute<
    //         CreateCommentCommand,
    //         CommentViewDto
    //     >(
    //         new CreateCommentCommand({
    //             postId,
    //             content: dto.content,
    //             commentatorUserId: user.id,
    //         }),
    //     );
    // }
    //
    // @ApiBearerAuth()
    // @Get(':postId/comments')
    // @UseGuards(JwtOptionalAuthGuard)
    // async getCommentsByPostId(
    //     @Query() query: GetCommentsQueryParams,
    //     @Param('postId') postId: number,
    //     @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
    // ) {
    //     return this.queryBus.execute<
    //         GetCommentsQuery,
    //         PaginatedCommentsViewDto
    //     >(new GetCommentsQuery({ postId, userId: user?.id, query }));
    // }
}
