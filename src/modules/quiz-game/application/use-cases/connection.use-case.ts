import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class ConnectionCommand {
    constructor(public userId: number) {}
}

@CommandHandler(ConnectionCommand)
export class ConnectionUseCase implements ICommandHandler<ConnectionCommand> {
    constructor() {}

    async execute({ userId }: ConnectionCommand) {}
}
