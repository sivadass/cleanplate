// .storybook/YourTheme.js

import { create } from "@storybook/theming/create";

export default create({
  base: "light",
  // Typography
  fontBase: '"Inter", sans-serif',
  fontCode: "monospace",

  brandTitle: "CleanPlate - A Headless React UI Framework",
  brandUrl: "https://cleanplate.sivadass.in",
  brandImage:
    "https://f005.backblazeb2.com/file/sivadass-cloud/cleanplate-logo.svg",
  brandTarget: "_self",

  //
  colorPrimary: "#3A10E5",
  colorSecondary: "#999",

  // UI
  appBg: "#ffffff",
  appContentBg: "#ffffff",
  appBorderColor: "#ccc",
  appBorderRadius: 4,

  // Text colors
  textColor: "#10162F",
  textInverseColor: "#ffffff",

  // Toolbar default and active colors
  barTextColor: "#9E9E9E",
  barSelectedColor: "#ccc",
  barBg: "#ffffff",

  // Form colors
  inputBg: "#ffffff",
  inputBorder: "#10162F",
  inputTextColor: "#10162F",
  inputBorderRadius: 2,
});
