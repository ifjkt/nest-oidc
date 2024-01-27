import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../auth.module';
import { TestController } from './controllers/test.controller';
import { ConfigModule } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    jest.resetModules();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        AuthModule.forRoot({
          oidcAuthority: [
            `${process.env.OIDC_AUTHORITY_URL}/realms/${process.env.OIDC_AUTHORITY_REALM}`,
            `${process.env.OIDC_AUTHORITY_URL}/realms/${process.env.OIDC_AUTHORITY_REALM_2}`,
            `${process.env.OIDC_AUTHORITY_URL}/realms/${process.env.OIDC_AUTHORITY_REALM_3}`,
          ],
          roles: () => ['ROLE_TESTER'],
          permissions: () => ['PERMISSION_A', 'PERMISSION_B', 'PERMISSION_C'],
          jwtMapper: (payload: any) => payload,
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

  it('/secure/permission (GET) with permissions', () => {
    return request(app.getHttpServer())
      .get('/secure/permission')
      .set('Authorization', `Bearer ${process.env.VALID_ACCESS_TOKEN}`)
      .expect(200)
      .expect("I'm a secure endpoint via permissions!");
  });

  it('/secure/permission-other (GET) with insufficient permissions', () => {
    return request(app.getHttpServer())
      .get('/secure/permission-other')
      .set('Authorization', `Bearer ${process.env.VALID_ACCESS_TOKEN}`)
      .expect(403);
  });

  it('/secure/role (GET) with roles', () => {
    return request(app.getHttpServer())
      .get('/secure/role')
      .set('Authorization', `Bearer ${process.env.VALID_ACCESS_TOKEN}`)
      .expect(200)
      .expect("I'm a secure endpoint via roles!");
  });

  it('/secure/role-other (GET) with insufficient roles', () => {
    return request(app.getHttpServer())
      .get('/secure/role-other')
      .set('Authorization', `Bearer ${process.env.VALID_ACCESS_TOKEN}`)
      .expect(403);
  });

  it('/secure/role-permission (GET) with roles and permissions', () => {
    return request(app.getHttpServer())
      .get('/secure/role-permission')
      .set('Authorization', `Bearer ${process.env.VALID_ACCESS_TOKEN}`)
      .expect(200)
      .expect("I'm a secure endpoint via roles and permissions!");
  });

  it('/secure/role-permission-other (GET) with sufficient roles and insufficient permissions', () => {
    return request(app.getHttpServer())
      .get('/secure/role-permission-other')
      .set('Authorization', `Bearer ${process.env.VALID_ACCESS_TOKEN}`)
      .expect(403);
  });

  it('/secure/role-other-permission (GET) with insufficient roles and sufficient permissions', () => {
    return request(app.getHttpServer())
      .get('/secure/role-other-permission')
      .set('Authorization', `Bearer ${process.env.VALID_ACCESS_TOKEN}`)
      .expect(403);
  });

  it('/secure/role-other-permission-other (GET) with insufficient roles and insufficient permissions', () => {
    return request(app.getHttpServer())
      .get('/secure/role-other-permission-other')
      .set('Authorization', `Bearer ${process.env.VALID_ACCESS_TOKEN}`)
      .expect(403);
  });
});
