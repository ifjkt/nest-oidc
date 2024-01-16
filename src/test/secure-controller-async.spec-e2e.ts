import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../auth.module';
import { TestController } from './controllers/test.controller';
import { ConfigModule } from '@nestjs/config';
import { TestService } from './service/test.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    jest.resetModules();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [TestService],
      imports: [
        ConfigModule.forRoot(),
        AuthModule.forRootAsync({
          inject: [TestService],
          useFactory: async (testService: TestService) => ({
            oidcAuthority: `${process.env.OIDC_AUTHORITY_URL}/realms/${process.env.OIDC_AUTHORITY_REALM}`,
            roleEvaluators: [],
            jwtMapper: (payload: any) => payload,
            permissions: async (payload: any) => {
              return await testService.getPermissions();
            },
          }),
        }),
      ],
      controllers: [TestController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });

  it('/secure (GET) without token', () => {
    return request(app.getHttpServer()).get('/secure').expect(401);
  });

  it('/secure (GET)', () => {
    return request(app.getHttpServer())
      .get('/secure')
      .set('Authorization', `Bearer ${process.env.VALID_ACCESS_TOKEN}`)
      .expect(200)
      .expect("I'm a secure endpoint!");
  });

  it('/secure (GET) with permissions', () => {
    return request(app.getHttpServer())
      .get('/secure/permission')
      .set('Authorization', `Bearer ${process.env.VALID_ACCESS_TOKEN}`)
      .expect(200)
      .expect("I'm a secure endpoint via permissions!");
  });

  it('/secure (GET) with roles', () => {
    return request(app.getHttpServer())
      .get('/secure/role')
      .set('Authorization', `Bearer ${process.env.VALID_ACCESS_TOKEN}`)
      .expect(200)
      .expect("I'm a secure endpoint via roles!");
  });
});
