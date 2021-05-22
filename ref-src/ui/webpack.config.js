const webpack = require('webpack'),
      path = require('path');

module.exports = (env, argv) => [{
  name: 'ide-project',
  mode: argv.mode || 'development',
  entry: './src/index.ts',
  devtool: argv.mode !== 'production' ? "source-map" : undefined,
  stats: {
    hash: false, version: false, modules: false  // reduce verbosity
  },
  performance: {
    maxAssetSize: 1e6, maxEntrypointSize: 1e6   // 250k is too small
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'static'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/i,  /* Vue.js has some */
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'ide-project-images',
        }
      }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  }
}];
