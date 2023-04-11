import Navbar from "@/components/Navbar";
import supabase, {
  getUserSessionElseRedirect,
  ProtectRouteSession,
} from "@/supabaseClient";
import React, { useState } from "react";
import Upload from "@/components/Upload";
import { Container, Flex, Stack } from "@chakra-ui/react";
import Spinner from "@/components/Spinner";
import ePub from "epubjs";
import { blobUrlToArrayBuffer } from "@/utils";

type Props = {} & ProtectRouteSession;

function Dashboard({ user }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onNewEbook = async (book: ArrayBuffer) => {
    try {
      setLoading(true);
      const promiseBook = supabase.storage
        .from("ebooks")
        .upload(`${user.id}/${Date.now()}/ebook.epub`, book, {
          contentType: "application/epub+zip",
        });

      const epub = ePub(book);
      const cover = await epub.coverUrl();
      const metaData = await epub.loaded.metadata;
      const author = metaData.creator;
      const title = metaData.title;
      let promiseCover: Promise<any> | undefined = undefined;
      if (cover) {
        const coverArrayBuffer = await blobUrlToArrayBuffer(cover);
        promiseCover = supabase.storage
          .from("ebooks")
          .upload(`${user.id}/${Date.now()}/cover.jpg`, coverArrayBuffer, {
            contentType: "image/jpeg",
          });
      }
      Promise.all([promiseBook, promiseCover])
        .then((values) => {
          const bookUrl = values[0].data?.path;
          const coverUrl = values[1]?.data?.path;
          return supabase.from("Ebooks").insert({
            book: bookUrl,
            cover: coverUrl,
            author,
            title,
            user: user.id,
          });
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => setLoading(false));
    } catch (error) {
      setError("something went wrong");
    }
  };
  return (
    <>
      <Navbar />
      <Container maxW="container.xl">
        <Spinner loading={loading}>
          <Flex justify="center">
            <Stack maxW="90%" w="4xl">
              <Upload onNewEbook={onNewEbook} />
            </Stack>
          </Flex>
        </Spinner>
      </Container>
    </>
  );
}

export const getServerSideProps = getUserSessionElseRedirect;

export default Dashboard;
