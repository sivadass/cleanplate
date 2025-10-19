import React from "react";
import { Dropdown, Button, Typography } from "../index";

const meta = {
  title: "molecules/Dropdown/Playground",
  component: Dropdown,
  parameters: {
    layout: "centered",
  },
};

// Menu content component
const MenuContent = ({ onClose }) => (
  <div style={{ padding: "var(--space-2)" }}>
    <Typography variant="small" margin="m-0 m-b-2" color="var(--gray)">
      Account Options
    </Typography>
    <Button 
      variant="outline" 
      size="small" 
      isFluid 
      margin="m-0 m-b-1"
      onClick={() => {
        alert("Profile clicked!");
        onClose?.();
      }}
    >
      Profile
    </Button>
    <Button 
      variant="outline" 
      size="small" 
      isFluid 
      margin="m-0 m-b-1"
      onClick={() => {
        alert("Settings clicked!");
        onClose?.();
      }}
    >
      Settings
    </Button>
    <Button 
      variant="outline" 
      size="small" 
      isFluid 
      onClick={() => {
        alert("Logout clicked!");
        onClose?.();
      }}
    >
      Logout
    </Button>
  </div>
);

// Simple menu content
const SimpleMenuContent = ({ onClose }) => (
  <div style={{ padding: "var(--space-2)" }}>
    <Button 
      variant="outline" 
      size="small" 
      isFluid 
      margin="m-0 m-b-1"
      onClick={() => {
        alert("Option 1 clicked!");
        onClose?.();
      }}
    >
      Option 1
    </Button>
    <Button 
      variant="outline" 
      size="small" 
      isFluid 
      margin="m-0 m-b-1"
      onClick={() => {
        alert("Option 2 clicked!");
        onClose?.();
      }}
    >
      Option 2
    </Button>
    <Button 
      variant="outline" 
      size="small" 
      isFluid 
      onClick={() => {
        alert("Option 3 clicked!");
        onClose?.();
      }}
    >
      Option 3
    </Button>
  </div>
);

// User menu content
const UserMenuContent = ({ onClose }) => (
  <div style={{ padding: "var(--space-2)" }}>
    <div style={{ padding: "var(--space-2) var(--space-1)", borderBottom: "1px solid var(--gray-light)" }}>
      <Typography variant="small" margin="m-0" color="var(--gray)">
        Signed in as
      </Typography>
      <Typography variant="p" margin="m-0" fontWeight="600">
        john.doe@example.com
      </Typography>
    </div>
    <Button 
      variant="outline" 
      size="small" 
      isFluid 
      margin="m-0 m-t-2 m-b-1"
      onClick={() => {
        alert("Dashboard clicked!");
        onClose?.();
      }}
    >
      Dashboard
    </Button>
    <Button 
      variant="outline" 
      size="small" 
      isFluid 
      margin="m-0 m-b-1"
      onClick={() => {
        alert("Billing clicked!");
        onClose?.();
      }}
    >
      Billing
    </Button>
    <Button 
      variant="outline" 
      size="small" 
      isFluid 
      margin="m-0 m-b-1"
      onClick={() => {
        alert("Support clicked!");
        onClose?.();
      }}
    >
      Support
    </Button>
    <Button 
      variant="outline" 
      size="small" 
      isFluid 
      onClick={() => {
        alert("Sign out clicked!");
        onClose?.();
      }}
    >
      Sign out
    </Button>
  </div>
);

export const Default = {
  name: "Default Dropdown",
  argTypes: {
    placement: {
      options: [
        "top", "top-start", "top-end",
        "bottom", "bottom-start", "bottom-end",
        "left", "left-start", "left-end",
        "right", "right-start", "right-end"
      ],
      control: { type: "select" },
      description: "Position of the dropdown relative to trigger",
    },
    offset: {
      control: { type: "number", min: 0, max: 20, step: 1 },
      description: "Distance between trigger and dropdown",
    },
    shift: {
      control: { type: "boolean" },
      description: "Shift dropdown to stay in viewport",
    },
    flip: {
      control: { type: "boolean" },
      description: "Flip dropdown to opposite side when no space",
    },
    closeOnClickOutside: {
      control: { type: "boolean" },
      description: "Close dropdown when clicking outside",
    },
    closeOnEscape: {
      control: { type: "boolean" },
      description: "Close dropdown when pressing Escape",
    },
  },
  args: {
    placement: "bottom-end",
    offset: 4,
    shift: true,
    flip: true,
    closeOnClickOutside: true,
    closeOnEscape: true,
  },
  render: (args) => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
      <Dropdown
        trigger={<Button>Open Menu</Button>}
        content={<MenuContent />}
        {...args}
      />
    </div>
  ),
};

