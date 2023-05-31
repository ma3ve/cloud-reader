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

type Props = {
  ebook: Ebook
}

function BookDisplay({ ebook }: Props) {
  return (
    <Stack className="bookDisplay" w="52" m={5}>
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
            <MenuItem icon={<AiOutlineDelete />}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </Stack>
    </Stack>
  )
}

export default BookDisplay
