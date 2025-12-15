import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import supertest from "supertest";
import TestAgent from "supertest/lib/agent";

import { HelloModule } from "./module";

describe("HelloModule", () => {
  let app: INestApplication;
  let api: TestAgent;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HelloModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    api = supertest(app.getHttpServer());
  });

  it("hello", () => {
    return api.get("/api").expect(200).expect("Hello NestJS!");
  });

  it("DB_URL", () => {
    expect(process.env.DB_URL).toBe("DB_URL_set!");
  });

  afterAll(async () => {
    await app.close();
  });
});
