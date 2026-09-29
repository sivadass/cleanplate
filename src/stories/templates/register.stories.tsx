import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Button, Container, Typography } from "../../index";
import { AuthFrame, AuthLink, LOGO_URL, TextField } from "./shared";

type RegisterValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const [notice, setNotice] = useState("");
  const { control, handleSubmit } = useForm<RegisterValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <AuthFrame>
      <Container display="flex" justify="center" padding="0" gap="0" margin="b-3">
        <img src={LOGO_URL} alt="CleanPlate" height={32} />
      </Container>
      <Typography variant="h4" align="center" margin="b-1">
        Create an account
      </Typography>
      <Container display="block" padding="0" margin="b-3">
        <Typography variant="small" align="center">
          Start a Northstar workspace for your team.
        </Typography>
      </Container>
      {notice ? (
        <Alert variant="success" margin="b-3" message={notice} />
      ) : null}
      <form
        onSubmit={handleSubmit((values) => {
          setNotice(`Account created for ${values.name}`);
        })}
      >
        <TextField
          control={control}
          name="name"
          placeholder="Name"
          autoComplete="name"
          margin="b-3"
          rules={{ required: "Name is required" }}
        />
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
          autoComplete="new-password"
          margin="b-3"
          rules={{
            required: "Password is required",
            minLength: { value: 8, message: "Use at least 8 characters" },
          }}
        />
        <TextField
          control={control}
          name="confirmPassword"
          placeholder="Confirm password"
          type="password"
          autoComplete="new-password"
          margin="b-4"
          rules={{
            required: "Confirm your password",
            validate: (value, formValues) =>
              value === formValues.password || "Passwords do not match",
          }}
        />
        <Button type="submit" variant="solid" isFluid>
          Create account
        </Button>
      </form>
      <Container display="flex" justify="center" align="center" padding="0" gap="2" margin="t-4">
        <Typography variant="small">Already have an account?</Typography>
        <AuthLink
          href="#login"
          onClick={() => setNotice("Open templates/Login to sign in. This is a demo.")}
        >
          Sign in
        </AuthLink>
      </Container>
    </AuthFrame>
  );
};

const meta = {
  title: "templates/Register",
  parameters: { layout: "fullscreen" },
};

export default meta;

export const Page = {
  name: "Page",
  render: () => <RegisterPage />,
};
