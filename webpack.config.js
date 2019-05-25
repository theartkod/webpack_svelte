const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
// const PreloadWebpackPlugin = require('preload-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const mode = process.env.NODE_ENV || 'development'
const prod = mode === 'production'
const pkg = require('./package.json')

module.exports = env => {
  return {
    stats: 'minimal',
    mode: 'development',
    entry: {
      app: './src/main.js',
    },
    resolve: {
      extensions: ['.mjs', '.js', '.svelte', '.json'],
      alias: {
        '@': path.resolve(__dirname),
      },
    },
    devServer: {
      historyApiFallback: true,
      contentBase: path.join(__dirname, 'build'),
      compress: true,
      port: 9000,
      open: true,
      overlay: {
        warnings: true,
        errors: true,
      },
    },
    output: {
      path: __dirname + '/build',
      filename: '[name].[hash].js',
      chunkFilename: '[name].[hash].js',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            enforce: true,
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.svelte$/,
          exclude: /node_modules/,
          use: {
            loader: 'svelte-loader',
            options: {
              emitCss: true,
              hotReload: true,
            },
          },
        },
        {
          test: /('.mjs|.js)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader?cacheDirectory=true',
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.pcss$/,
          use: ['postcss-loader'],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: ['file-loader'],
        },
        {
          test: /\.(gif|png|jpe?g|svg|woff|ttf)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 4000,
                name: '[path][name].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
      }),
      new CopyPlugin([
        { from: './src/static', to: './' },
        { from: './src/assets/images', to: './images' },
        { from: './src/assets/fonts', to: './fonts' },
      ]),
      new HtmlWebpackPlugin({
        title: pkg.name,
        template: './index.html',
      }),
      // new PreloadWebpackPlugin(),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: !!(env && env.analyze),
      }),
    ],
    devtool: prod ? false : 'source-map',
  }
}
