import { Footer, Container, Typography } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const meta = {
  title: "molecules/Footer/Playground",
  component: Footer,
  args: {
    brandName: "Acme Inc",
    poweredByLabel: "Powered by Sivadass",
    poweredByLink: "https://sivadass.in",
  },
};

export const Default = {
  name: "Copyright",
  argTypes: {
    variant: {
      options: ["light", "dark"],
      control: { type: "select" },
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
    },
    brandName: {
      control: { type: "text" },
    },
    poweredByLabel: {
      control: { type: "text" },
    },
    poweredByLink: {
      control: { type: "text" },
    },
  },

  render: (args) => {
    return <Footer {...args} />;
  },
};

export const Columns = {
  name: "With Footer Columns",
  argTypes: {
    variant: {
      options: ["light", "dark"],
      control: { type: "select" },
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
    },
    brandName: {
      control: { type: "text" },
    },
    poweredByLabel: {
      control: { type: "text" },
    },
    poweredByLink: {
      control: { type: "text" },
    },
  },

  render: (args) => {
    return (
      <Footer {...args}>
        <Container display="flex" paddingLeft="none" paddingRight="none">
          <Container width="quarter">
            <Typography variant="h6" margin="b-4">
              The Company
            </Typography>
            <ul>
              <li>
                <a href="https://sivadass.in">Founders</a>
              </li>
              <li>
                <a href="https://sivadass.in">Contact Us</a>
              </li>
              <li>
                <a href="https://sivadass.in">About Us</a>
              </li>
            </ul>
          </Container>
          <Container width="quarter">
            <Typography variant="h6" margin="b-4">
              Policies
            </Typography>
            <ul>
              <li>
                <a href="https://sivadass.in">Terms & Conditions</a>
              </li>
              <li>
                <a href="https://sivadass.in">Privacy Policy</a>
              </li>
              <li>
                <a href="https://sivadass.in">Refund Policy</a>
              </li>
            </ul>
          </Container>
          <Container width="quarter">
            <Typography variant="h6" margin="b-4">
              Our Products
            </Typography>
            <ul>
              <li>
                <a href="https://player.unmusic.app">UnMusic</a>
              </li>
              <li>
                <a href="https://jsarena.dev">JSArena</a>
              </li>
              <li>
                <a href="https://residy.app">Residy</a>
              </li>
            </ul>
          </Container>
          <Container width="quarter">
            <Typography variant="h6" margin="b-4">
              Support
            </Typography>
            <ul>
              <li>
                <a href="tel:+919876543210">+91-98765-43210</a>
              </li>
              <li>
                <a href="mailto:hello@company.com">hello@company.com</a>
              </li>
              <li>
                <a href="https://twitter.com/Company">@Company</a>
              </li>
            </ul>
          </Container>
        </Container>
      </Footer>
    );
  },
};

export default meta;
