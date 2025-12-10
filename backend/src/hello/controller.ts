import { Controller, Get } from "@nestjs/common";

import conf from "@/conf";
import { HelloSvc } from "./service";

@Controller(conf.ep.api)
export class HelloCtlr {
  constructor(private helloSvc: HelloSvc) {}

  @Get()
  hello() {
    return this.helloSvc.hello();
  }
}
