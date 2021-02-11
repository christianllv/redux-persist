import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
  {
    input: './src/index.js',
    output: [
      {
        name: 'index',
        file: `${pkg.main}`,
        format: 'umd',
      },
    ],
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },
];
