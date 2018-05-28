/**
 * webpack 4 configuration file
 */
import webpack from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ArchivePlugin from 'webpack-archive-plugin'
import _debug from 'debug'
import autoprefixer from 'autoprefixer'

const debug = _debug('app:webpack:config')
debug('Create configuration.')
const webpackConfig = {
  target: 'web',
  mode: process.env.NODE_ENV,
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'app')
    ],
    extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
    alias: {
      'react': 'react',
      'globalStyle': path.resolve(__dirname, 'app', 'globalStyle')
    }
  },
  module: {
    rules: []
  },
  node: {
    process: false,
    Buffer: false,
    __dirname: false
  },
  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  }
}
if (process.env.NODE_ENV === 'development') {
  webpackConfig.devServer = {
    hot: true,
    historyApiFallback: true,
    publicPath: '/'
  }
}
// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY_PATH = path.resolve(__dirname, 'app', 'main.js')
webpackConfig.entry = {
  app: process.env.NODE_ENV === 'development'
    ? [
      'babel-polyfill',
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      APP_ENTRY_PATH
    ]
    : [APP_ENTRY_PATH],
  vendor: ['react', 'react-dom', 'react-redux', 'react-router', 'redux', 'redux-thunk', 'jerrycan']
}
// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename: `[name].[hash].js`,
  path: path.resolve(__dirname, 'dist'),
  publicPath: '/'
}
// ------------------------------------
// Optimization
// ------------------------------------
webpackConfig.optimization = {
  splitChunks: {
    chunks: 'async',
    maxAsyncRequests: 5,
    name: true,
    minChunks: Infinity,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        chunks: 'initial',
        name: 'vendor',
        enforce: true
      }
    }
  },
  runtimeChunk: true
}
// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      DIR: JSON.stringify(path.resolve(__dirname))
    }
  }),
  new HtmlWebpackPlugin({
    title: 'jerrycan basic template',
    template: path.resolve(__dirname, 'app', 'index.ejs'),
    hash: false,
    inject: 'body',
    minify: {
      collapseWhitespace: true
    }
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [
        autoprefixer({
          add: true,
          remove: true,
          browsers: ['last 3 version', 'ie >= 10']
        })
      ],
      context: path.resolve(__dirname, 'app')
    }
  })
]

if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css'
    }),
    new ArchivePlugin()
  )
} else {
  webpackConfig.plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
}
// ------------------------------------
// Common rules
// ------------------------------------
webpackConfig.module.rules.push(
  {
    test: /\.(js|jsx)$/,
    exclude: [/node_modules/],
    use: [{
      loader: 'eslint-loader'
    }],
    enforce: 'pre'
  },
  {
    test: /\.(js|jsx)$/,
    exclude: [/node_modules/],
    use: [{
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        plugins: ['transform-runtime'],
        presets: ['react', ['env', { 'modules': false }]]
      }
    }]
  },
  {type: 'javascript/auto', test: /\.json$/, use: [{loader: 'json-loader'}]},
  {test: /\.ejs$/, use: 'ejs-loader'},
  {test: /\.woff(\?.*)?$/, use: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff'},
  {test: /\.woff2(\?.*)?$/, use: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2'},
  {test: /\.otf(\?.*)?$/, use: 'file-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype'},
  {test: /\.ttf(\?.*)?$/, use: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream'},
  {test: /\.eot(\?.*)?$/, use: 'file-loader?prefix=fonts/&name=[path][name].[ext]'},
  {test: /\.svg(\?.*)?$/, use: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml'},
  {test: /\.(png|gif|jpg)$/, use: 'url-loader?limit=20480&name=assets/[name]-[hash].[ext]'},
  {test: /\.html$/, use: 'html-loader'},
  {test: /\.txt$/, use: 'raw-loader'}
)

webpackConfig.module.rules.push({
  test: /\.scss$/,
  use: [
    'style-loader',
    'css-loader?-minimize',
    'postcss-loader',
    'sass-loader?sourceMap'
  ]
}, {
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader?-minimize',
    'postcss-loader'
  ]
})

export default webpackConfig
