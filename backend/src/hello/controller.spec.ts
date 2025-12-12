import { Test } from "@nestjs/testing";

import { HelloCtlr } from "./controller";
import { HelloSvc } from "./service";

describe("HelloCtlr", () => {
  let helloCtlr: HelloCtlr;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HelloCtlr],
      providers: [HelloSvc],
    }).compile();
    helloCtlr = moduleRef.get(HelloCtlr);
  });

  describe("hello", () => {
    it("should return hello", () => {
      expect(helloCtlr.hello()).toBe("Hello NestJS!");
    });
  });
});
