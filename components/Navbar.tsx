import supabase from "@/supabaseClient";
import { Stack, HStack, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

function Navbar() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  return (
    <HStack
      p={4}
      align="center"
      display="flex"
      justify="space-between"
      maxH="16"
      maxW="100vw"
      w="100%"
      background="green.500"
    >
      <HStack>
        <Stack
          mr={2}
          cursor="pointer"
          onClick={() => router.push("/")}
          h="100%"
        >
          <Button
            variant="unstyled"
            _hover={{
              cursor: "pointer",
            }}
            onClick={() => router.push("/")}
            fontSize="xl"
          >
            Cloud Reader
          </Button>
        </Stack>
      </HStack>
      <Button
        onClick={handleLogout}
        variant="outline"
        _hover={{
          background: "green.400",
        }}
      >
        Logout
      </Button>
    </HStack>
  );
}

export default Navbar;
