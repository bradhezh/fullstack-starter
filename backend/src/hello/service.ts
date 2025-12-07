import { Injectable } from "@nestjs/common";

@Injectable()
export class HelloSvc {
  hello() {
    return "Hello NestJS!";
  }
}
