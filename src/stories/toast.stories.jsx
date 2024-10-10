import React from "react";
import { Toast, Container, Button } from "../index";

const meta = {
  title: "components/toast",
  component: Toast,
};

export const Default = {
  name: "Variants",
  render: () => {
    const toastRef = React.createRef();
    const handleToast = (toastType) => {
      toastRef?.current?.addMessage({
        mode: toastType,
        message: "Hello world!",
      });
    };
    return (
      <Container>
        <Container display="flex">
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
        <Toast ref={toastRef} autoClose={true} />
      </Container>
    );
  },
};

export default meta;
