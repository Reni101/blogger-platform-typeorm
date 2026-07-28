export class CreateUserAvatarDomainDto {
    userId: number;
    file: Buffer;
    fileName: string;
    mimeType: string;
}
