import { readFileSync } from "fs";
import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { DEFAULT_EXTENSIONS } from "@babel/core";
import babel from "@rollup/plugin-babel"; // babel 编译
import typescriptEngine from "typescript"; // typescript 编译
import typescript from "@rollup/plugin-typescript"; // typescript 编译
import postcss from "rollup-plugin-postcss"; // css 处理
import terser from "@rollup/plugin-terser"; // 压缩
import url from "@rollup/plugin-url"; // 处理图片

const pkg = JSON.parse(readFileSync("./package.json"));

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
        extensions: [...DEFAULT_EXTENSIONS, ".ts", "tsx"],
        babelHelpers: "bundled",
        exclude: /node_modules/, // 防止打包node_modules下的文件
      }),
      typescript({
        tsconfig: "./tsconfig.json",
        typescript: typescriptEngine,
        sourceMap: false,
        exclude: ["es", "lib", "node_modules/**", "*.mjs"],
      }),
      url(),
      terser(),
    ],
    external: ["react", "react-dom"],
  },
  {},
);
