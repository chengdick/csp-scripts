const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//替换moment库过大问题
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')
// 打包进度条
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
// merge config
const { merge } = require('webpack-merge')
// 颜色输出
const chalk = require('chalk')
let theme
try{
   theme = require(path.resolve(process.cwd(), './demo/theme')) 
}catch{
  theme={}
}
//自定义webpack
let dev = {}
try{
  dev = require(path.resolve(process.cwd(), './demo/webpack.config')) 
}catch{
  dev={}
}

const baseConfig ={
  mode: 'development',
  devtool: 'source-map',
  entry: [
    path.join(process.cwd(), './demo/src/index.tsx')
  ],
  output: {
    filename: '[name]_[hash:8].js',
    chunkFilename: '[name]_[hash:8].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.less', '.jsx'],
    alias: {
      '@': path.resolve(process.cwd(), './demo/src'),
    },
  },
  externals: {},
  module: {
    rules: [
      {
        test: /\.(t|j)sx?/,
        use: {
          loader: 'babel-loader',
          options:{
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage", // 按需加载
                  corejs: 3 // corejs 替代了以前的pollyfill
                }
              ],
              "@babel/preset-react",
              "@babel/preset-typescript"
            ],
            plugins: [
              "@babel/plugin-transform-runtime",
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              ["@babel/plugin-proposal-private-methods", { loose: true }],
              [
                "@babel/plugin-proposal-object-rest-spread",
                { loose: true, useBuiltIns: true }
              ],
              [
                "import",
                { libraryName: "antd", libraryDirectory: "lib", style: true }
              ],
              process.env.NODE_ENV !== "production" && ["react-refresh/babel", {skipEnvCheck: true}]
            ].filter(Boolean)
          }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: theme,
                javascriptEnabled: true,
                style: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100 * 1024,
              name: 'img/[name].ext',
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(otf|eot|wof|svg|woff)$/,
        use: 'file-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        use: 'json-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ReactRefreshPlugin(),   // react-refresh 添加
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), './demo/index.html'),
      filename: 'index.html',
      title: '智牧宝',
      inject: true,
      compress: true,
      cache: false,
      hash: true,
    }),
    new AntdDayjsWebpackPlugin(),
    new ProgressBarPlugin({
      format:
        '  build [:bar] ' +
        chalk.green.bold(':percent') +
        ' (:elapsed seconds)',
      clear: false,
    }),
    
  ],
  devServer: {
    contentBase: path.resolve(process.cwd(), './demo/dist'),
    compress: true,
    host: 'localhost',
    port: 7799,
    hot: true,
    open: true,
    proxy: {
      '/jianan': {
        // target: 'https://pre-tms.jaagro.com',
        // target: 'http://172.16.50.35/', //代理地址，这里设置的地址会代替axios中设置的baseURL
        target: 'http://172.16.50.35:81/', //代理地址，这里设置的地址会代替axios中设置的baseURL  测试代理
        // target: 'http://tms.jaagro.com', //代理地址，这里设置的地址会代替axios中设置的baseURL  生产代理
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        //ws: true, // proxy websockets
        //pathRewrite方法重写url
        pathRewrite: {
          // "^/jianan": "",
          // pathRewrite: { '^/tms': '/' } //重写之后url为 http://192.168.1.16:8085/xxxx
          //pathRewrite: {'^/api': '/api'} 重写之后url为 http://192.168.1.16:8085/api/xxxx
        },
      },
    },
  },
}
module.exports = () => {
    return merge(baseConfig, dev)
}
