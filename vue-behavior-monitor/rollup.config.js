import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
export default {
    input: 'src/index.js',
    plugins: [
        terser(),
        babel({
            exclude: 'node_modules/**'
        })
    ],
    output: {
        file: 'dist/index.js', // rollup支持的多种输出格式(有amd,cjs, es, iife 和 umd)
        format: 'amd',
    },
}
