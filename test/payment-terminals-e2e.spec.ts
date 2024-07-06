import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';

import { AppModule } from '@src/app.module';
import { CreatePaymentTerminalDto } from '@src/payment_terminals/dto/create-payment-terminal.dto';
import { UpdatePaymentTerminalDto } from '@src/payment_terminals/dto/update-payment-terminal.dto';
import { PaymentTerminal } from '@src/payment_terminals/entities/payment-terminal.entity';
import { PrismaService } from '@src/prisma/prisma.service';

enum Status {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
}

describe('PaymentTerminals (e2e)', () => {
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

  const createPaymentTerminalDto = new CreatePaymentTerminalDto();
  const paymentTerminal = new PaymentTerminal();

  beforeEach(async () => {
    createPaymentTerminalDto.status = Status.Inativo;

    paymentTerminal.id = expect.any(String);
    paymentTerminal.status = createPaymentTerminalDto.status;

    await prisma.paymentTerminal.deleteMany();
  });

  test('/payment_terminal (POST)', async () => {
    await request(app.getHttpServer())
      .post('/payment_terminals')
      .send(createPaymentTerminalDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });
  });

  test('/payment_terminal (GET)', async () => {
    const paymentTerminalStatus = ['Ativo', 'Inativo'];
    const create = paymentTerminalStatus.map((status) => {
      const dto: CreatePaymentTerminalDto = {
        ...createPaymentTerminalDto,
        status: status as Status,
      };
      return request(app.getHttpServer())
        .post('/payment_terminals')
        .send(dto)
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveProperty('id');
        });
    });

    await Promise.all(create);

    await request(app.getHttpServer())
      .get('/payment_terminals')
      .expect(200)
      .expect((response) => {
        expect(response.body.message).toEqual(
          expect(response.body).toHaveLength(2),
        );
      });
  });

  test('/payment_terminal/:id (GET)', async () => {
    let paymentTerminalId;
    await request(app.getHttpServer())
      .post('/payment_terminals')
      .send(createPaymentTerminalDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
        paymentTerminalId = response.body.id;
      });

    await request(app.getHttpServer())
      .get(`/payment_terminals/${paymentTerminalId}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(paymentTerminal);
      });

    await request(app.getHttpServer())
      .get(`/payment_terminals/invalido`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual(
          'Terminal de pagamento não existe.',
        );
      });
  });

  test('/payment_terminal/:id (PATCH)', async () => {
    let paymentTerminalId;
    await request(app.getHttpServer())
      .post('/payment_terminals')
      .send(createPaymentTerminalDto)
      .expect(201)
      .expect((response) => {
        paymentTerminalId = response.body.id;
      });

    createPaymentTerminalDto.status = Status.Ativo;

    await request(app.getHttpServer())
      .post('/payment_terminals')
      .send(createPaymentTerminalDto)
      .expect(201);

    const updatedPaymentTerminalDto = new UpdatePaymentTerminalDto();
    updatedPaymentTerminalDto.status = Status.Inativo;

    await request(app.getHttpServer())
      .patch(`/payment_terminals/${paymentTerminalId}`)
      .send(updatedPaymentTerminalDto)
      .expect(200)
      .expect((response) => {
        const { body } = response;
        expect(body.status).toEqual(updatedPaymentTerminalDto.status);
      });

    updatedPaymentTerminalDto.status = Status.Ativo;

    await request(app.getHttpServer())
      .patch(`/payment_terminals/invalido`)
      .send(updatedPaymentTerminalDto)
      .expect(400)
      .expect((response) => {
        const { body } = response;
        expect(body.message).toEqual('Terminal de pagamento não existe.');
      });
  });

  test('/payment_terminal (DELETE)', async () => {
    let paymentTerminalId;

    await request(app.getHttpServer())
      .post('/payment_terminals')
      .send(createPaymentTerminalDto)
      .expect(201)
      .expect((response) => {
        paymentTerminalId = response.body.id;
      });

    await request(app.getHttpServer())
      .delete(`/payment_terminals/${paymentTerminalId}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/payment_terminals/${paymentTerminalId}`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual(
          'Terminal de pagamento não existe.',
        );
      });
  });
});
