import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { cpf } from 'cpf-cnpj-validator';
import * as request from 'supertest';

import { AppModule } from '@src/app.module';
import { CreateEventDto } from '@src/events/dto/create-event.dto';
import { Event } from '@src/events/entities/event.entity';
import { CreatePaymentMethodDto } from '@src/payment_methods/dto/create-payment_method.dto';
import { PaymentMethod } from '@src/payment_methods/entities/payment_method.entity';
import { CreatePaymentTerminalDto } from '@src/payment_terminals/dto/create-payment-terminal.dto';
import { PaymentTerminal } from '@src/payment_terminals/entities/payment-terminal.entity';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateSaleDto } from '@src/sales/dto/create-sale.dto';
import { Sale } from '@src/sales/entities/sale.entity';
import { CreateSellerDto } from '@src/sellers/dto/create-seller.dto';
import { Seller } from '@src/sellers/entities/seller.entity';

enum Status {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
}

describe.only('PaymentMethods (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let prisma: PrismaService;

  const createSellerDto = new CreateSellerDto();
  const seller = new Seller();

  createSellerDto.cpf = cpf.generate();
  createSellerDto.password = 'mo@#ck$%pass99word';

  const createPaymentTerminalDto = new CreatePaymentTerminalDto();
  const paymentTerminal = new PaymentTerminal();

  createPaymentTerminalDto.status = Status.Inativo;

  const createEventDto = new CreateEventDto();
  const event = new Event();

  createEventDto.name = 'evento';
  createEventDto.ended_at = new Date(2024, 7, 10);
  createEventDto.attraction = 'atração do evento';
  createEventDto.observations = 'observação';

  const createSaleDto = new CreateSaleDto();
  const sale = new Sale();

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();

    await request(app.getHttpServer())
      .post('/sellers')
      .send(createSellerDto)
      .expect(201)
      .expect((response) => {
        const body = response.body;
        seller.cpf = body.cpf;
        seller.created_at = body.created_at;
        seller.updated_at = body.updated_at;
      })

    await request(app.getHttpServer())
      .post('/events')
      .send(createEventDto)
      .expect(201)
      .expect((response) => {
        const body = response.body;
        event.id = body.id;
        event.name = body.name;
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

    createSaleDto.seller_id = seller.cpf;
    createSaleDto.event_id = event.id;
    createSaleDto.payment_terminal_id = paymentTerminal.id;
    createSaleDto.total_value = 26.3;

    await request(app.getHttpServer())
      .post('/sales')
      .send(createSaleDto)
      .expect(201)
      .expect((response) => {
        const body = response.body;
        sale.id = body.id;
        sale.seller_id = body.seller_id;
        sale.seller = body.seller;
        sale.event_id = body.event_id;
        sale.event = body.event;
        sale.payment_terminal_id = body.payment_terminal_id;
        sale.total_value = body.total_value;
      });
  });

  const createPaymentMethodDto = new CreatePaymentMethodDto();
  const paymentMethod = new PaymentMethod();

  beforeEach(async () => {
    createPaymentMethodDto.method = 'Dinheiro';
    createPaymentMethodDto.value = 35.8;
    createPaymentMethodDto.sale_id = sale.id;

    paymentMethod.id = expect.any(String)
    paymentMethod.method = createPaymentMethodDto.method;
    paymentMethod.value = createPaymentMethodDto.value;
    paymentMethod.sale_id = createPaymentMethodDto.sale_id;

    await prisma.paymentMethod.deleteMany();
  });

  test('/payment-method (POST)', async () => {
    await request(app.getHttpServer())
      .post('/payment-methods')
      .send(createPaymentMethodDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('sale_id');
      });

    createPaymentMethodDto.sale_id = "invalid"

    await request(app.getHttpServer())
      .post('/payment-methods')
      .send(createPaymentMethodDto)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Venda não existe.');
      });
  });

  test('/payment-method/:sale_id (GET)', async () => {
    let id;
    await request(app.getHttpServer())
      .post('/payment-methods')
      .send(createPaymentMethodDto)
      .expect(201)
      .expect((response) => {
        id = response.body.id;
      });

    await request(app.getHttpServer())
      .get(`/payment-methods/${id}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(paymentMethod);
      });

    await request(app.getHttpServer())
      .get(`/payment-methods/invalido`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual(
          'Método de pagamento não existe.',
        );
      });
  });

  test('/payment-method (DELETE)', async () => {
    let id;

    await request(app.getHttpServer())
      .post('/payment-methods')
      .send(createPaymentMethodDto)
      .expect(201)
      .expect((response) => {
        id = response.body.id;
      });

    await request(app.getHttpServer())
      .delete(`/payment-methods/${id}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/payment-methods/${id}`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual(
          'Método de pagamento não existe.',
        );
      });
  });
});
