import Navbar from "@/components/Navbar";
import supabase, {
  getUserSessionElseRedirect,
  ProtectRouteSession,
} from "@/supabaseClient";
import React from "react";
import Upload from "@/components/Upload";
import { Container, Flex, Stack } from "@chakra-ui/react";

type Props = {} & ProtectRouteSession;

function Dashboard({ user }: Props) {
  const onNewEbook = async (book: ArrayBuffer) => {
    try {
      const buckets = await supabase.storage.listBuckets();
      console.log({ buckets });
      const { data, error } = await supabase.storage
        .from("ebooks")
        .upload(`${user.id}/${Date.now()}/ebook.epub`, book, {
          contentType: "application/epub+zip",
        });
      console.log({ error, data });
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <>
      <Navbar />
      <Container maxW="container.xl">
        <Flex justify="center">
          <Stack maxW="90%" w="4xl">
            <Upload onNewEbook={onNewEbook} />
          </Stack>
        </Flex>
      </Container>
    </>
  );
}

export const getServerSideProps = getUserSessionElseRedirect;

export default Dashboard;
