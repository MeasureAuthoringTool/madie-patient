/** @format */
const { mergeWithRules } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const path = require("path");
const fs = require("fs");

module.exports = (webpackConfigEnv, argv) => {
  resolve: {
    symlinks: false;
  }
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

  const defaultConfig = singleSpaDefaults({
    orgName: "madie",
    projectName: "madie-patient",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
    orgPackagesAsExternal: false,
  });
  const externalsConfig = {
    externals: ["@madie/madie-util", "@madie/madie-editor"],
  };

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
        {
          test: /\.scss$/,
          resolve: {
            extensions: [".scss", ".sass"],
          },
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
              options: { sourceMap: true, importLoaders: 2 },
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true,
              },
            },
            {
              loader: "sass-loader",
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    devServer: {
      https,
    },
  };

  // node polyfills
  const polyfillConfig = {
    resolve: {
      fallback: {
        fs: false,
        buffer: false,
        timers: false,
      },
    },
    plugins: [new NodePolyfillPlugin()],
  };
  //handlebar madness
  const handlebarsConfig = {
    module: {
      rules: [
        {
          include: [/node_modules\/ * \/fqm_execution\/templates/],
          test: /\.(js|handlebars|hbs)$/,
          loader: "handlebars-loader",
        },
      ],
    },
    resolve: {
      alias: {
        handlebars: "handlebars/dist/handlebars.min.js",
      },
    },
  };

  return mergeWithRules({
    module: {
      rules: {
        test: "match",
        use: "replace",
      },
    },
    plugins: "append",
  })(
    externalsConfig,
    defaultConfig,
    polyfillConfig,
    handlebarsConfig,
    newCssRule,
    {
      optimization: {
        minimize: false,
      },
    }
  );
};
