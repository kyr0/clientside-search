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
  entryPoint: './src/language/fr.ts',
  outfile: './dist/fr.js',
  debug: process.argv.indexOf('--dev') > -1,
  esBuildOptions: {
    logLevel: 'error',
  },
})

await buildForNode({
  entryPoint: './src/language/es.ts',
  outfile: './dist/es.js',
  debug: process.argv.indexOf('--dev') > -1,
  esBuildOptions: {
    logLevel: 'error',
  },
})

// experimental, Japanese
await buildForNode({
  entryPoint: './src/language/ja.ts',
  outfile: './dist/ja.js',
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

await buildForNode({
  entryPoint: './src/phonetic/index.ts',
  outfile: './dist/phonetic.js',
  debug: process.argv.indexOf('--dev') > -1,
  esBuildOptions: {
    logLevel: 'error',
  },
})

await buildForNode({
  entryPoint: './src/stem/index.ts',
  outfile: './dist/stem.js',
  debug: process.argv.indexOf('--dev') > -1,
  esBuildOptions: {
    logLevel: 'error',
  },
})
