import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import supabase from "@/supabaseClient";
import Spinner from "@/components/Spinner";

type Props = {};

interface ISignUpForm {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
}
export default function Auth({}: Props) {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ISignUpForm>();

  const onSubmit = (data: ISignUpForm) => {
    setLoading(true);
    setError("");
    setSuccess("");
    supabase.auth
      .signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
          },
        },
      })
      .then(({ data, error }) => {
        if (error) return setError(error.message);
        setSuccess(
          "A verification link has been sent to your email. please click on it to verify your account"
        );
      })
      .catch((err) => {
        setError("something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Stack>
      <Text fontSize="5xl" textAlign="center" mt="14">
        Cloud Reader
      </Text>
      <Flex justify="center">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Spinner loading={loading}>
            <Card background="blackAlpha.400" color="white" w="md" m="0">
              <CardHeader>
                <Text fontSize="xl">Hello!!!!</Text>
                <Text fontSize="sm">Please sign up to continue</Text>
              </CardHeader>
              <CardBody pt="0">
                <Stack spacing={4}>
                  <FormControl isInvalid={!!errors.username}>
                    <FormLabel>Username</FormLabel>
                    <Input
                      {...register("username", {
                        required: "Username is required",
                      })}
                    />
                    {errors.username && (
                      <FormErrorMessage>
                        {errors.username.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email address</FormLabel>
                    <Input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <FormErrorMessage>
                        {errors.email.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup size="md">
                      <Input
                        pr="4.5rem"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must have at least 8 characters",
                          },
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message:
                              "Password must have at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
                          },
                        })}
                      />
                      <InputRightElement>
                        <IconButton
                          icon={
                            showPassword ? (
                              <AiOutlineEyeInvisible />
                            ) : (
                              <AiOutlineEye />
                            )
                          }
                          variant="unstyled"
                          aria-label="Toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          _hover={{
                            cursor: "pointer",
                          }}
                        ></IconButton>
                      </InputRightElement>
                    </InputGroup>
                    {errors.password && (
                      <FormErrorMessage>
                        {errors.password.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl isInvalid={!!errors.confirmPassword}>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      {...register("confirmPassword", {
                        required: "Confirm password is required",
                        validate: (value) =>
                          value === watch("password") ||
                          "The passwords do not match",
                      })}
                    />
                    {errors.confirmPassword && (
                      <FormErrorMessage>
                        {errors.confirmPassword.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <Button type="submit" colorScheme="green" w="full">
                    Sign Up
                  </Button>
                  <Alert
                    status="error"
                    display={error ? "block" : "none"}
                    variant="solid"
                  >
                    <p>{error}</p>
                  </Alert>
                  <Alert
                    status="success"
                    display={success ? "block" : "none"}
                    variant="solid"
                  >
                    <p>{success}</p>
                  </Alert>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                    <Button
                      onClick={() => router.push("/login")}
                      variant="link"
                    >
                      Log In
                    </Button>
                  </p>
                </Stack>
              </CardBody>
            </Card>
          </Spinner>
        </form>
      </Flex>
    </Stack>
  );
}
