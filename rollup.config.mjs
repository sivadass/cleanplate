import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
// import packageJson from "./package.json";

// const packageJson = require("./package.json");

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
    },
    {
      file: "dist/index.es.js",
      format: "es",
      exports: "named",
    },
  ],
  plugins: [
    external(),
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    commonjs(),
    postcss({
      modules: {
        generateScopedName: "[local]-[hash:base64:5]",
      },
      plugins: [],
      minimize: true,
      extract: true,
      use: {
        sass: {
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    }),
    babel({
      exclude: "node_modules/**",
      presets: ["@babel/preset-typescript", "@babel/preset-react"],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      babelHelpers: "bundled",
    }),
    terser(),
  ],
};
