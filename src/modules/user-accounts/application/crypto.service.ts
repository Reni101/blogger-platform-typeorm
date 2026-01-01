import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
    async createPasswordHash(password: string) {
        const salt = await bcrypt.genSalt(10);

        return bcrypt.hash(password, salt);
    }

    async comparePassword(args: { password: string; hash: string }) {
        return bcrypt.compare(args.password, args.hash);
    }
}
