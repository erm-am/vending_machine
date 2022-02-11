const paths = require("../paths");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const babelLoader = {
  loader: "babel-loader",
};

module.exports = {
  entry: `${paths.src}/index`,
  output: {
    path: paths.build,
    filename: "js/[name].bundle.js",
    publicPath: "/",
    clean: true,
    crossOriginLoading: "anonymous",
    module: true,
  },
  resolve: {
    alias: {
      "@": `${paths.src}/modules`,
    },
    extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  experiments: {
    topLevelAwait: true,
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.m?jsx?$/i,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|eot|ttf|woff2?)$/i,
        type: "asset",
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${paths.public}`,
          to: `${paths.build}/assets`,
          // noErrorOnMissing: true,
          globOptions: {
            ignore: ["*.DS_Store", "**/index.html"],
          },
        },
      ],
    }),

    new HtmlWebpackPlugin({
      template: `${paths.public}/index.html`,
      filename: "index.html",
      templateParameters: {
        title: "Project",
      },
    }),

    new Dotenv({
      path: "./config/.env",
    }),
  ],
};
