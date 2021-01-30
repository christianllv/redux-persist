import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
  {
    input: './src/index.js',
    output: [
      {
        name: 'index',
        file: `${pkg.browser}`,
        format: 'umd',
      },
    ],
    plugins: [
      resolve(),
      terser(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },
];
