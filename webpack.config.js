const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.js", // Archivo de entrada principal de tu aplicación
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js", // Archivo de salida
    publicPath: "/app-alimentospippo/app/", // Necesario para manejar las rutas en el navegador
  },
  mode: "production", // Puedes cambiarlo a 'production' para el build final
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 3000, // El puerto donde corre tu app en desarrollo
    /*  historyApiFallback: true, // Habilitar el manejo de rutas en el servidor */
    historyApiFallback: {
      index: "/app-alimentospippo/app/index.html",
    },
    open: true, // Abrir automáticamente el navegador
    hot: true, // Habilitar HMR (Hot Module Replacement)
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Para archivos JavaScript y JSX
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Transpilar ES6+ a JS compatible con navegadores
        },
      },
      {
        test: /\.css$/, // Soporte para archivos CSS
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(scss|sass)$/, // Soporte para archivos SCSS y SASS
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // Para importar imágenes
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]", // Agregar hash para optimización de caché
              outputPath: "assets/images/",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // Para importar sin especificar extensiones
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Plantilla del archivo HTML base
      filename: "index.html",
    }),
  ],
};
