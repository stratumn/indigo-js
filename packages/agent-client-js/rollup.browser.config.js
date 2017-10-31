import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

import config from './rollup.base.config';

config.plugins.push(
  nodeResolve({
    browser: true
  }),
  commonjs({
    namedExports: {
      'node_modules/qs/lib/index.js': ['stringify']
    }
  })
);

config.output = {
  format: 'umd',
  file: 'dist/stratumn-agent-client.js'
};

export default config;
