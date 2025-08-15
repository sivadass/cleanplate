import React from "react";
import { BottomSheet, Button, Typography, Container } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const meta = {
  title: "atoms/Bottom Sheet/Playground",
  component: BottomSheet,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    docs: {
      description: {
        component: "A bottom sheet component that slides up from the bottom of the screen with drag-to-close functionality and snap points.",
      },
    },
  },
  args: {
    isOpen: true,
  },
};

export const Default = {
  name: "Default",
  argTypes: {
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
      description: "Margin spacing for the bottom sheet",
    },
    isOpen: {
      control: {
        type: "boolean",
      },
      description: "Controls the visibility of the bottom sheet",
    },
    onClose: {
      description: "Callback function called when the bottom sheet is closed",
    },
  },

  args: {
    children: (
      <Container>
        <Typography variant="h5" margin="b-4">
          Bottom Sheet Demo
        </Typography>
        <Typography variant="p" margin="b-2">
          This is a bottom sheet component with the following features:
        </Typography>
        <Typography variant="p" margin="b-2">
          • Drag down to close
        </Typography>
        <Typography variant="p" margin="b-2">
          • Snap points at 30%, 60%, and 90% of screen height
        </Typography>
        <Typography variant="p" margin="b-2">
          • Smooth animations
        </Typography>
        <Typography variant="p" margin="b-2">
          • Touch and mouse support
        </Typography>
        <Typography variant="p" margin="b-2">
          • Scrollable content
        </Typography>
        <Typography variant="p" margin="b-2">
          • Backdrop overlay
        </Typography>
      </Container>
    ),
  },

  render: (args) => {
    const { children, ...otherArgs } = args;
    const [isOpen, setIsOpen] = React.useState(false);

    const handleClose = () => {
      setIsOpen(false);
    };

    const handleOpen = () => {
      setIsOpen(true);
    };

    return (
      <div>
        <Button onClick={handleOpen}>
          {isOpen ? "Bottom Sheet is Open" : "Open Bottom Sheet"}
        </Button>
        <BottomSheet 
          {...otherArgs} 
          onClose={handleClose} 
          isOpen={isOpen}
        >
          {children}
        </BottomSheet>
      </div>
    );
  },
};

export default meta;
