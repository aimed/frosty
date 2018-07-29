// const path = require('path');
const rewireSass = require('react-app-rewire-scss');
const rewireReactHotLoader = require('react-app-rewire-hot-loader')

module.exports = function override(config, env) {
  config = rewireSass.withLoaderOptions({
    includePaths: [
      'src',
      'node_modules'
    ]
  })(config, env);
  config = rewireReactHotLoader(config, env);
  return config;
}