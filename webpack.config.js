const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');

/*
FIXME: read about how dev/prod is actually supposed to be implemented:
  - https://webpack.js.org/plugins/mini-css-extract-plugin/
  - https://github.com/webpack-contrib/style-loader
  - https://github.com/peerigon/extract-loader#examples
  - https://webpack.js.org/concepts/hot-module-replacement/
*/

module.exports = (env, argv) => {
  const config = {};
  config.entry = {
    app: [
      './src/index.html',
      './src/app.js',
    ],
    chat: [
      './src/chat.html',
      './src/chat.js',
    ],
  },
  config.output = {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public')
  };
  config.module = {
    rules: []
  };

  config.externals = {
    'jquery': 'jQuery',
    'socket.io-client': 'io',
    'moment': 'moment',
    'mustache': 'Mustache',
  };

  config.plugins = [
    // https://www.npmjs.com/package/webpack-bundle-analyzer
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: __dirname + '/report.html',
      openAnalyzer: false,
    }),
    /*
    new webpack.ContextReplacementPlugin(
      /moment[/\\]locale$/,
      /\/et|ru/
    )
    */
  ];

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
