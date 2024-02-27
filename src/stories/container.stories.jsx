import { Container, Typography } from "../index";

const meta = {
  title: "container/component",
  component: Container,
};

export const Default = {
  name: "Medium",
  render: () => {
    return (
      <>
        <Container
          showBorder
          paddingTop="extra-large"
          paddingRight="extra-large"
          paddingBottom="extra-large"
          paddingLeft="extra-large"
          marginBottom="large"
        >
          <Typography>Hello world!</Typography>
        </Container>
      </>
    );
  },
};

export const OneFourthGrid = {
  name: "One Fourth Grid",
  render: () => {
    return (
      <>
        <Container display="flex" paddingLeft="none" paddingRight="none">
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
