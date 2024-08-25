import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';

import { AppModule } from '@src/app.module';
import { CreateEventDto } from '@src/events/dto/create-event.dto';
import { Event } from '@src/events/entities/event.entity';
import { CreatePaymentMethodDto } from '@src/payment_methods/dto/create-payment_method.dto';
import { CreatePaymentTerminalDto } from '@src/payment_terminals/dto/create-payment-terminal.dto';
import { PaymentTerminal } from '@src/payment_terminals/entities/payment-terminal.entity';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateSaleDto } from '@src/sales/dto/create-sale.dto';
import { Sale } from '@src/sales/entities/sale.entity';

enum Status {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
}

describe('Sales (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let prisma: PrismaService;

  const createEventDto = new CreateEventDto();
  const event = new Event();

  createEventDto.name = 'evento';
  createEventDto.description = 'descrição do evento';
  createEventDto.ended_at = new Date(2024, 7, 10);
  createEventDto.attraction = 'atração do evento';
  createEventDto.observations = ['observação 1', 'observação 2'];

  const createPaymentTerminalDto = new CreatePaymentTerminalDto();
  const paymentTerminal = new PaymentTerminal();

  createPaymentTerminalDto.status = Status.Inativo;

  const createPaymentMethodDto = new CreatePaymentMethodDto();

  createPaymentMethodDto.method = 'Dinheiro';
  createPaymentMethodDto.value = 35.8;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();

    await request(app.getHttpServer())
      .post('/events')
      .send(createEventDto)
      .expect(201)
      .expect((response) => {
        const body = response.body;
        event.id = body.id;
        event.name = body.name;
        event.description = body.description;
        event.ended_at = body.ended_at;
        event.attraction = body.attraction;
        event.observations = body.observations;
        event.created_at = body.created_at;
        event.updated_at = body.updated_at;
      });

    await request(app.getHttpServer())
      .post('/payment_terminals')
      .send(createPaymentTerminalDto)
      .expect(201)
      .expect((response) => {
        const body = response.body;
        paymentTerminal.id = body.id;
        paymentTerminal.status = body.status;
      });

  });

  const createSaleDto = new CreateSaleDto();
  const sale = new Sale();

  beforeEach(async () => {
    createSaleDto.event_id = event.id;
    createSaleDto.payment_terminal_id = paymentTerminal.id;
    createSaleDto.total_value = 26.3;

    sale.id = expect.any(String);
    sale.event_id = createSaleDto.event_id;
    sale.event = event;
    sale.payment_terminal_id = createSaleDto.payment_terminal_id;
    sale.payment_terminal = paymentTerminal;
    sale.payment_methods = [];
    sale.total_value = createSaleDto.total_value;

    await prisma.sale.deleteMany();
  });

  test('/sale (POST)', async () => {
    await request(app.getHttpServer())
      .post('/sales')
      .send(createSaleDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });

    createSaleDto.event_id = "invalid";

    await request(app.getHttpServer())
      .post('/sales')
      .send(createSaleDto)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Evento não existe.');
      });
  });

  test('/sale (GET)', async () => {
    return request(app.getHttpServer())
      .post('/sales')
      .send(createSaleDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });
  });

  test('/sale/:id (GET)', async () => {
    let saleId;

    await request(app.getHttpServer())
      .post('/sales')
      .send(createSaleDto)
      .expect(201)
      .expect((response) => {
        saleId = response.body.id;
      });



    await request(app.getHttpServer())
      .get(`/sales/${saleId}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual<Sale>(sale);
      });

    await request(app.getHttpServer())
      .get(`/sales/invalido`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Venda não existe.');
      });
  });

  test('/sale/:event_id/:method (GET)', async () => {

    const { body: sale } = await request(app.getHttpServer())
      .post('/sales')
      .send(createSaleDto)
      .expect(201);

    createPaymentMethodDto.sale_id = sale.id
    const { body: payment1 } = await request(app.getHttpServer())
      .post('/payment-methods')
      .send(createPaymentMethodDto)
      .expect(201)

    const { body: payment2 } = await request(app.getHttpServer())
      .post('/payment-methods')
      .send(createPaymentMethodDto)
      .expect(201)

    await request(app.getHttpServer())
      .get(`/sales/${event.id}/${payment1.method}`)
      .expect(200)
      .expect((response) => {
        expect(Number(response.text)).toEqual(Number(payment1.value) + Number(payment2.value))
      });

    await request(app.getHttpServer())
      .get(`/sales/invalido`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Venda não existe.');
      });
  });

  test('/sale (DELETE)', async () => {
    let saleId;

    await request(app.getHttpServer())
      .post('/sales')
      .send(createSaleDto)
      .expect(201)
      .expect((response) => {
        saleId = response.body.id;
      });

    await request(app.getHttpServer()).delete(`/sales/${saleId}`).expect(200);

    await request(app.getHttpServer())
      .delete(`/sales/${saleId}`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Venda não existe.');
      });
  });
});
