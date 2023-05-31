import { Button, Icon, Input, Stack, Text } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { AiOutlineCloudUpload } from 'react-icons/ai'

type Props = {
  onNewEbook: (ebook: ArrayBuffer) => void
  onlyUpload?: boolean
}

function Upload({ onNewEbook, onlyUpload }: Props) {
  const parse = (acceptedFiles: File[]) =>
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = async () => {
        const binaryStr = reader.result
        if (!binaryStr || typeof binaryStr == 'string') return
        onNewEbook(binaryStr)
      }
      reader.readAsArrayBuffer(file)
    })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    parse(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  })

  return onlyUpload ? (
    <>
      <Stack>
        <input
          type="file"
          id="upload"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (!e.target.files) return
            parse(Array.from(e.target.files))
          }}
        />
        <label htmlFor="upload">
          <Button as="span" colorScheme="green" float="right">
            Upload a Book
          </Button>
        </label>
      </Stack>
    </>
  ) : (
    <Stack {...getRootProps()} w="full" h="full">
      <input {...getInputProps()} />
      <Stack border="2px solid green" textAlign="center" padding={'20'}>
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
    </Stack>
  )
}

export default Upload
