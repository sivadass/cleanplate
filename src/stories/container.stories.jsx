import { Container, Typography } from "../index";

const meta = {
  title: "components/container",
  component: Container,
};

export const Default = {
  name: "Medium",
  render: () => {
    return (
      <>
        <Container showBorder padding={["y-4", "x-5"]} margin="large">
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
