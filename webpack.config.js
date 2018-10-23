const path = require('path');
/*
FIXME: read about how dev/prod is actually supposed to be implemented:
  - https://webpack.js.org/plugins/mini-css-extract-plugin/
  - https://github.com/webpack-contrib/style-loader
  - https://github.com/peerigon/extract-loader#examples
  - https://webpack.js.org/concepts/hot-module-replacement/
*/

module.exports = (env, argv) => {
  const config = {};
  config.entry = [
    './src/app.js',
    './src/index.html'
  ];
  config.output = {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public')
  };
  config.module = {
    rules: []
  };

  const jsRules = {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  };
  const htmlRules = {
    test: /\.html$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      'extract-loader',
      {
        loader: 'html-loader',
        options: {
          attrs: ['link:href'],
          minimize: argv.mode === 'production',
          removeComments: argv.mode === 'production',
          collapseWhitespace:  argv.mode === 'production'
        }
      }
    ]
  };
  const cssRules = {
    test: /\.css$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name (file) {
            //if (argv.mode === 'production') {
            //  return '[hash].[ext]';
            //}
            return '[name].[ext]?[hash]';
          }
        }
      },
      'extract-loader',
      {
        loader: 'css-loader',
        options: {
          // https://github.com/webpack-contrib/css-loader#options
          sourceMap: false
        }
      }
    ]
  };

  config.module.rules.push(jsRules);
  config.module.rules.push(htmlRules);
  config.module.rules.push(cssRules);

  return config;
};
