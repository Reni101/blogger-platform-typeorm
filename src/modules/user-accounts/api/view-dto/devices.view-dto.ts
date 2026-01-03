import { Session } from '../../domain/session.entity';

export class DeviceViewDto {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;

    static mapToView(session: Session): DeviceViewDto {
        const dto = new DeviceViewDto();
        dto.ip = session.ip;
        dto.title = session.deviceName;
        dto.lastActiveDate = new Date(+session.iat).toISOString();
        dto.deviceId = session.deviceId;

        return dto;
    }
}
