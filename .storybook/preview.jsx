import React from "react";
import "../src/styles/reset.scss";
import { CleanPlatePrototypeAttributes } from "../src/prototype/CleanPlatePrototypeAttributes";

/** @type { import('@storybook/react').Preview } */
const preview = {
  decorators: [
    (Story) => (
      <CleanPlatePrototypeAttributes>
        <Story />
      </CleanPlatePrototypeAttributes>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        method: "",
        order: ["Introduction", "Components"],
        locales: "",
      },
    },
  },
};

export default preview;
