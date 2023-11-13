import Typography from "../components/typography/Typography";

const meta = {
  component: Typography,
};

export const H1 = {
  name: "Title - H1",
  render: () => <Typography variant="h1">Hello world!</Typography>,
};

export const H2 = {
  render: () => <Typography variant="h2">Hello world!</Typography>,
};

export const H3 = {
  render: () => <Typography variant="h3">Hello world!</Typography>,
};

export const H4 = {
  render: () => <Typography variant="h4">Hello world!</Typography>,
};

export const H5 = {
  render: () => <Typography variant="h5">Hello world!</Typography>,
};

export const H6 = {
  render: () => <Typography variant="h6">Hello world!</Typography>,
};

export const Paragraph = {
  render: () => <Typography>Hello world!</Typography>,
};

export default meta;
