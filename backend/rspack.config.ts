import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import nodeExternals from "webpack-node-externals";
import { TsCheckerRspackPlugin } from "ts-checker-rspack-plugin";
import { RunScriptWebpackPlugin } from "run-script-webpack-plugin";
import path from "path";

const dev = process.env.NODE_ENV === "development";

export default defineConfig({
  target: ["node22.21", "es2023"],
  mode: !dev ? "production" : "development",

  entry: !dev
    ? "./src/main.ts"
    : ["@rspack/core/hot/poll?100", "./src/main.ts"],
  output: {
    path: path.resolve(__dirname, "build"),
    clean: true,
  },

  resolve: {
    extensions: [".ts", "..."],
    tsConfig: path.resolve(__dirname, "tsconfig.json"),
  },

  externals: [
    nodeExternals({
      allowlist: ["reflect-metadata", /@rspack\/core\/hot\/.*/],
    }) as any,
  ],
  externalsType: "commonjs",

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                decorators: true,
              },
              transform: {
                legacyDecorator: true,
                decoratorMetadata: true,
              },
            },
          },
        },
      },
    ],
  },

  optimization: {
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin({
        minimizerOptions: {
          compress: {
            keep_classnames: true,
            keep_fnames: true,
          },
          mangle: {
            keep_classnames: true,
            keep_fnames: true,
          },
        },
      }),
    ],
  },

  devServer: { devMiddleware: { writeToDisk: true } },

  plugins: [
    new TsCheckerRspackPlugin(),
    dev &&
      new RunScriptWebpackPlugin({
        name: "main.js",
        autoRestart: false,
      }),
  ].filter(Boolean),
});
