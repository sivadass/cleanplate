import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Button, Container, Typography } from "../../index";
import { AuthFrame, AuthLink, LOGO_URL, TextField } from "./shared";

type LoginValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [notice, setNotice] = useState("");
  const { control, handleSubmit } = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
  });

  return (
    <AuthFrame>
      <Container display="flex" justify="center" padding="0" gap="0" margin="b-3">
        <img src={LOGO_URL} alt="CleanPlate" height={32} />
      </Container>
      <Typography variant="h4" align="center" margin="b-1">
        Sign in
      </Typography>
      <Container display="block" padding="0" margin="b-3">
        <Typography variant="small" align="center">
          Use your Northstar account to open the project workspace.
        </Typography>
      </Container>
      {notice ? (
        <Alert variant="success" margin="b-4" message={notice} />
      ) : null}
      <form
        onSubmit={handleSubmit((values) => {
          setNotice(`Signed in as ${values.email}`);
        })}
      >
        <TextField
          control={control}
          name="email"
          placeholder="Email"
          type="email"
          autoComplete="email"
          margin="b-3"
          rules={{ required: "Email is required" }}
        />
        <TextField
          control={control}
          name="password"
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          margin="b-3"
          rules={{ required: "Password is required" }}
        />
        <Container display="flex" justify="flex-end" padding="0" gap="0" margin="b-4">
          <AuthLink
            href="#reset"
            onClick={() => setNotice("Password reset link sent. This is a demo.")}
          >
            Forgot password?
          </AuthLink>
        </Container>
        <Button type="submit" variant="solid" isFluid>
          Sign in
        </Button>
      </form>
      <Container display="flex" justify="center" align="center" padding="0" gap="2" margin="t-4">
        <Typography variant="small">New to Northstar?</Typography>
        <AuthLink
          href="#register"
          onClick={() =>
            setNotice("Open templates/Register to create an account. This is a demo.")
          }
        >
          Create an account
        </AuthLink>
      </Container>
    </AuthFrame>
  );
};

const meta = {
  title: "templates/Login",
  parameters: { layout: "fullscreen" },
};

export default meta;

export const Page = {
  name: "Page",
  render: () => <LoginPage />,
};
