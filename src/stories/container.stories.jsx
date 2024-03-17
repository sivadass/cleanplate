import { Container, Typography } from "../index";
import { SPACING_OPTIONS } from "../constants/common";

const meta = {
  title: "components/container",
  component: Container,
};

export const Playground = {
  name: "Playground",
  argTypes: {
    display: {
      options: ["inline-block", "block", "flex"],
      control: { type: "select" },
      description: "Element type to be rendered",
    },
    width: {
      options: [
        "small",
        "medium",
        "large",
        "extra-large",
        "quarter",
        "half",
        "three-quarters",
        "full",
      ],
      control: { type: "select" },
      description: "Element type to be rendered",
    },
    justify: {
      options: ["space-between", "center", "space-around", "space-evenly"],
      control: { type: "select" },
      description: "Element type to be rendered",
    },
    align: {
      options: ["start", "center", "end"],
      control: { type: "select" },
      description: "Element type to be rendered",
    },
    padding: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
    },
    showBorder: {
      control: {
        type: "boolean",
      },
    },
  },

  render: (args) => {
    return (
      <Container showBorder={true} padding={["6"]} {...args}>
        <Typography>Hello world!</Typography>
      </Container>
    );
  },
};

export const OneFourthGrid = {
  name: "One Fourth Grid",
  render: () => {
    return (
      <>
        <Container display="flex" padding="4">
          <Container showBorder width="quarter" padding={["y-4"]} margin="4">
            <Typography variant="h3">Hello world! 123</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="quarter">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="quarter">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="quarter">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="quarter">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="quarter">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="quarter">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="quarter">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="quarter">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="quarter">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
        </Container>
      </>
    );
  },
};

export const OneThirdColumns = {
  name: "One Third Grid",
  render: () => {
    return (
      <>
        <Container display="flex" paddingLeft="none" paddingRight="none">
          <Container showBorder width="one-third">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="one-third">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="one-third">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="one-third">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="one-third">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="one-third">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="one-third">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="one-third">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="one-third">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
          <Container showBorder width="one-third">
            <Typography variant="h3">Hello world!</Typography>
            <Typography variant="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              accumsan magna vitae velit lacinia, vel bibendum libero
              condimentum. Proin id urna vitae mi efficitur laoreet.
            </Typography>
          </Container>
        </Container>
      </>
    );
  },
};

export default meta;
