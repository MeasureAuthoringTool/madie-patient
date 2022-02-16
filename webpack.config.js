/** @format */

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { mergeWithRules } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const path = require("path");
const fs = require("fs");

module.exports = (webpackConfigEnv, argv) => {
  const protocol = webpackConfigEnv.protocol
    ? webpackConfigEnv.protocol
    : "http";
  console.log("Branch Name " + protocol);
  let https;
  console.log("Dir Name " + __dirname);
  try {
    if (protocol === "https") {
      https = {
        key: fs.readFileSync(path.resolve(__dirname, "localhost.key"), "utf-8"),
        cert: fs.readFileSync(
          path.resolve(__dirname, "localhost.crt"),
          "utf-8"
        ),
      };
    } else {
      https = false;
    }
  } catch {
    console.warn(
      "Consider creating an SSL certificate at ./localhost.key and ./localhost.crt, so you can tell your operating system to trust the certificate"
    );
  }

  const externalsConfig = {
    externals: ["@madie/madie-components", "@madie/madie-design-system"],
  };

  const defaultConfig = singleSpaDefaults({
    orgName: "madie",
    projectName: "madie-patient",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
    orgPackagesAsExternal: false,
  });

  // We need to override the css loading rule from the parent configuration
  // so that we can add postcss-loader to the chain
  const newCssRule = {
    module: {
      rules: [
        {
          test: /\.css$/i,
          include: [/node_modules/, /src/],
          use: [
            "style-loader",
            "css-loader", // uses modules: true, which I think we want. Parent does not
            "postcss-loader",
          ],
        },
      ],
    },
    devServer: {
      https,
      static: [
        {
          directory: path.join(__dirname, "local-dev-env"),
          publicPath: "/importmap",
        },
        {
          directory: path.join(
            __dirname,
            "node_modules/@madie/madie-root/dist/"
          ),
          publicPath: "/",
        },
        {
          directory: path.join(
            __dirname,
            "node_modules/@madie/madie-editor/dist/"
          ),
          publicPath: "/madie-editor",
        },
        {
          directory: path.join(
            __dirname,
            "node_modules/@madie/madie-auth/dist/"
          ),
          publicPath: "/madie-auth",
        },
        {
          directory: path.join(
            __dirname,
            "node_modules/@madie/madie-design-system/dist/react"
          ),
          publicPath: "/madie-design-system",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(
          __dirname,
          "node_modules/@madie/madie-root/dist/index.html"
        ),
      }),
    ],
  };

  return mergeWithRules({
    module: {
      rules: {
        test: "match",
        use: "replace",
      },
    },
    plugins: "append",
  })(defaultConfig, newCssRule, externalsConfig);
};
