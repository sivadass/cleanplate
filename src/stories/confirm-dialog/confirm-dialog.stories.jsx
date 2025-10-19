import React, { useState } from "react";
import { ConfirmDialog, Button, Typography } from "../../index";

const meta = {
  title: "molecules/ConfirmDialog/Playground",
  component: ConfirmDialog,
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  name: "Default Confirmation",
  argTypes: {
    title: {
      control: { type: "text" },
      description: "Title of the confirmation dialog",
    },
    description: {
      control: { type: "text" },
      description: "Description text for the confirmation",
    },
    primaryButtonLabel: {
      control: { type: "text" },
      description: "Label for the primary action button",
    },
    secondaryButtonLabel: {
      control: { type: "text" },
      description: "Label for the secondary action button",
    },
    size: {
      options: ["small", "medium", "large"],
      control: "inline-radio",
      description: "Size of the confirmation dialog",
    },
    variant: {
      options: ["default", "destructive", "warning"],
      control: "inline-radio",
      description: "Variant of the confirmation dialog",
    },
    showCloseButton: {
      control: { type: "boolean" },
      description: "Whether to show the close button",
    },
    closeOnOverlayClick: {
      control: { type: "boolean" },
      description: "Whether clicking the overlay closes the dialog",
    },
    closeOnEscape: {
      control: { type: "boolean" },
      description: "Whether pressing Escape closes the dialog",
    },
    onClose: { action: "onClose" },
    onPrimaryButtonClick: { action: "onPrimaryButtonClick" },
    onSecondaryButtonClick: { action: "onSecondaryButtonClick" },
  },
  args: {
    title: "Confirm Action",
    description: "Are you sure you want to proceed? This action cannot be undone.",
    primaryButtonLabel: "Confirm",
    secondaryButtonLabel: "Cancel",
    size: "small",
    variant: "default",
    isOpen: true,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    
    const handleClose = () => {
      setIsOpen(false);
      args.onClose?.();
    };

    const handlePrimaryClick = () => {
      args.onPrimaryButtonClick?.();
    };

    const handleSecondaryClick = () => {
      args.onSecondaryButtonClick?.();
    };

    return (
      <div>
        <Button 
          onClick={() => setIsOpen(true)}
          margin="m-0 m-b-4"
        >
          Open Confirmation
        </Button>
        <ConfirmDialog 
          {...args} 
          isOpen={isOpen} 
          onClose={handleClose}
          onPrimaryButtonClick={handlePrimaryClick}
          onSecondaryButtonClick={handleSecondaryClick}
        />
      </div>
    );
  },
};

export const DestructiveAction = {
  name: "Destructive Action",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
      alert("Item deleted!");
      setIsOpen(false);
    };

    return (
      <div>
        <Button 
          onClick={() => setIsOpen(true)}
          margin="m-0 m-b-4"
          variant="solid"
        >
          Delete Item
        </Button>
        <ConfirmDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Delete Item"
          description="Are you sure you want to delete this item? This action cannot be undone and will permanently remove the item from your account."
          primaryButtonLabel="Delete"
          onPrimaryButtonClick={handleDelete}
          secondaryButtonLabel="Cancel"
          size="small"
          variant="destructive"
        />
      </div>
    );
  },
};

export const WarningAction = {
  name: "Warning Action",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleProceed = () => {
      alert("Action proceeded with warning!");
      setIsOpen(false);
    };

    return (
      <div>
        <Button 
          onClick={() => setIsOpen(true)}
          margin="m-0 m-b-4"
          variant="outline"
        >
          Proceed with Warning
        </Button>
        <ConfirmDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Warning"
          description="This action may have unintended consequences. Please review your settings before proceeding."
          primaryButtonLabel="Proceed Anyway"
          onPrimaryButtonClick={handleProceed}
          secondaryButtonLabel="Go Back"
          size="medium"
          variant="warning"
        />
      </div>
    );
  },
};

export const CustomButtons = {
  name: "Custom Button Labels",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSave = () => {
      alert("Changes saved!");
      setIsOpen(false);
    };

    const handleDiscard = () => {
      alert("Changes discarded!");
      setIsOpen(false);
    };

    return (
      <div>
        <Button 
          onClick={() => setIsOpen(true)}
          margin="m-0 m-b-4"
        >
          Save Changes
        </Button>
        <ConfirmDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Save Changes"
          description="You have unsaved changes. What would you like to do?"
          primaryButtonLabel="Save"
          onPrimaryButtonClick={handleSave}
          secondaryButtonLabel="Discard"
          onSecondaryButtonClick={handleDiscard}
          size="small"
        />
      </div>
    );
  },
};

export const NoDescription = {
  name: "No Description",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
      alert("Action confirmed!");
      setIsOpen(false);
    };

    return (
      <div>
        <Button 
          onClick={() => setIsOpen(true)}
          margin="m-0 m-b-4"
        >
          Simple Confirmation
        </Button>
        <ConfirmDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Are you sure?"
          primaryButtonLabel="Yes"
          onPrimaryButtonClick={handleConfirm}
          secondaryButtonLabel="No"
          size="small"
        />
      </div>
    );
  },
};

export const LargeConfirmation = {
  name: "Large Confirmation",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
      alert("Large action confirmed!");
      setIsOpen(false);
    };

    return (
      <div>
        <Button 
          onClick={() => setIsOpen(true)}
          margin="m-0 m-b-4"
        >
          Large Confirmation
        </Button>
        <ConfirmDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Important Decision"
          description="This is a significant action that will affect multiple systems and users. Please carefully review all implications before proceeding. This action cannot be easily reversed and may require additional steps to undo."
          primaryButtonLabel="I Understand, Proceed"
          onPrimaryButtonClick={handleConfirm}
          secondaryButtonLabel="Cancel"
          size="large"
        />
      </div>
    );
  },
};

export const WithCloseButton = {
  name: "With Close Button",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
      alert("Action confirmed!");
      setIsOpen(false);
    };

    return (
      <div>
        <Button 
          onClick={() => setIsOpen(true)}
          margin="m-0 m-b-4"
        >
          Confirmation with Close
        </Button>
        <ConfirmDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Multiple Ways to Close"
          description="This confirmation dialog can be closed by clicking the X button, clicking Cancel, or pressing Escape."
          primaryButtonLabel="Confirm"
          onPrimaryButtonClick={handleConfirm}
          secondaryButtonLabel="Cancel"
          showCloseButton={true}
          closeOnOverlayClick={true}
          closeOnEscape={true}
          size="small"
        />
      </div>
    );
  },
};

export default meta;
