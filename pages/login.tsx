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

interface ILoginFormType {
  email: string;
  password: string;
}
export default function Auth({}: Props) {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormType>();

  const onSubmit = async (data: ILoginFormType) => {
    setLoading(true);
    setError("");
    supabase.auth
      .signInWithPassword({
        email: data.email,
        password: data.password,
      })
      .then(({ data, error }) => {
        if (error) return setError(error.message);
        router.push("/dashboard");
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
                <Text fontSize="xl">Log in to your account</Text>
              </CardHeader>
              <CardBody pt="0">
                <Stack spacing={4}>
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

                  <Button type="submit" colorScheme="green" w="full">
                    Sign in
                  </Button>
                  <Alert
                    status="error"
                    display={error ? "block" : "none"}
                    variant="solid"
                  >
                    {error}
                  </Alert>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Do not have an account yet?{" "}
                    <Button
                      onClick={() => router.push("/signup")}
                      variant="link"
                    >
                      Sign up
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
