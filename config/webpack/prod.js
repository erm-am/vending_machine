const paths = require("../paths");
const { merge } = require("webpack-merge");
const common = require("./common");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  mode: "production",
  entry: {
    index: {
      import: `${paths.src}/index`,
    },
    react: ["react", "react-dom"],
  },
  devtool: false,
  output: {
    filename: "js/[name].[contenthash].bundle.js",
    publicPath: "./",
  },
  module: {
    rules: [
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
      chunkFilename: "[id].css",
    }),
  ],
  optimization: {
    runtimeChunk: "single",
  },
  performance: {
    hints: "warning",
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});
