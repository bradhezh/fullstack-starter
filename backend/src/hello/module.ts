import { Module } from "@nestjs/common";

import { HelloSvc } from "./service";
import { HelloCtlr } from "./controller";

@Module({
  providers: [HelloSvc],
  controllers: [HelloCtlr],
})
export class HelloModule {}
