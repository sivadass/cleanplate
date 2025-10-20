import React from "react";
import { Dropdown, Button, Typography, MenuList } from "../../index";

const meta = {
  title: "molecules/Dropdown/Playground",
  component: Dropdown,
  parameters: {
    layout: "centered",
  },
};

// Menu content component
const MenuContent = ({ onClose }) => {
  const menuItems = [
    { label: "Profile", value: "profile", icon: "account_circle" },
    { label: "Settings", value: "settings", icon: "settings" },
    { label: "Help", value: "help", icon: "help" },
    { label: "Logout", value: "logout", icon: "logout" }
  ];

  const handleMenuClick = (item) => {
    alert(`${item.label} clicked!`);
    onClose?.();
  };

  return (
    <MenuList 
        items={menuItems}
        direction="vertical"
        variant="light"
        size="small"
        onMenuClick={handleMenuClick}
      />
  );
};

// Simple menu content
const SimpleMenuContent = ({ onClose }) => {
  const menuItems = [
    { label: "Option 1", value: "option1", icon: "check" },
    { label: "Option 2", value: "option2", icon: "star" },
    { label: "Option 3", value: "option3", icon: "favorite" }
  ];

  const handleMenuClick = (item) => {
    alert(`${item.label} clicked!`);
    onClose?.();
  };

  return (
    <div style={{ padding: "var(--space-2)" }}>
      <MenuList 
        items={menuItems}
        direction="vertical"
        variant="light"
        size="small"
        onMenuClick={handleMenuClick}
      />
    </div>
  );
};

// User menu content
const UserMenuContent = ({ onClose }) => {
  const menuItems = [
    { label: "Dashboard", value: "dashboard", icon: "home" },
    { label: "Billing", value: "billing", icon: "credit_card" },
    { label: "Support", value: "support", icon: "help_circle" },
    { label: "Sign out", value: "signout", icon: "logout" }
  ];

  const handleMenuClick = (item) => {
    alert(`${item.label} clicked!`);
    onClose?.();
  };

  return (
    <div style={{ padding: "var(--space-2)" }}>
      <div style={{ padding: "var(--space-2) var(--space-1)", borderBottom: "1px solid var(--gray-light)" }}>
        <Typography variant="small" margin="m-0" color="var(--gray)">
          Signed in as
        </Typography>
        <Typography variant="p" margin="m-0" fontWeight="600">
          john.doe@example.com
        </Typography>
      </div>
      <div style={{ marginTop: "var(--space-2)" }}>
        <MenuList 
          items={menuItems}
          direction="vertical"
          variant="light"
          size="small"
          onMenuClick={handleMenuClick}
        />
      </div>
    </div>
  );
};

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

export const RenderTriggerBasic = {
  name: "Render Trigger - Basic",
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", gap: "var(--space-4)" }}>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Dynamic Text</Typography>
        <Dropdown
          renderTrigger={({ isOpen, triggerProps }) => (
            <Button {...triggerProps}>
              {isOpen ? 'Close Menu' : 'Open Menu'}
            </Button>
          )}
          content={<SimpleMenuContent />}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Dynamic Icon</Typography>
        <Dropdown
          renderTrigger={({ isOpen, triggerProps }) => (
            <Button {...triggerProps}>
              Menu {isOpen ? '▼' : '▶'}
            </Button>
          )}
          content={<SimpleMenuContent />}
        />
      </div>
    </div>
  ),
};

