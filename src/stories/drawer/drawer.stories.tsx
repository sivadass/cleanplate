import React, { useState } from "react";
import { Drawer, Typography, Button } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";
import type { DrawerProps } from "../../components/drawer";

const meta = {
  title: "molecules/Drawer/Playground",
  component: Drawer,
  parameters: {
    layout: "fullscreen",
  },
};

export const Default = {
  name: "Default",
  argTypes: {
    placement: {
      options: ["left", "right", "top", "bottom"],
      control: { type: "inline-radio" },
      description: "Edge the drawer slides from on desktop (≥768px)",
    },
    size: {
      options: ["small", "medium", "large", "full"],
      control: { type: "inline-radio" },
      description: "Panel size preset",
    },
    title: {
      control: { type: "text" },
      description: "Title displayed in the drawer header",
    },
    showCloseButton: {
      control: { type: "boolean" },
      description: "Whether to show the close button",
    },
    closeOnOverlayClick: {
      control: { type: "boolean" },
      description: "Whether clicking the overlay closes the drawer",
    },
    closeOnEscape: {
      control: { type: "boolean" },
      description: "Whether pressing Escape closes the drawer",
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
      description: "Margin spacing (suffix API)",
    },
    onClose: { action: "onClose" },
    primaryButtonLabel: {
      control: { type: "text" },
      description: "Label for the primary action button",
    },
    onPrimaryButtonClick: { action: "onPrimaryButtonClick" },
    secondaryButtonLabel: {
      control: { type: "text" },
      description: "Label for the secondary action button",
    },
    onSecondaryButtonClick: { action: "onSecondaryButtonClick" },
    dataTestId: {
      control: { type: "text" },
      description:
        "Root data-testid on the dialog; suffixed ids on overlay, header, title, close, body, footer, primary, secondary",
    },
  },
  args: {
    placement: "right",
    size: "medium",
    title: "Drawer Title",
    showCloseButton: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
    isOpen: true,
    primaryButtonLabel: "Save",
    secondaryButtonLabel: "Cancel",
  },
  render: (args: DrawerProps) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
      setIsOpen(false);
      args.onClose?.();
    };

    return (
      <div style={{ padding: 24 }}>
        <Button onClick={() => setIsOpen(true)} margin="b-4">
          Open Drawer
        </Button>
        <Drawer {...args} isOpen={isOpen} onClose={handleClose}>
          <Typography variant="p" margin="b-3">
            This drawer slides from the configured edge on desktop. Below 768px
            it always behaves as a bottom sheet (max 90dvh).
          </Typography>
          <Typography variant="p">
            Try different placements, sizes, and close behaviors using the
            controls below.
          </Typography>
        </Drawer>
      </div>
    );
  },
};

export const PlacementLeft = {
  name: "Placement · Left",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div style={{ padding: 24 }}>
        <Button onClick={() => setIsOpen(true)} margin="b-4">
          Open Left Drawer
        </Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          placement="left"
          title="Navigation"
          size="medium"
        >
          <Typography variant="p">Left-side navigation or menu content.</Typography>
        </Drawer>
      </div>
    );
  },
};

export const PlacementRight = {
  name: "Placement · Right",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div style={{ padding: 24 }}>
        <Button onClick={() => setIsOpen(true)} margin="b-4">
          Open Right Drawer
        </Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          placement="right"
          title="Details"
          size="medium"
        >
          <Typography variant="p">Right-side detail or filter panel.</Typography>
        </Drawer>
      </div>
    );
  },
};

export const PlacementTop = {
  name: "Placement · Top",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div style={{ padding: 24 }}>
        <Button onClick={() => setIsOpen(true)} margin="b-4">
          Open Top Drawer
        </Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          placement="top"
          title="Announcements"
          size="medium"
        >
          <Typography variant="p">Top banner or announcement panel.</Typography>
        </Drawer>
      </div>
    );
  },
};

export const PlacementBottom = {
  name: "Placement · Bottom",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div style={{ padding: 24 }}>
        <Button onClick={() => setIsOpen(true)} margin="b-4">
          Open Bottom Drawer
        </Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          placement="bottom"
          title="Actions"
          size="medium"
        >
          <Typography variant="p">Bottom action panel on desktop.</Typography>
        </Drawer>
      </div>
    );
  },
};

export const MobileBottomSheet = {
  name: "Mobile · Bottom Sheet",
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div style={{ padding: 16 }}>
        <Typography variant="p" margin="b-3">
          Viewport is under 768px — any placement becomes a bottom sheet (max
          90dvh).
        </Typography>
        <Button onClick={() => setIsOpen(true)} margin="b-4">
          Open Drawer
        </Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          placement="right"
          title="Mobile Sheet"
          size="medium"
          primaryButtonLabel="Done"
          onPrimaryButtonClick={() => setIsOpen(false)}
        >
          <Typography variant="p" margin="b-2">
            Long content scrolls inside the sheet body.
          </Typography>
          {Array.from({ length: 12 }, (_, i) => (
            <Typography key={i} variant="p" margin="b-2">
              Line {i + 1}: Scrollable drawer content on mobile.
            </Typography>
          ))}
        </Drawer>
      </div>
    );
  },
};

export const WithFooterButtons = {
  name: "With Footer Buttons",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div style={{ padding: 24 }}>
        <Button onClick={() => setIsOpen(true)} margin="b-4">
          Open Drawer with Footer
        </Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          placement="right"
          title="Apply Filters"
          primaryButtonLabel="Apply"
          onPrimaryButtonClick={() => setIsOpen(false)}
          secondaryButtonLabel="Reset"
          onSecondaryButtonClick={() => setIsOpen(false)}
        >
          <Typography variant="p">Filter criteria go here.</Typography>
        </Drawer>
      </div>
    );
  },
};

export default meta;
