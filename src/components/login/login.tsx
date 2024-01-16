import { Button } from "baseui/button";
import { Input } from "baseui/input";
import styled from "styled-components";
import { HeadingXXLarge } from "baseui/typography";
import {
  Container,
  ErrorText,
  InnerContainer,
  InputWrapper,
  StyledInput,
  LandPageBackground,
  StyledLink,
} from "../commons";

import { useSignIn } from "react-auth-kit";
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login(props: any) {
  const [error, setError] = useState("");
  const signIn = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values: any) => {
    console.log("Values: ", values);
    setError("");

    try {
      const response = await axios.post("http://34.27.230.252:5001/login", values);

      signIn({
        token: response.data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { email: values.email },
      });
      navigate("/");
    } catch (err) {
      if (err && err instanceof AxiosError)
        setError(err.response?.data.message);
      else if (err && err instanceof Error) setError(err.message);

      console.log("Error: ", err);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit,
  });

  return (
    <LandPageBackground>
      <Container>
        <InnerContainer>
          <form onSubmit={formik.handleSubmit}>
            <HeadingXXLarge>Welcome Back!</HeadingXXLarge>
            <ErrorText>{error}</ErrorText>
            <InputWrapper>
              <StyledInput
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="Email"
                clearOnEscape
                size="large"
                type="email"
              />
            </InputWrapper>
            <InputWrapper>
              <StyledInput
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder="Password"
                clearOnEscape
                size="large"
                type="password"
              />
            </InputWrapper>
            <InputWrapper>
              <Button
                type="submit"
                size="large"
                kind="primary"
                isLoading={formik.isSubmitting}
              >
                Login
              </Button>
            </InputWrapper>
            <InputWrapper>
              <StyledLink to="/forgotPassword">
                Forgot your password?
              </StyledLink>
            </InputWrapper>
            <InputWrapper>
              <StyledLink to="/CreateUser">Not an user?</StyledLink>
            </InputWrapper>
          </form>
        </InnerContainer>
      </Container>
    </LandPageBackground>
  );
}

export { Login };