export const RenderTriggerAdvanced = {
  name: "Render Trigger - Advanced",
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", gap: "var(--space-4)" }}>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">State-Based Styling</Typography>
        <Dropdown
          renderTrigger={({ isOpen, isAnimating, triggerProps }) => (
            <Button 
              {...triggerProps}
              variant={isOpen ? 'primary' : 'outline'}
              style={{ 
                opacity: isAnimating ? 0.7 : 1,
                transform: isOpen ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
            >
              {isAnimating ? 'Opening...' : isOpen ? 'Active Menu' : 'Inactive Menu'}
            </Button>
          )}
          content={<SimpleMenuContent />}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Custom Container</Typography>
        <Dropdown
          renderTrigger={({ isOpen, placement, triggerProps }) => (
            <div 
              {...triggerProps}
              style={{
                padding: 'var(--space-2)',
                border: '2px solid',
                borderColor: isOpen ? 'var(--primary-brand)' : 'var(--gray-light)',
                borderRadius: 'var(--radius-medium)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>Custom Trigger</span>
              <span style={{ fontSize: '12px', color: 'var(--gray)' }}>
                {placement}
              </span>
            </div>
          )}
          content={<SimpleMenuContent />}
        />
      </div>
    </div>
  ),
};

export const RenderTriggerUserMenu = {
  name: "Render Trigger - User Menu",
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
      <Dropdown
        renderTrigger={({ isOpen, triggerProps }) => (
          <div 
            {...triggerProps}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2)',
              border: '1px solid var(--gray-light)',
              borderRadius: 'var(--radius-medium)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: isOpen ? 'var(--gray-lightest)' : 'transparent'
            }}
          >
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              JD
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="small" margin="m-0" color="var(--text-primary)">
                John Doe
              </Typography>
              <Typography variant="small" margin="m-0" color="var(--gray)">
                Administrator
              </Typography>
            </div>
            <span style={{ 
              fontSize: '12px', 
              color: 'var(--gray)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}>
              ▼
            </span>
          </div>
        )}
        content={<MenuContent />}
        placement="bottom-end"
      />
    </div>
  ),
};

export const RenderTriggerWithActions = {
  name: "Render Trigger - With Actions",
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", gap: "var(--space-4)" }}>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Multiple Actions</Typography>
        <Dropdown
          renderTrigger={({ isOpen, toggle, close, triggerProps }) => (
            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
              <Button 
                {...triggerProps}
                variant={isOpen ? 'primary' : 'outline'}
              >
                {isOpen ? 'Close' : 'Open'}
              </Button>
              <Button 
                size="small"
                variant="outline"
                onClick={close}
                disabled={!isOpen}
              >
                Force Close
              </Button>
            </div>
          )}
          content={<SimpleMenuContent />}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Custom Toggle</Typography>
        <Dropdown
          renderTrigger={({ isOpen, toggle, triggerProps }) => (
            <div 
              {...triggerProps}
              style={{
                padding: 'var(--space-3)',
                border: '2px dashed var(--primary-brand)',
                borderRadius: 'var(--radius-medium)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                backgroundColor: isOpen ? 'var(--primary-lightest)' : 'transparent'
              }}
            >
              <Typography variant="p" margin="m-0" color="var(--primary-brand)">
                Click to {isOpen ? 'close' : 'open'} dropdown
              </Typography>
              <Typography variant="small" margin="m-0" color="var(--gray)">
                Custom trigger with dashed border
              </Typography>
            </div>
          )}
          content={<SimpleMenuContent />}
        />
      </div>
    </div>
  ),
};

export const TriggerLabel = {
  name: "Trigger Label - Simple",
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", gap: "var(--space-4)" }}>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Basic Trigger Label</Typography>
        <Dropdown
          triggerLabel="Select Option"
          content={<SimpleMenuContent />}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">User Menu</Typography>
        <Dropdown
          triggerLabel="Account"
          content={<MenuContent />}
          placement="bottom-end"
        />
      </div>
    </div>
  ),
};

export const TriggerLabelVariants = {
  name: "Trigger Label - All Placements",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)", padding: "var(--space-4)" }}>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Top Start</Typography>
        <Dropdown
          triggerLabel="Top Start"
          content={<SimpleMenuContent />}
          placement="top-start"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Top</Typography>
        <Dropdown
          triggerLabel="Top"
          content={<SimpleMenuContent />}
          placement="top"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Top End</Typography>
        <Dropdown
          triggerLabel="Top End"
          content={<SimpleMenuContent />}
          placement="top-end"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Left Start</Typography>
        <Dropdown
          triggerLabel="Left Start"
          content={<SimpleMenuContent />}
          placement="left-start"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Left</Typography>
        <Dropdown
          triggerLabel="Left"
          content={<SimpleMenuContent />}
          placement="left"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Left End</Typography>
        <Dropdown
          triggerLabel="Left End"
          content={<SimpleMenuContent />}
          placement="left-end"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Right Start</Typography>
        <Dropdown
          triggerLabel="Right Start"
          content={<SimpleMenuContent />}
          placement="right-start"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Right</Typography>
        <Dropdown
          triggerLabel="Right"
          content={<SimpleMenuContent />}
          placement="right"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Typography variant="small" margin="m-0 m-b-2">Right End</Typography>
        <Dropdown
          triggerLabel="Right End"
          content={<SimpleMenuContent />}
          placement="right-end"
        />
      </div>
    </div>
  ),
};

export default meta;
