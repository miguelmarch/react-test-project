import { Button } from "baseui/button";
import { Input } from "baseui/input";
import styled from "styled-components";
import { HeadingXXLarge } from "baseui/typography";
import { useSignIn } from "react-auth-kit";
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import {
  Container,
  ErrorText,
  InnerContainer,
  InputWrapper,
  StyledInput,
  LandPageBackground,
  StyledLink,
  StyledText,
} from "../commons";

function CreateUser(props: any) {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (values: any) => {
    console.log("Values: ", values);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5001/createUser",
        values
      );

      if (response.status == 200) {
        navigate("/login");
      }
    } catch (err) {
      if (err && err instanceof AxiosError)
        setError(err.response?.data.message);
      else if (err && err instanceof Error) setError(err.message);

      console.log("Error: ", err);
    }
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Requerido"),
    email: Yup.string().email("Email inválido").required("Requerido"),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), undefined],
        "Las contraseñas deben coincidir"
      )
      .required("Confirmación de contraseña requerida"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit,
    validationSchema: validationSchema,
  });

  return (
    <LandPageBackground>
      <Container>
        <InnerContainer>
          <form onSubmit={formik.handleSubmit}>
            <HeadingXXLarge>Create your new user</HeadingXXLarge>
            <InputWrapper>
              <StyledInput
                value={formik.values.email}
                onChange={formik.handleChange}
                type="email"
                name="email"
                placeholder="Email"
                clearOnEscape
                size="large"
              />
            </InputWrapper>
            <InputWrapper>
              <StyledInput
                value={formik.values.password}
                onChange={formik.handleChange}
                type="password"
                name="password"
                placeholder="Password"
                clearOnEscape
                size="large"
              />
            </InputWrapper>
            <InputWrapper>
              <StyledInput
                onChange={formik.handleChange}
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                clearOnEscape
                size="large"
              />
            </InputWrapper>
            <InputWrapper>
              {formik.errors.confirmPassword &&
                formik.touched.confirmPassword && (
                  <ErrorText>{formik.errors.confirmPassword}</ErrorText>
                )}
            </InputWrapper>
            <InputWrapper>
              <Button
                type="submit"
                size="large"
                kind="primary"
                isLoading={formik.isSubmitting}
              >
                Create
              </Button>
            </InputWrapper>
          </form>
          <StyledLink to="/Login">Login</StyledLink>
        </InnerContainer>
      </Container>
    </LandPageBackground>
  );
}

export { CreateUser };
