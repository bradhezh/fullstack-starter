import dotenv from "dotenv";

export * from "@shared/conf";
import common from "@shared/conf";

dotenv.config();

const conf = {
  ...common,
  env: process.env.NODE_ENV!,
  port: Number(process.env.PORT) || 3001,
} as const;

export default {
  ...conf,
} as const;
