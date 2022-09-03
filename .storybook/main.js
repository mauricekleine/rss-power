const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

/**  @type { import('@storybook/core-common').StorybookConfig } */
module.exports = {
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-links",
  ],
  framework: "@storybook/react",
  stories: ["../app/**/*.stories.@(ts|tsx)"],
  webpackFinal: async (config) => {
    config.resolve.alias["@remix-run/react"] = path.resolve(
      __dirname,
      "./remix-mock/react.js"
    );
    config.resolve.alias["@remix-run/node"] = path.resolve(
      __dirname,
      "./remix-mock/node.js"
    );
    config.resolve.plugins.push(new TsconfigPathsPlugin());
    return config;
  },
};
