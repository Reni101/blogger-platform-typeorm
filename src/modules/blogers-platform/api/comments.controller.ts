import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Put,
    UseGuards,
} from '@nestjs/common';
import { JwtOptionalAuthGuard } from '../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../../user-accounts/guards/decorators/extract-user-if-exists-from-request.decorator';
import { UserContextDto } from '../../user-accounts/guards/dto/user-context.dto';
import { CommandBus } from '@nestjs/cqrs';

import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';
import { UpdateCommentInputDto } from './input-dto/comments/comment.input-dto';
import { ExtractUserFromRequest } from '../../user-accounts/guards/decorators/extract-user-from-request.decorator';

import { likeStatusInputDto } from './input-dto/likeStatus.input-dto';

@Controller('comments')
export class CommentsController {
    constructor(private commandBus: CommandBus) {}

    @ApiBearerAuth()
    @Get(':commentId')
    @UseGuards(JwtOptionalAuthGuard)
    async getById(
        @Param('commentId') commentId: number,
        @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
    ) {
        // return this.queryBus.execute<GetCommentQuery, CommentViewDto>(
        //     new GetCommentQuery({ commentId, userId: user?.id }),
        // );
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put(':commentId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateComment(
        @Param('commentId') commentId: number,
        @Body() body: UpdateCommentInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ) {
        // return this.commandBus.execute<UpdateCommentCommand, void>(
        //     new UpdateCommentCommand({
        //         commentId,
        //         content: body.content,
        //         userId: user.id,
        //     }),
        // );
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteComment(
        @Param('id') id: number,
        @ExtractUserFromRequest() user: UserContextDto,
    ) {
        // return this.commandBus.execute<DeleteCommentCommand, void>(
        //     new DeleteCommentCommand({ commentId: id, userId: user.id }),
        // );
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put(':id/like-status')
    @HttpCode(HttpStatus.NO_CONTENT)
    async likeStatus(
        @Param('id') id: number,
        @Body() body: likeStatusInputDto,
        @ExtractUserFromRequest() user: UserContextDto,
    ) {
        // return this.commandBus.execute<ToggleLikeCommentCommand, void>(
        //     new ToggleLikeCommentCommand({
        //         status: body.likeStatus,
        //         commentId: id,
        //         userId: user.id,
        //     }),
        // );
    }
}
