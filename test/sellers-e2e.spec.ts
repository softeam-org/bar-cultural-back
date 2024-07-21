import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { cpf } from "cpf-cnpj-validator";
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
    createSellerDto.cpf = cpf.generate();
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

  test('/seller (GET)', async () => {
    const cpf1 = cpf.generate();
    const cpf2 = cpf.generate();
    const sellersCpf = [cpf1, cpf2];

    const create = sellersCpf.map((cpf) => {
      const dto: CreateSellerDto = {
        cpf: cpf,
        password: createSellerDto.password,
      };
      return request(app.getHttpServer())
      .post('/sellers')
      .send(dto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('cpf');
      });
    });

    await Promise.all(create)

    await request(app.getHttpServer())
    .get('/sellers')
    .expect(200)
    .expect((response) => {
      expect(response.body.map((seller: Seller) => seller.cpf )).toEqual(expect.arrayContaining([cpf1, cpf2]));
    });
  });

  test('/seller/:id (GET)', async () => {
    let sellerCpf: string | undefined;
    await request(app.getHttpServer())
    .post('/sellers')
    .send(createSellerDto)
    .expect(201)
    .expect((response) => {
      sellerCpf = response.body.cpf;
    });

    await request(app.getHttpServer())
    .get(`/sellers/${sellerCpf}`)
    .expect(200)
    .expect((response) => {
      expect(response.body.cpf).toEqual(sellerCpf)
    });

    await request(app.getHttpServer())
    .get(`/sellers/invalido`)
    .expect(400)
    .expect((response) => {
      expect(response.body.message).toEqual('Vendedor não existe.')
    });
  });

  test('/seller/:id (PATCH)', async () => {
    await request(app.getHttpServer())
    .post('/sellers')
    .send(createSellerDto)
    .expect(201)
    .expect((response) => {
      expect(response.body).toHaveProperty('cpf')
    });
    
    createSellerDto.password = 'no@#va#$pass&*word';

    await request(app.getHttpServer())
      .patch(`/sellers/${createSellerDto.cpf}`)
      .send(createSellerDto)
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/sellers/invalido`)
      .send(createSellerDto)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Vendedor não existe.')
      })
  });

  test('/sellers (DELETE)', async () => {
    let sellerCpf;
    await request(app.getHttpServer())
      .post('/sellers')
      .send(createSellerDto)
      .expect(201)
      .expect((response) => {
        sellerCpf = response.body.cpf;
      });

    await request(app.getHttpServer())
      .delete(`/sellers/${sellerCpf}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/sellers/${sellerCpf}`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Vendedor não existe.')
      });
      
  });
});