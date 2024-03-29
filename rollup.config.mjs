import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { default as pkg } from './package.json' assert { type: 'json' };

// take name from package "main" defined file
const name = pkg.main.replace(/\.js$/, '');

// generics
const bundle = (config) => ({
  ...config,
  input: 'src/index.ts',
  external: (id) => {
    if (id === 'blakejs/blake2b' || id === 'blindsecp256k1') {
      return false;
    }
    if (process.platform === 'win32') {
      return !id.includes('src');
    }
    return !id.startsWith('src') && !/^[./]/.test(id);
  },
});

export default [
  bundle({
    plugins: [
      // convert esm to commonjs modules (for cjs support)
      commonjs(),
      // resolve node modules
      resolve({
        browser: true,
      }),
      // final transformation
      esbuild(),
    ],
    output: [
      // commonjs
      {
        file: `${name}.js`,
        format: 'cjs',
        sourcemap: true,
      },
      // es modules
      {
        file: `${name}.mjs`,
        format: 'es',
        sourcemap: true,
      },
      // umd
      {
        name: 'VocdoniAdminSDK',
        file: `${name}.umd.js`,
        format: 'umd',
        sourcemap: true,
      },
    ],
  }),
  // typings
  bundle({
    plugins: [dts()],
    output: {
      file: `${name}.d.ts`,
      format: 'es',
    },
  }),
];
