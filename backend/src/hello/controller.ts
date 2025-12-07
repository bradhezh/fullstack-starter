import { Controller, Get } from "@nestjs/common";

import { HelloSvc } from "./service";

@Controller("/")
export class HelloCtlr {
  constructor(private helloSvc: HelloSvc) {}

  @Get()
  hello() {
    return this.helloSvc.hello();
  }
}
