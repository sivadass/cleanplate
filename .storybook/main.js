/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  core: {
    builder: "@storybook/builder-vite", // 👈 The builder enabled here.
  },
  async viteFinal(config) {
    config.css = config.css ?? {};
    config.css.modules = {
      ...config.css.modules,
      generateScopedName: "[local]",
    };
    config.css.preprocessorOptions = {
      ...config.css.preprocessorOptions,
      scss: {
        ...config.css.preprocessorOptions?.scss,
        api: "modern",
      },
    };
    return config;
  },
};
export default config;