export const PlacementVariants = {
  name: "Placement Variants",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)", padding: "var(--space-4)" }}>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Top Start</Typography>
        <Dropdown
          trigger={<Button size="small">Menu</Button>}
          content={<SimpleMenuContent />}
          placement="top-start"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Top</Typography>
        <Dropdown
          trigger={<Button size="small">Menu</Button>}
          content={<SimpleMenuContent />}
          placement="top"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Top End</Typography>
        <Dropdown
          trigger={<Button size="small">Menu</Button>}
          content={<SimpleMenuContent />}
          placement="top-end"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Left Start</Typography>
        <Dropdown
          trigger={<Button size="small">Menu</Button>}
          content={<SimpleMenuContent />}
          placement="left-start"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Left</Typography>
        <Dropdown
          trigger={<Button size="small">Menu</Button>}
          content={<SimpleMenuContent />}
          placement="left"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Left End</Typography>
        <Dropdown
          trigger={<Button size="small">Menu</Button>}
          content={<SimpleMenuContent />}
          placement="left-end"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Right Start</Typography>
        <Dropdown
          trigger={<Button size="small">Menu</Button>}
          content={<SimpleMenuContent />}
          placement="right-start"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Right</Typography>
        <Dropdown
          trigger={<Button size="small">Menu</Button>}
          content={<SimpleMenuContent />}
          placement="right"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Right End</Typography>
        <Dropdown
          trigger={<Button size="small">Menu</Button>}
          content={<SimpleMenuContent />}
          placement="right-end"
        />
      </div>
    </div>
  ),
};

export const UserMenu = {
  name: "User Menu",
  render: () => (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", minHeight: "200px", padding: "var(--space-4)" }}>
      <Dropdown
        trigger={
          <Button variant="outline">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <div style={{ 
                width: "24px", 
                height: "24px", 
                borderRadius: "50%", 
                backgroundColor: "var(--primary-brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                JD
              </div>
              <Typography variant="small">John Doe</Typography>
            </div>
          </Button>
        }
        content={<UserMenuContent />}
        placement="bottom-end"
        offset={8}
      />
    </div>
  ),
};

export const ActionMenu = {
  name: "Action Menu",
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
      <div style={{ display: "flex", gap: "var(--space-3)" }}>
        <Button>Primary Action</Button>
        <Dropdown
          trigger={<Button variant="outline">More Actions</Button>}
          content={<MenuContent />}
          placement="bottom-start"
        />
      </div>
    </div>
  ),
};

export const CustomOffset = {
  name: "Custom Offset",
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", gap: "var(--space-4)" }}>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Offset: 0px</Typography>
        <Dropdown
          trigger={<Button size="small">Menu</Button>}
          content={<SimpleMenuContent />}
          offset={0}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Offset: 8px</Typography>
        <Dropdown
          trigger={<Button size="small">Menu</Button>}
          content={<SimpleMenuContent />}
          offset={8}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Offset: 16px</Typography>
        <Dropdown
          trigger={<Button size="small">Menu</Button>}
          content={<SimpleMenuContent />}
          offset={16}
        />
      </div>
    </div>
  ),
};

export const DisabledFeatures = {
  name: "Disabled Features",
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", gap: "var(--space-4)" }}>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">No Flip</Typography>
        <Dropdown
          trigger={<Button size="small">Menu</Button>}
          content={<SimpleMenuContent />}
          placement="top"
          flip={false}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">No Shift</Typography>
        <Dropdown
          trigger={<Button size="small">Menu</Button>}
          content={<SimpleMenuContent />}
          placement="bottom"
          shift={false}
        />
      </div>
    </div>
  ),
};

export default meta;
