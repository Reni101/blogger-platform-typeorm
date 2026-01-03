import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infastructure/users.repository';

export class DeleteUserCommand {
    constructor(public id: number) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ id }: DeleteUserCommand) {
        const user = await this.usersRepository.findByIdOrThrow(id);
        user.softDelete();
        await this.usersRepository.save(user);
    }
}
