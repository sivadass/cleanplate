import { Animated, Avatar, Container, Typography } from "../index";
import {
  SPACING_OPTIONS,
  ANIMATION_TYPE_OPTIONS,
  ANIMATION_DELAY_OPTIONS,
} from "../constants/common";

const meta = {
  title: "components/animated",
  component: Animated,
  parameters: {
    layout: "centered",
  },
};

export const Defualt = {
  args: {
    className: "custom-class-name",
    animationType: ANIMATION_TYPE_OPTIONS[0],
    delay: ANIMATION_DELAY_OPTIONS[0],
  },
  argTypes: {
    className: {},
    animationType: {
      options: ANIMATION_TYPE_OPTIONS,
      control: { type: "select" },
    },
    delay: {
      options: ANIMATION_DELAY_OPTIONS,
      control: { type: "select" },
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
    },
  },
  render: (args) => (
    <Container>
      <Container>
        <Animated {...args}>
          <Avatar name="Steve Wozniak" />
        </Animated>
      </Container>
    </Container>
  ),
};

export const GroupedWithDelay = {
  args: {
    className: "custom-class-name",
    animationType: ANIMATION_TYPE_OPTIONS[0],
    delay: ANIMATION_DELAY_OPTIONS[0],
  },
  argTypes: {
    animationType: {
      options: ANIMATION_TYPE_OPTIONS,
      control: { type: "select" },
    },
    delay: {
      options: ANIMATION_DELAY_OPTIONS,
      control: { type: "select" },
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
    },
  },
  render: (args) => {
    const animationType = args.animationType;
    return (
      <Container>
        <Container>
          <Animated animationType={animationType}>
            <Avatar name="Satya Nadella" />
          </Animated>
          <Animated animationType={animationType} delay={200}>
            <Avatar name="Warren Buffet" delay={0} />
          </Animated>
          <Animated animationType={animationType} delay={400}>
            <Avatar name="Mark Zuckerberg" />
          </Animated>
          <Animated animationType={animationType} delay={600}>
            <Avatar name="Steve Wozniak" />
          </Animated>
          <Animated animationType={animationType} delay={800}>
            <Avatar name="Steve Balmer" />
          </Animated>
        </Container>
      </Container>
    );
  },
};

export default meta;
