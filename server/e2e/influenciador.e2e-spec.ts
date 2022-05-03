import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { InfluenciadorDTO } from '../src/service/dto/influenciador.dto';
import { InfluenciadorService } from '../src/service/influenciador.service';

describe('Influenciador Controller', () => {
    let app: INestApplication;

    const authGuardMock = { canActivate: (): any => true };
    const rolesGuardMock = { canActivate: (): any => true };
    const entityMock: any = {
        id: 'entityId',
    };

    const serviceMock = {
        findById: (): any => entityMock,
        findAndCount: (): any => [entityMock, 0],
        save: (): any => entityMock,
        update: (): any => entityMock,
        deleteById: (): any => entityMock,
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardMock)
            .overrideGuard(RolesGuard)
            .useValue(rolesGuardMock)
            .overrideProvider(InfluenciadorService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all influenciadors ', async () => {
        const getEntities: InfluenciadorDTO[] = (
            await request(app.getHttpServer())
                .get('/api/influenciadors')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET influenciadors by id', async () => {
        const getEntity: InfluenciadorDTO = (
            await request(app.getHttpServer())
                .get('/api/influenciadors/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create influenciadors', async () => {
        const createdEntity: InfluenciadorDTO = (
            await request(app.getHttpServer())
                .post('/api/influenciadors')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update influenciadors', async () => {
        const updatedEntity: InfluenciadorDTO = (
            await request(app.getHttpServer())
                .put('/api/influenciadors')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update influenciadors from id', async () => {
        const updatedEntity: InfluenciadorDTO = (
            await request(app.getHttpServer())
                .put('/api/influenciadors/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE influenciadors', async () => {
        const deletedEntity: InfluenciadorDTO = (
            await request(app.getHttpServer())
                .delete('/api/influenciadors/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
