import supabase from "@/supabaseClient";
import { Button, Icon, Input, Stack, Text } from "@chakra-ui/react";
import ePub from "epubjs";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";

type Props = {
  onNewEbook: (ebook: ArrayBuffer) => void;
};

function Upload({ onNewEbook }: Props) {
  const [url, setUrl] = React.useState("");
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        const binaryStr = reader.result;
        if (!binaryStr || typeof binaryStr == "string") return;
        onNewEbook(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <Stack {...getRootProps()} w="full" h="full">
      <input {...getInputProps()} />
      <Stack border="2px solid green" textAlign="center" padding={"20"}>
        <Input
          id="file-upload"
          type="file"
          name="fileUpload"
          accept="image/*"
          display="none"
        />
        <label htmlFor="file-upload" id="file-drag">
          <div>
            <Icon as={AiOutlineCloudUpload} w="28" h="28" color="green.500" />
            <Text>Select an EPub file or drag a file here</Text>
            <Button colorScheme="green">Select a file</Button>
          </div>
        </label>
      </Stack>
      <img src={url} />
    </Stack>
  );
}

export default Upload;
