import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
import banner from 'rollup-plugin-banner'

export default {
    input: 'src/index.js',
    plugins: [
        // terser(),
        banner('<%= pkg.name %>\n@version <%= pkg.version %>\n@author <%= pkg.author %> \n@github https://github.com/vannvan/adoerww/blob/master/vue-behavior-monitor/src/index.js \n@update <%= new Date()%>'),
        babel({
            exclude: 'node_modules/**'
        })
    ],
    output: {
        file: 'dist/index.js', // rollup支持的多种输出格式(有amd,cjs, es, iife 和 umd)
        format: 'amd',

    },
}
