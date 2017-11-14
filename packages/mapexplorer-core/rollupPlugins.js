const babel = require('rollup-plugin-babel');
const babelrc = require('babelrc-rollup').default;
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');

const plugins = [
  json(),
  babel(
    Object.assign(
      {
        exclude: [
          'node_modules/**',
          '../**/node_modules/**',
          '../agent-client-js/**',
          '../cs-validator/**'
        ]
      },
      babelrc()
    )
  ),
  builtins(),
  nodeResolve({
    browser: true,
    module: false
  }),
  commonjs({
    namedExports: {
      '../agent-client-js/node_modules/qs/lib/index.js': ['stringify'],
      'node_modules/qs/lib/index.js': ['stringify'],
      'node_modules/d3-hierarchy/build/d3-hierarchy.js': [
        'tree',
        'hierarchy',
        'stratify'
      ],
      'node_modules/d3-selection/build/d3-selection.js': [
        'select',
        'event',
        'selectAll'
      ],
      'node_modules/d3-zoom/build/d3-zoom.js': ['zoom'],
      'node_modules/d3-transition/build/d3-transition.js': ['transition'],
      'node_modules/d3-ease/build/d3-ease.js': ['easeLinear']
    }
  }),
  globals()
];

module.exports = plugins;
