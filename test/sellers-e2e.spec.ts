import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import * as request from 'supertest';

import { AppModule } from "@src/app.module";
import { PrismaService } from "@src/prisma/prisma.service";
import { CreateSellerDto } from "@src/sellers/dto/create-seller.dto";
import { Seller } from "@src/sellers/entities/seller.entity";

describe('Sellers (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let prisma: PrismaService;

  beforeAll(async ()=> {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  const createSellerDto = new CreateSellerDto();
  const seller = new Seller();

  beforeEach(async () => {
    createSellerDto.cpf = '12345678901';
    createSellerDto.password = 'mo@#ck$%pass99word';

    seller.cpf = createSellerDto.cpf;
    seller.created_at = expect.any(String);
    seller.updated_at = expect.any(String);

    await prisma.seller.deleteMany();
  });

  
  test('/seller (POST)', async () => {
    await request(app.getHttpServer())
      .post('/sellers')
      .send(createSellerDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('cpf');
      });

    await request (app.getHttpServer())
      .post('/sellers')
      .send(createSellerDto)
      .expect(409)
      .expect((response) => {
        expect(response.body.message).toEqual('CPF já existe.');
      });
  });
} )