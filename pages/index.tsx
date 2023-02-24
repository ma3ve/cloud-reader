import { Button, Text, Stack, HStack } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const user = useUser();
  return (
    <Stack display="flex" textAlign="center">
      <Text fontSize="7xl" mt="10">
        Cloud Reader
      </Text>
      <HStack display="flex" justify="center">
        {user ? (
          <Button colorScheme="green" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        ) : (
          <>
            <Button colorScheme="green" onClick={() => router.push("/login")}>
              Login
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/signup")}
              colorScheme="green"
            >
              Get Started
            </Button>
          </>
        )}
      </HStack>
    </Stack>
  );
}
