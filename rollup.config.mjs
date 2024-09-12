import { readFileSync } from "fs";
import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import typescriptEngine from "typescript";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import url from "@rollup/plugin-url";

const pkg = JSON.parse(readFileSync("./package.json"));

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const isProduction = process.env.NODE_ENV === "production";
console.log("🚀 ~ isProduction:", isProduction);

export default defineConfig(
  {
    input: "./src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: false,
        exports: "named",
        name: pkg.name,
      },
      {
        file: pkg.module,
        format: "es",
        exports: "named",
        sourcemap: false,
      },
    ],
    plugins: [
      postcss({
        plugins: [],
        minimize: true,
      }),
      resolve(),
      commonjs(),
      babel({
        babelHelpers: "bundled",
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }),
      typescript({
        tsconfig: "./tsconfig.json",
        typescript: typescriptEngine,
        sourceMap: false,
        exclude: ["dist", "node_modules/**", "*.mjs"],
      }),
      url(),
      terser(),
    ],
    external: ["react", "react-dom"],
  },
  {}
);
