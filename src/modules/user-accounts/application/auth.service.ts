import { Injectable } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { UsersRepository } from '../infastructure/users.repository';

@Injectable()
export class AuthService {
    constructor(
        private usersRepository: UsersRepository,
        private cryptoService: CryptoService,
    ) {}
    async validateUser(loginOrEmail: string, password: string) {
        const user =
            await this.usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) {
            return null;
        }

        const isPasswordValid = await this.cryptoService.comparePassword({
            password,
            hash: user.passwordHash,
        });

        if (!isPasswordValid) {
            return null;
        }

        return { id: user.id };
    }
}
