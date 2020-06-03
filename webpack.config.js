const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./js/index.tsx",
  mode: "development",
  // mode: "production",
  // Webpack의 출력물에서 디버깅을 하기위해 소스 맵을 허용합니다.
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
            {
                loader: "ts-loader"
            }
        ]
      },
      // 모든 '.js' 출력 파일은 'source-map-loader'에서 다시 처리한 소스 맵이 있습니다.
      {
          enforce: "pre",
          test: /\.js$/,
          loader: "source-map-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: { extensions: ["*", ".ts", ".tsx"] },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
    filename: "bundle.js"
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  }
};