import { buildForNode } from '@jsheaven/easybuild'

await buildForNode({
  entryPoint: './src/index.ts',
  outfile: './dist/index.js',
  debug: process.argv.indexOf('--dev') > -1,
  esBuildOptions: {
    logLevel: 'error',
  },
})

await buildForNode({
  entryPoint: './src/language/de.ts',
  outfile: './dist/de.js',
  debug: process.argv.indexOf('--dev') > -1,
  esBuildOptions: {
    logLevel: 'error',
  },
})

await buildForNode({
  entryPoint: './src/language/en.ts',
  outfile: './dist/en.js',
  debug: process.argv.indexOf('--dev') > -1,
  esBuildOptions: {
    logLevel: 'error',
  },
})

await buildForNode({
  entryPoint: './src/language/detect.ts',
  outfile: './dist/language-detect.js',
  debug: process.argv.indexOf('--dev') > -1,
  esBuildOptions: {
    logLevel: 'error',
  },
})
