import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { ExtractUserFromRequest } from '../guards/decorators/extract-user-from-request.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';

@Controller('user')
export class UserController {
    constructor(private commandBus: CommandBus) {}
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('upload-photo')
    async login(@ExtractUserFromRequest() user: UserContextDto) {
        return;
    }
}
