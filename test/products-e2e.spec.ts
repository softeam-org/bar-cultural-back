import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';

import { AppModule } from '@src/app.module';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateProductDto } from '@src/products/dto/create-product.dto';
import { UpdateProductDto } from '@src/products/dto/update-product.dto';
import { Product } from '@src/products/entities/product.entity';

describe('Products (e2e)', () => {
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

  const createProductDto = new CreateProductDto();
  const product = new Product();

  beforeEach(async () => {
    createProductDto.name = 'produto';
    createProductDto.description = 'descrição do produto';
    createProductDto.value = 5.5;

    product.id = expect.any(String);
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.value = createProductDto.value;
    product.created_at = expect.any(String);
    product.updated_at = expect.any(String);

    await prisma.product.deleteMany();
  });

  test('/product (POST)', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });

    await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(409)
      .expect((response) => {
        expect(response.body.message).toEqual('Produto já existe.');
      });
  });

  test('/product (GET)', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });

    await request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((response) => {
        expect(response.body[0]).toEqual(product);
      });
  });

  test('/product/:id (GET)', async () => {
    let productId;
    await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201)
      .expect((response) => {
        productId = response.body.id;
      });

    await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(product);
      });

    await request(app.getHttpServer())
      .get(`/products/invalido`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Produto não existe.');
      });
  });

  test('/product/:id (PATCH)', async () => {
    let productId;
    await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201)
      .expect((response) => {
        productId = response.body.id;
      });

    createProductDto.name = 'produto 2';

    await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201);

    const updatedProduct = new UpdateProductDto();
    updatedProduct.name = 'novo produto';
    updatedProduct.description = 'nova descrição';
    updatedProduct.value = 17.2;

    await request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .send(updatedProduct)
      .expect(200)
      .expect((response) => {
        const { body } = response;
        expect(body.name).toEqual(updatedProduct.name);
        expect(body.description).toEqual(updatedProduct.description);
        expect(body.value).toEqual(updatedProduct.value);
      });

    updatedProduct.name = 'produto 2';

    await request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .send(updatedProduct)
      .expect(409)
      .expect((response) => {
        const { body } = response;
        expect(body.message).toEqual('Produto já existe.');
      });

    await request(app.getHttpServer())
      .patch(`/products/invalido`)
      .send(updatedProduct)
      .expect(400)
      .expect((response) => {
        const { body } = response;
        expect(body.message).toEqual('Produto não existe.');
      });
  });

  test('/product (DELETE)', async () => {
    let productId;

    await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201)
      .expect((response) => {
        productId = response.body.id;
      });

    await request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Produto não existe.');
      });
  });
});
