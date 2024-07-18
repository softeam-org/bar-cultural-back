import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';

import { AppModule } from '@src/app.module';
import { CreateCategoryDto } from '@src/categories/dto/create-category.dto';
import { Category } from '@src/categories/entities/category.entity';
import { CreateEventDto } from '@src/events/dto/create-event.dto';
import { Event } from '@src/events/entities/event.entity';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateProductEventDto } from '@src/products_events/dto/create-product_event.dto';
import { ProductEvent } from '@src/products_events/entities/product_event.entity';
import { CreateProductDto } from '@src/products/dto/create-product.dto';
import { Product } from '@src/products/entities/product.entity';

describe('ProductsEvents (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let prisma: PrismaService;

  const createCategoryDto = new CreateCategoryDto();
  const category = new Category();

  createCategoryDto.name = 'bebidas';

  const createProductDto = new CreateProductDto();
  const product = new Product();

  createProductDto.name = 'produto';
  createProductDto.description = 'descrição do produto';
  createProductDto.value = 7.2;
  createProductDto.amount_in_stock = 20;
  createProductDto.is_active = true;

  const createEventDto = new CreateEventDto();
  const event = new Event();

  createEventDto.name = 'evento';
  createEventDto.description = 'descrição do evento';
  createEventDto.ended_at = new Date(2024, 7, 10);
  createEventDto.attraction = 'atração do evento';
  createEventDto.observations = ['observação 1', 'observação 2'];

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();

    await request(app.getHttpServer())
      .post('/categories')
      .send(createCategoryDto)
      .expect(201)
      .expect((response) => {
        const body = response.body;
        category.id = body.id;
        category.name = body.name;
        category.is_active = body.is_active;
        category.created_at = body.created_at;
        category.updated_at = body.updated_at;
        createProductDto.categoryId = body.id;
      });

    await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201)
      .expect((response) => {
        const body = response.body;
        product.id = body.id;
        product.categoryId = body.categoryId;
        product.category = body.category;
        product.name = body.name;
        product.description = body.description;
        product.value = body.value;
        product.amount_in_stock = body.amount_in_stock;
        product.is_active = body.is_active;
        product.created_at = body.created_at;
        product.updated_at = body.updated_at;
      });

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
  });

  const createProductEventDto = new CreateProductEventDto();
  const productEvent = new ProductEvent();

  beforeEach(async () => {
    createProductEventDto.product_id = product.id;
    createProductEventDto.event_id = event.id;

    productEvent.product_id = createProductEventDto.product_id;
    productEvent.product = product;
    productEvent.event_id = createProductEventDto.event_id;
    productEvent.event = event;

    await prisma.productEvent.deleteMany();
  });

  test('/product-event (POST)', async () => {
    await request(app.getHttpServer())
      .post('/products-events')
      .send(createProductEventDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('product_id');
        expect(response.body).toHaveProperty('event_id');
      });

    await request(app.getHttpServer())
      .post('/products-events')
      .send(createProductEventDto)
      .expect(409)
      .expect((response) => {
        expect(response.body.message).toEqual('Produto ou evento já existem.');
      });
  });

  test('/product-event/:event_id (GET)', async () => {
    let eventId;
    await request(app.getHttpServer())
      .post('/products-events')
      .send(createProductEventDto)
      .expect(201)
      .expect((response) => {
        eventId = response.body.event_id;
      });

    await request(app.getHttpServer())
      .get(`/products-events/${eventId}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(productEvent);
      });

    await request(app.getHttpServer())
      .get(`/products-events/invalido`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Evento não existe.');
      });
  });

  test('/product-event (DELETE)', async () => {
    let productId;
    let eventId;

    await request(app.getHttpServer())
      .post('/products-events')
      .send(createProductEventDto)
      .expect(201)
      .expect((response) => {
        productId = response.body.product_id;
        eventId = response.body.event_id;
      });

    await request(app.getHttpServer())
      .delete(`/products-events/${productId}/${eventId}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/products-events/${productId}/${eventId}`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Produto e evento não existem.');
      });
  });
});
