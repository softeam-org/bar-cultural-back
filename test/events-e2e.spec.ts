import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';

import { AppModule } from '@src/app.module';
import { CreateEventDto } from '@src/events/dto/create-event.dto';
import { UpdateEventDto } from '@src/events/dto/update-event.dto';
import { Event } from '@src/events/entities/event.entity';
import { PrismaService } from '@src/prisma/prisma.service';

describe('Events (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let prisma: PrismaService;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  const createEventDto = new CreateEventDto();
  const event = new Event();

  beforeEach(async () => {
    createEventDto.name = 'evento';
    createEventDto.ended_at = new Date(2024, 5, 25);
    createEventDto.attraction = 'atração';
    createEventDto.observations = 'observação';

    event.id = expect.any(String);
    event.name = createEventDto.name;
    event.created_at = expect.any(String);
    event.updated_at = expect.any(String);
    event.ended_at = createEventDto.ended_at;
    event.attraction = createEventDto.attraction;
    event.observations = createEventDto.observations;

    await prisma.event.deleteMany();
  });

  test('/event (POST)', async () => {
    await request(app.getHttpServer())
      .post('/events')
      .send(createEventDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });
  });

  test('/event (GET)', async () => {
    const eventsNames = ['evento2', 'evento1', 'evento3'];
    const create = eventsNames.map((name) => {
      const dto: CreateEventDto = { ...createEventDto, name };
      return request(app.getHttpServer())
        .post('/events')
        .send(dto)
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveProperty('id');
        });
    });

    await Promise.all(create);

    await request(app.getHttpServer())
      .get('/events')
      .query({ order: 'asc' })
      .expect(200)
      .expect((response) => {
        expect(response.body[0].name).toEqual('evento1');
        expect(response.body[1].name).toEqual('evento2');
        expect(response.body[2].name).toEqual('evento3');
      });

    await request(app.getHttpServer())
      .get('/events')
      .query({ order: 'desc' })
      .expect(200)
      .expect((response) => {
        expect(response.body[0].name).toEqual('evento3');
        expect(response.body[1].name).toEqual('evento2');
        expect(response.body[2].name).toEqual('evento1');
      });

    await request(app.getHttpServer())
      .get('/events')
      .query({ order: 'as' })
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual(
          "Ordem só pode ser 'asc' ou 'desc'",
        );
      });

    await request(app.getHttpServer())
      .get('/events')
      .expect(200)
      .expect((response) => {
        expect(response.body.message).toEqual(
          expect(response.body).toHaveLength(3),
        );
      });
  });

  test('/event/:id (GET)', async () => {
    let eventId;
    await request(app.getHttpServer())
      .post('/events')
      .send(createEventDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
        eventId = response.body.id;
      });

    await request(app.getHttpServer())
      .get(`/events/${eventId}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          ...event,
          ended_at: event.ended_at.toISOString(),
        });
      });

    await request(app.getHttpServer())
      .get(`/events/invalido`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Evento não existe.');
      });
  });

  test('/event/:id (PATCH)', async () => {
    let eventId;
    await request(app.getHttpServer())
      .post('/events')
      .send(createEventDto)
      .expect(201)
      .expect((response) => {
        eventId = response.body.id;
      });

    createEventDto.name = 'Evento 2.0';

    await request(app.getHttpServer())
      .post('/events')
      .send(createEventDto)
      .expect(201);

    const updatedEvent = new UpdateEventDto();
    updatedEvent.name = 'nome alterado';
    updatedEvent.ended_at = new Date(2024, 8, 15);
    updatedEvent.attraction = 'nova atração';
    updatedEvent.observations = 'nova observação';

    await request(app.getHttpServer())
      .patch(`/events/${eventId}`)
      .send(updatedEvent)
      .expect(200)
      .expect((response) => {
        const { body } = response;
        expect(body.name).toEqual(updatedEvent.name);
        expect(body.ended_at).toEqual(updatedEvent.ended_at?.toISOString());
        expect(body.attraction).toEqual(updatedEvent.attraction);
        expect(body.observations).toEqual(updatedEvent.observations);
      });

    updatedEvent.name = 'Evento 2.0';

    await request(app.getHttpServer())
      .patch(`/events/invalido`)
      .send(updatedEvent)
      .expect(400)
      .expect((response) => {
        const { body } = response;
        expect(body.message).toEqual('Evento não existe.');
      });
  });

  test('/event (DELETE)', async () => {
    let eventId;

    await request(app.getHttpServer())
      .post('/events')
      .send(createEventDto)
      .expect(201)
      .expect((response) => {
        eventId = response.body.id;
      });

    await request(app.getHttpServer()).delete(`/events/${eventId}`).expect(200);

    await request(app.getHttpServer())
      .delete(`/events/${eventId}`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Evento não existe.');
      });
  });
});
