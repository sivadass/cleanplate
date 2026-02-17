import { Footer, Container, Typography } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const MARGIN_OPTIONS = SPACING_OPTIONS.slice(0, 10);
const SIZE_OPTIONS = ["small", "medium", "large"];
const VARIANT_OPTIONS = ["light", "dark"];

const meta = {
  title: "molecules/Footer/Playground",
  component: Footer,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    brandName: {
      control: "text",
      description: "Brand name shown in copyright",
    },
    poweredByLabel: {
      control: "text",
      description: "Label for the powered-by link",
    },
    poweredByLink: {
      control: "text",
      description: "URL for the powered-by link",
    },
    size: {
      options: SIZE_OPTIONS,
      control: { type: "select" },
      description: "Size of the footer",
    },
    variant: {
      options: VARIANT_OPTIONS,
      control: { type: "select" },
      description: "Visual variant (light, dark)",
    },
    margin: {
      options: MARGIN_OPTIONS,
      control: { type: "select" },
      description: "Margin spacing (suffix: e.g. '0' applies m-0)",
    },
  },
  args: {
    brandName: "Acme Inc",
    poweredByLabel: "Powered by Sivadass",
    poweredByLink: "https://sivadass.in",
    margin: "0",
  },
};

export const Default = {
  name: "Default",
  render: (args) => (
    <Container padding="4">
      <Footer {...args} />
    </Container>
  ),
};

export const Variants = {
  name: "Variants",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin={["0", "b-2"]}>
        Variants
      </Typography>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <Footer
          brandName="Acme Inc"
          variant="light"
          margin="b-2"
        />
        <Footer
          brandName="Acme Inc"
          variant="dark"
        />
      </div>
    </Container>
  ),
};

export const Sizes = {
  name: "Sizes",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin={["0", "b-2"]}>
        Sizes
      </Typography>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <Footer brandName="Acme Inc" size="small" margin="b-2" />
        <Footer brandName="Acme Inc" size="medium" margin="b-2" />
        <Footer brandName="Acme Inc" size="large" />
      </div>
    </Container>
  ),
};

export const WithColumns = {
  name: "With columns",
  render: (args) => (
    <Container padding="4">
      <Footer {...args}>
        <Container display="flex" gap="4">
          <Container width="quarter">
            <Typography variant="h6" margin={["0", "b-2"]}>
              The Company
            </Typography>
            <ul style={{ margin: 0, paddingLeft: "1rem" }}>
              <li><a href="https://sivadass.in">Founders</a></li>
              <li><a href="https://sivadass.in">Contact Us</a></li>
              <li><a href="https://sivadass.in">About Us</a></li>
            </ul>
          </Container>
          <Container width="quarter">
            <Typography variant="h6" margin={["0", "b-2"]}>
              Policies
            </Typography>
            <ul style={{ margin: 0, paddingLeft: "1rem" }}>
              <li><a href="https://sivadass.in">Terms & Conditions</a></li>
              <li><a href="https://sivadass.in">Privacy Policy</a></li>
              <li><a href="https://sivadass.in">Refund Policy</a></li>
            </ul>
          </Container>
          <Container width="quarter">
            <Typography variant="h6" margin={["0", "b-2"]}>
              Our Products
            </Typography>
            <ul style={{ margin: 0, paddingLeft: "1rem" }}>
              <li><a href="https://player.unmusic.app">UnMusic</a></li>
              <li><a href="https://jsarena.dev">JSArena</a></li>
              <li><a href="https://residy.app">Residy</a></li>
            </ul>
          </Container>
          <Container width="quarter">
            <Typography variant="h6" margin={["0", "b-2"]}>
              Support
            </Typography>
            <ul style={{ margin: 0, paddingLeft: "1rem" }}>
              <li><a href="tel:+919876543210">+91-98765-43210</a></li>
              <li><a href="mailto:hello@company.com">hello@company.com</a></li>
              <li><a href="https://twitter.com/Company">@Company</a></li>
            </ul>
          </Container>
        </Container>
      </Footer>
    </Container>
  ),
};

export default meta;
