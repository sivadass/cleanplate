import type { ArgTypes } from "@storybook/types";

const tableMobileColumnsTypeDetail = `interface TableMobileColumns {
  title: string; // row key (required)
  subtitle?: string | (row) => ReactNode;
  description?: string | (row) => ReactNode;
  meta?: string | (row) => ReactNode;
  mediaAvatar?: string;
  mediaAvatarCodeText?: string | (row) => string;
  mediaIcon?: string | (row) => string;
  mediaImage?: string | (row) => string;
  action?: (row) => ReactNode;
  descriptionLineClamp?: number;
  // Plus MediaObject passthrough: margin, padding, className, etc.
}`;

/** Storybook argTypes override — docgen shows "union" for TableMobileColumns | null. */
export const tableMobileColumnsArgType: ArgTypes[string] = {
  description:
    "When set and viewport width is under 768px, each row renders as a MediaObject instead of a table row. Omit or pass null for table-only layout.",
  control: false,
  table: {
    type: {
      summary: "TableMobileColumns | null",
      detail: tableMobileColumnsTypeDetail,
    },
    defaultValue: { summary: "null" },
  },
};

export const tableDocsArgTypes: ArgTypes = {
  mobileColumns: tableMobileColumnsArgType,
};
