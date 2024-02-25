import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';

import { AppModule } from '@src/app.module';
import { CreateCategoryDto } from '@src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@src/categories/dto/update-category.dto';
import { Category } from '@src/categories/entities/category.entity';
import { PrismaService } from '@src/prisma/prisma.service';

describe('Categories (e2e)', () => {
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

  const category = new Category();
  const createCategoryDto = new CreateCategoryDto();

  beforeEach(async () => {
    createCategoryDto.name = 'categoria';
    createCategoryDto.description = 'descrição da categoria';

    category.id = expect.any(String);
    category.name = createCategoryDto.name;
    category.description = createCategoryDto.description;
    category.created_at = expect.any(String);
    category.updated_at = expect.any(String);

    await prisma.category.deleteMany();
  });

  test('/category (POST)', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .send(createCategoryDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });

    await request(app.getHttpServer())
      .post('/categories')
      .send(createCategoryDto)
      .expect(409)
      .expect((response) => {
        const { body } = response;
        expect(body.message).toEqual('Nome da categoria já existe.');
      });
  });

  test('/category (GET)', async () => {
    const categoriesNames = ['categoria1', 'categoria2', 'categoria3'];
    const create = categoriesNames.map((name) => {
      const dto: CreateCategoryDto = { ...createCategoryDto, name: name };
      return request(app.getHttpServer())
        .post('/categories')
        .send(dto)
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveProperty('id');
        });
    });

    await Promise.all(create);

    await request(app.getHttpServer())
      .get('/categories')
      .query({ order: 'asc' })
      .expect(200)
      .expect((response) => {
        expect(response.body[0].name).toEqual('categoria1');
        expect(response.body[1].name).toEqual('categoria2');
        expect(response.body[2].name).toEqual('categoria3');
      });

    await request(app.getHttpServer())
      .get('/categories')
      .query({ order: 'desc' })
      .expect(200)
      .expect((response) => {
        expect(response.body[0].name).toEqual('categoria3');
        expect(response.body[1].name).toEqual('categoria2');
        expect(response.body[2].name).toEqual('categoria1');
      });

    await request(app.getHttpServer())
      .get('/categories')
      .query({ order: 'as' })
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual(
          "Ordem só pode ser 'asc' ou 'desc'",
        );
      });
  });

  test('/category/:id (GET)', async () => {
    let categoryId;
    await request(app.getHttpServer())
      .post('/categories')
      .send(createCategoryDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
        categoryId = response.body.id;
      });

    await request(app.getHttpServer())
      .get(`/categories/${categoryId}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(category);
      });

    await request(app.getHttpServer())
      .get(`/categories/invalido`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Categoria não existe.');
      });
  });

  test('/category/:id (PATCH)', async () => {
    let categoryId;
    await request(app.getHttpServer())
      .post('/categories')
      .send(createCategoryDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
        categoryId = response.body.id;
      });

    createCategoryDto.name = 'categoria 2';
    await request(app.getHttpServer())
      .post('/categories')
      .send(createCategoryDto)
      .expect(201);

    const updateCategoryDto = new UpdateCategoryDto();
    updateCategoryDto.name = 'nova categoria';
    updateCategoryDto.description = 'nova descrição';

    await request(app.getHttpServer())
      .patch(`/categories/${categoryId}`)
      .send(updateCategoryDto)
      .expect(200)
      .expect((response) => {
        const { body } = response;
        expect(body.name).toEqual(updateCategoryDto.name);
        expect(body.description).toEqual(updateCategoryDto.description);
      });

    updateCategoryDto.name = 'categoria 2';
    await request(app.getHttpServer())
      .patch(`/categories/${categoryId}`)
      .send(updateCategoryDto)
      .expect(409)
      .expect((response) => {
        const { body } = response;
        expect(body.message).toEqual('Nome da categoria já existe.');
      });

    await request(app.getHttpServer())
      .patch('/categories/invalido')
      .send(updateCategoryDto)
      .expect(400)
      .expect((response) => {
        const { body } = response;
        expect(body.message).toEqual('Categoria não existe.');
      });
  });

  test('/category/:id (DELETE)', async () => {
    let categoryId;

    await request(app.getHttpServer())
      .post('/categories')
      .send(createCategoryDto)
      .expect(201)
      .expect((response) => {
        const { body } = response;
        categoryId = body.id;
      });

    await request(app.getHttpServer())
      .delete(`/categories/${categoryId}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/categories/${categoryId}`)
      .expect(400)
      .expect((response) => {
        const { body } = response;
        expect(body.message).toEqual('Categoria não existe.');
      });
  });
});
