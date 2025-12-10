declare const module: any;

import { NestFactory } from "@nestjs/core";

import conf from "@/conf";
import { AppModule } from "@/app.module";

async function bootstrap() {
  console.log(conf.env);

  const app = await NestFactory.create(AppModule);
  await app.listen(conf.port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
void bootstrap();
