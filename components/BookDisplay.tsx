import { Ebook } from '@/database'
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import Image from 'next/image'
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineMore,
  AiOutlineRead,
} from 'react-icons/ai'
import Spinner from './Spinner'

type Props = {
  ebook: Ebook
  onDelete: (ebook: Ebook) => Promise<void>
  // onRead: (ebook: Ebook) => void
}

function BookDisplay({ ebook, onDelete }: Props) {
  const [loading, setLoading] = React.useState(false)
  const deleteBook = () => {
    setLoading(true)
    onDelete(ebook)
      .then(() => console.log('deleted'))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }

  return (
    <Stack className="bookDisplay" w="52" m={5}>
      <Spinner loading={loading}>
        <Stack h="full" _hover={{ cursor: 'pointer' }}>
          <Image
            src={ebook.cover}
            alt={ebook.title}
            className="bookImage"
            width="300"
            height="500"
          />
        </Stack>
        <Stack
          display="flex"
          justify="space-between"
          wrap="nowrap"
          direction="row"
        >
          <Stack>
            <Text
              fontWeight="bold"
              textOverflow="ellipsis"
              overflow="hidden"
              noOfLines={1}
            >
              {ebook.title}
            </Text>
            <Text
              color="GrayText"
              marginTop="0px"
              className="authorName"
              lineHeight="shorter"
              textOverflow="ellipsis"
              noOfLines={1}
            >
              {ebook.author}
            </Text>
          </Stack>
          <Menu isLazy direction="ltr">
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<AiOutlineMore />}
              variant="ghost"
            />
            <MenuList>
              <MenuItem icon={<AiOutlineRead />}>Read</MenuItem>
              <MenuItem icon={<AiOutlineEdit />}>Edit</MenuItem>
              <MenuItem icon={<AiOutlineDelete />} onClick={deleteBook}>
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </Spinner>
    </Stack>
  )
}

export default BookDisplay
