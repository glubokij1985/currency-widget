const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    port: 4202,
    static: path.resolve(__dirname, 'dist'),
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    publicPath: 'http://localhost:4202/',
    clean: true,
    uniqueName: 'currencyWidget',
    library: { type: 'var', name: 'currencyWidget' },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.scss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
        name: 'currencyWidget',
      filename: 'remoteEntry.js',
      exposes: {
        './CurrencyWidget': './src/components/CurrencyWidget.tsx',
      },
    shared: {
        react: {
            singleton: true,
            eager: true,
            requiredVersion: '^19.0.0',
        },
        'react-dom': {
            singleton: true,
            eager: true,
            requiredVersion: '^19.0.0',
        },
        },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
