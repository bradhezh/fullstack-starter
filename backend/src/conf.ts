import dotenv from "dotenv";

export const env = {
  prod: "production",
  dev: "development",
  debug: "debug",
  test: "test",
} as const;

// dotenv sets env vars from .env (in the cwd, only used locally)
dotenv.config();

const conf = {
  /** Should be set in the CLI. */
  env: process.env.NODE_ENV!,

  /** Flexible or sensitive configuration included in .env: normally will be
    automatically set by cloud platforms, so unnecessary to be set in both the
    cloud and CICD pipelines. */
  port: Number(process.env.PORT) || 3000,

  version: {
    no: 0,
    ep: "/version",
  },
} as const;

/** Flexible or sensitive configurations are typically from corresponding
  environment variables, which are set by dotenv locally, or on cloud platforms
  in deployment. For CICD testing, corresponding environment variables should be
  set in CICD pipelines only if the configuration is flexible or sensitive for
  testing. Otherwise, they can be from default. Configurations only for testing
  don't need to be defined in the cloud for production deployment. Note that
  `DATABASE_URL`, `DB_URL_LOG`, and `DB_URL_LOG_DIRECT` are included in .env but
  not used in the application code. They are used by the Prisma CLI and client,
  and then should still be set in the cloud for production and CICD (only) for
  testing. */
export default {
  ...conf,
} as const;
