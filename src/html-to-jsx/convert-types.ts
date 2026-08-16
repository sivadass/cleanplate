export type HtmlElement = {
  type: string;
  name: string;
  attribs: Record<string, string>;
};

export type HtmlNode = HtmlElement | { type: string; data?: string };
