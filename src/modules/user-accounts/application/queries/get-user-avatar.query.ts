import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserAvatarRepository } from '../../infastructure/user-avatar.repository';

export class GetUserAvatarQuery {
    constructor(public userId: number) {}
}

@QueryHandler(GetUserAvatarQuery)
export class GetUserAvatarQueryHandler implements IQueryHandler<GetUserAvatarQuery> {
    constructor(private userAvatarRepository: UserAvatarRepository) {}

    async execute({ userId }: GetUserAvatarQuery) {
        const avatar = await this.userAvatarRepository.findByUserId(userId);

        if (!avatar) {
            return null;
        }

        return avatar;
    }
}
