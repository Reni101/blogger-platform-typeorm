import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SessionsService } from '../sessions.service';
import { SessionsQueryRepository } from '../../infastructure/query/sessions-query.repository';
import { DeviceViewDto } from '../../api/view-dto/devices.view-dto';

export class GetDevicesQuery {
    constructor(public refreshToken: string | undefined) {}
}

@QueryHandler(GetDevicesQuery)
export class GetDevicesQueryHandler implements IQueryHandler<GetDevicesQuery> {
    constructor(
        private sessionsService: SessionsService,
        private sessionsQueryRepository: SessionsQueryRepository,
    ) {}

    async execute({ refreshToken }: GetDevicesQuery) {
        const session =
            await this.sessionsService.checkRefreshToken(refreshToken);
        const sessions = await this.sessionsQueryRepository.getSessions(
            session.userId,
        );
        return sessions.map(DeviceViewDto.mapToView);
    }
}
