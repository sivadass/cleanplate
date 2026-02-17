import React from "react";
import { BottomSheet, Button, Typography, Container } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const MARGIN_OPTIONS = SPACING_OPTIONS.slice(0, 10);

const DEFAULT_CHILDREN = (
  <Container padding="4">
    <Typography variant="h5" margin="m-0 m-b-2">
      Bottom Sheet
    </Typography>
    <Typography variant="p" margin="m-0 m-b-2">
      Drag the handle down to close. Snap points at 30%, 60%, and 90% of screen height.
    </Typography>
    <Typography variant="p" margin="m-0">
      Touch and mouse support with smooth animations.
    </Typography>
  </Container>
);

const meta = {
  title: "molecules/BottomSheet/Playground",
  component: BottomSheet,
  parameters: {
    layout: "centered",
    viewport: { defaultViewport: "mobile1" },
  },
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Whether the bottom sheet is open",
    },
    margin: {
      options: MARGIN_OPTIONS,
      control: { type: "select" },
      description: "Margin spacing (suffix: e.g. '0' applies m-0)",
    },
    onClose: { action: "onClose" },
  },
  args: {
    isOpen: false,
    margin: "0",
  },
};

export const Default = {
  name: "Default",
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(args.isOpen ?? false);
    const handleClose = () => {
      setIsOpen(false);
      args.onClose?.();
    };
    return (
      <div>
        <Button onClick={() => setIsOpen(true)} margin="b-2">
          Open Bottom Sheet
        </Button>
        <BottomSheet
          isOpen={isOpen}
          onClose={handleClose}
          margin={args.margin}
          className={args.className}
        >
          {args.children ?? DEFAULT_CHILDREN}
        </BottomSheet>
      </div>
    );
  },
};

export const WithContent = {
  name: "With content",
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)} margin="b-2">
          Open
        </Button>
        <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Container padding="4">
            <Typography variant="h5" margin="m-0 m-b-2">
              Demo content
            </Typography>
            <Typography variant="p" margin="m-0 m-b-2">
              • Drag down to close
            </Typography>
            <Typography variant="p" margin="m-0 m-b-2">
              • Snap points at 30%, 60%, 90%
            </Typography>
            <Typography variant="p" margin="m-0">
              • Touch and mouse support
            </Typography>
          </Container>
        </BottomSheet>
      </div>
    );
  },
};

export default meta;
