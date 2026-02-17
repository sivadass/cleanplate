import React from "react";
import { Toast, Container, Button, Typography } from "../../index";

const VARIANT_OPTIONS = ["info", "error", "warning", "success"];

const meta = {
  title: "atoms/Toast/Playground",
  component: Toast,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    autoClose: {
      control: "boolean",
      description: "Whether toasts auto-close after autoCloseTime",
    },
    autoCloseTime: {
      control: "number",
      description: "Duration in ms before auto-closing (when autoClose is true)",
    },
  },
  args: {
    autoClose: false,
    autoCloseTime: 5000,
  },
};

export const Default = {
  name: "Default",
  render: (args) => {
    const toastRef = React.createRef();
    const handleToast = (toastType) => {
      toastRef?.current?.addMessage({
        mode: toastType,
        message: "Hello world!",
      });
    };
    return (
      <Container padding="4">
        <Container display="flex" gap="2">
          {VARIANT_OPTIONS.map((variant) => (
            <Button
              key={variant}
              variant="outline"
              onClick={() => handleToast(variant)}
            >
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Button>
          ))}
        </Container>
        <Toast ref={toastRef} autoClose={args.autoClose} autoCloseTime={args.autoCloseTime} />
      </Container>
    );
  },
};

export const Variants = {
  name: "Variants",
  render: () => {
    const toastRef = React.createRef();
    const handleToast = (toastType) => {
      toastRef?.current?.addMessage({
        mode: toastType,
        message: `This is a ${toastType} toast message.`,
      });
    };
    return (
      <Container padding="4">
        <Typography variant="h5" margin="m-0 m-b-2">
          Variants
        </Typography>
        <Container display="flex" gap="2">
          <Button variant="outline" onClick={() => handleToast("info")}>
            Info
          </Button>
          <Button variant="outline" onClick={() => handleToast("error")}>
            Error
          </Button>
          <Button variant="outline" onClick={() => handleToast("warning")}>
            Warning
          </Button>
          <Button variant="outline" onClick={() => handleToast("success")}>
            Success
          </Button>
        </Container>
        <Toast ref={toastRef} autoClose={false} />
      </Container>
    );
  },
};

export const WithAutoClose = {
  name: "With auto close",
  render: () => {
    const toastRef = React.createRef();
    const handleToast = () => {
      toastRef?.current?.addMessage({
        mode: "success",
        message: "This toast will auto-close in 5 seconds.",
      });
    };
    return (
      <Container padding="4">
        <Typography variant="h5" margin="m-0 m-b-2">
          Auto close
        </Typography>
        <Button variant="outline" onClick={handleToast}>
          Show toast (auto-closes)
        </Button>
        <Toast ref={toastRef} autoClose autoCloseTime={5000} />
      </Container>
    );
  },
};

export default meta;
