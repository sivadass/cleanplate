import React, { useState } from "react";
import { Modal, Typography, Button } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const meta = {
  title: "molecules/Modal/Playground",
  component: Modal,
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  name: "Default",
  argTypes: {
    size: {
      options: ["small", "medium", "large", "fullscreen"],
      control: "inline-radio",
      description: "Size of the modal",
    },
    title: {
      control: { type: "text" },
      description: "Title displayed in the modal header",
    },
    showCloseButton: {
      control: { type: "boolean" },
      description: "Whether to show the close button",
    },
    closeOnOverlayClick: {
      control: { type: "boolean" },
      description: "Whether clicking the overlay closes the modal",
    },
    closeOnEscape: {
      control: { type: "boolean" },
      description: "Whether pressing Escape closes the modal",
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
      description: "Margin spacing around the modal",
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
  },
  args: {
    size: "medium",
    title: "Modal Title",
    showCloseButton: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
    isOpen: true,
    primaryButtonLabel: "Save",
    secondaryButtonLabel: "Cancel",
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    
    const handleClose = () => {
      setIsOpen(false);
      args.onClose?.();
    };

    return (
      <div>
        <Button 
          onClick={() => setIsOpen(true)}
          margin="m-0 m-b-4"
        >
          Open Modal
        </Button>
        <Modal {...args} isOpen={isOpen} onClose={handleClose}>
          <Typography variant="p" margin="m-0 m-b-3">
            This is the modal content. You can put any content here including forms, text, images, or other components.
          </Typography>
          <Typography variant="p">
            Try different sizes, close behaviors, and other options using the controls below.
          </Typography>
        </Modal>
      </div>
    );
  },
};

export const WithForm = {
  name: "With Form",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "" });

    const handleSubmit = (e) => {
      e.preventDefault();
      alert(`Form submitted: ${JSON.stringify(formData)}`);
      setIsOpen(false);
    };

    return (
      <div>
        <Button 
          onClick={() => setIsOpen(true)}
          margin="m-0 m-b-4"
        >
          Open Form Modal
        </Button>
        <Modal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          title="Contact Form"
          size="medium"
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <Typography variant="small" margin="m-0 m-b-1" style={{ display: "block" }}>
                Name:
              </Typography>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #ccc", 
                  borderRadius: "4px" 
                }}
                required
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Typography variant="small" margin="m-0 m-b-1" style={{ display: "block" }}>
                Email:
              </Typography>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #ccc", 
                  borderRadius: "4px" 
                }}
                required
              />
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Button 
                type="button" 
                onClick={() => setIsOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="solid"
              >
                Submit
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  },
};


export const ModalWithFooterButtons = {
  name: "Modal with Footer Buttons",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "" });

    const handleSave = () => {
      alert(`Form saved: ${JSON.stringify(formData)}`);
      setIsOpen(false);
    };

    const handleCancel = () => {
      setFormData({ name: "", email: "" });
      setIsOpen(false);
    };

    return (
      <div>
        <Button 
          onClick={() => setIsOpen(true)}
          margin="m-0 m-b-4"
        >
          Open Modal with Footer
        </Button>
        <Modal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          title="User Settings"
          size="medium"
          primaryButtonLabel="Save Changes"
          onPrimaryButtonClick={handleSave}
          secondaryButtonLabel="Cancel"
          onSecondaryButtonClick={handleCancel}
        >
          <div>
            <div style={{ marginBottom: "16px" }}>
              <Typography variant="small" margin="m-0 m-b-1" style={{ display: "block" }}>
                Name:
              </Typography>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #ccc", 
                  borderRadius: "4px" 
                }}
                placeholder="Enter your name"
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Typography variant="small" margin="m-0 m-b-1" style={{ display: "block" }}>
                Email:
              </Typography>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #ccc", 
                  borderRadius: "4px" 
                }}
                placeholder="Enter your email"
              />
            </div>
            <Typography variant="small" style={{ color: "#666" }}>
              Use the footer buttons below to save or cancel your changes.
            </Typography>
          </div>
        </Modal>
      </div>
    );
  },
};

export const FullscreenModal = {
  name: "Fullscreen Modal",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button 
          onClick={() => setIsOpen(true)}
          margin="m-0 m-b-4"
          variant="solid"
        >
          Open Fullscreen Modal
        </Button>
        <Modal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          title="Fullscreen Experience"
          size="fullscreen"
        >
          <div style={{ padding: "20px" }}>
            <Typography variant="h2" margin="m-0 m-b-4">
              Welcome to Fullscreen Mode
            </Typography>
            <Typography variant="p" margin="m-0 m-b-5">
              This modal takes up the entire viewport, perfect for immersive experiences, detailed forms, or content that needs maximum space.
            </Typography>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: "16px", 
              marginTop: "20px" 
            }}>
              {Array.from({ length: 6 }, (_, i) => (
                <div 
                  key={i}
                  style={{ 
                    padding: "20px", 
                    backgroundColor: "#f5f5f5", 
                    borderRadius: "8px",
                    textAlign: "center"
                  }}
                >
                  <Typography variant="h3" margin="m-0 m-b-2">
                    Card {i + 1}
                  </Typography>
                  <Typography variant="p">
                    Sample content for demonstration
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

export default meta;
