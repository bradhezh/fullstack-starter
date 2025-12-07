import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import nodeExternals from "webpack-node-externals";
import { RunScriptWebpackPlugin } from "run-script-webpack-plugin";
import { TsCheckerRspackPlugin } from "ts-checker-rspack-plugin";
import path from "path";

// default: "development" for `rspack dev`, "production" for `rspack build`
const dev = process.env.NODE_ENV === "development";

export default defineConfig({
  // "web" by default; es can be specified as well in an array, "es5" by default
  target: "node",
  // optimisation strategy
  mode: !dev ? "production" : "development",

  // entries for builds, can be an object for multiple builds
  entry: !dev
    ? "./src/main.ts"
    : // a build can have multiple entries, which will run sequentially; the 1st
      // one is for HMR for dev
      ["@rspack/core/hot/poll?100", "./src/main.ts"],
  // bundles for builds
  output: {
    // "dist" by default
    path: path.resolve(__dirname, "build"),
    clean: true,
  },

  resolve: {
    extensions: [".ts", "..."],
    // for path aliases
    tsConfig: path.resolve(__dirname, "tsconfig.json"),
  },

  // excluded from bundles, normally libs; here exclude all node_modules except
  // reflect-metadata and @rspack/core/hot/*; note that this is necessary for
  // frameworks like nest, which might have imports for optional libs not
  // actually used and installed, and then bundling them will fail, unless check
  // them via a callback
  externals: [
    nodeExternals({
      allowlist: ["reflect-metadata", /@rspack\/core\/hot\/.*/],
    }) as any,
  ],
  // how to transpile imports for externals, with the same options to
  // output.library.type for exports; e.g. as default, "var" means
  // exports/imports via a "var", which is for the web target using IIFE with
  // normal scripts rather than modules by default; for node, commonjs should
  // also be preferred for externals still in node_modules, while libs only
  // exporting as the ESM should be bundled instead
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
          // for nest, which needs class and function names for DI
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

  devServer: {
    devMiddleware: {
      // `rspack dev` keeps builds only in memory by default
      writeToDisk: true,
    },
  },

  plugins: [
    // run tsc on a separate process and collaborate with it for type checking
    new TsCheckerRspackPlugin(),
    // for dev, start the dev build (with HMR) after building
    dev &&
      new RunScriptWebpackPlugin({
        // with `writeToDisk` set
        name: "main.js",
        // using HMR instead
        autoRestart: false,
      }),
  ].filter(Boolean),
});
