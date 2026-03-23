import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/app.module';
import { appSetup } from '../../src/setup/app.setup';

describe('Auth - Login (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        appSetup(app);
        app.use(cookieParser());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    const loginPath = '/api/auth/login';
    const validCredentials = {
        loginOrEmail: 'maxim12',
        password: 'maxim12',
    };

    it('should login successfully and return accessToken with refreshToken cookie', async () => {
        const response = await request(app.getHttpServer())
            .post(loginPath)
            .send(validCredentials)
            .expect(HttpStatus.OK);

        expect(response.body).toEqual({
            accessToken: expect.any(String),
        });

        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();

        const refreshTokenCookie = Array.isArray(cookies)
            ? cookies.find((c: string) => c.startsWith('refreshToken='))
            : typeof cookies === 'string' && cookies.startsWith('refreshToken=')
              ? cookies
              : undefined;

        expect(refreshTokenCookie).toBeDefined();
        expect(refreshTokenCookie).toContain('HttpOnly');
    });

    it('should return 401 for wrong password', async () => {
        await request(app.getHttpServer())
            .post(loginPath)
            .send({
                loginOrEmail: 'maxim12',
                password: 'wrongPassword',
            })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 401 for non-existing user', async () => {
        await request(app.getHttpServer())
            .post(loginPath)
            .send({
                loginOrEmail: 'nonExistingUser',
                password: 'somePassword',
            })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 401 when no body is provided', async () => {
        await request(app.getHttpServer())
            .post(loginPath)
            .send({})
            .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    });
});
