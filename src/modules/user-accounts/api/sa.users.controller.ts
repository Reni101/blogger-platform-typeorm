import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../guards/basic/bacis-auth.guard';
import { CreateUserInputDto } from './input-dto/user.input-dto';
import { CreateUserCommand } from '../application/use-cases/admin/create-user.use-case';
import { DeleteUserCommand } from '../application/use-cases/admin/delete-user.use-case';
import { PaginatedUsersViewDto, UserViewDto } from './view-dto/user.view-dto';
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input-dto';
import { GetUsersQuery } from '../application/queries/get-users.query';

@Controller('sa/users')
@ApiSecurity('basic')
@UseGuards(BasicAuthGuard)
export class SaUsersController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}
    @Post()
    async createUser(@Body() body: CreateUserInputDto) {
        // commit for web
        return this.commandBus.execute<CreateUserCommand, UserViewDto>(
            new CreateUserCommand(body),
        );
    }

    @Get()
    async getAll(@Query() query: GetUsersQueryParams) {
        return this.queryBus.execute<GetUsersQuery, PaginatedUsersViewDto>(
            new GetUsersQuery(query),
        );
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param('id') id: number) {
        return this.commandBus.execute<DeleteUserCommand, void>(
            new DeleteUserCommand(id),
        );
    }
}
