export const env = {
  dev: "development",
  prod: "production",
  debug: "debug",
  test: "test",
} as const;

const conf = {
  ep: {
    api: "/api",
  },
} as const;

export default {
  ...conf,
} as const;
