import Navbar from '@/components/Navbar'
import supabase, {
  getUserSessionElseRedirect,
  ProtectRouteSession,
} from '@/supabaseClient'
import React, { useState, useEffect } from 'react'
import Upload from '@/components/Upload'
import { Container, Flex, HStack, Stack } from '@chakra-ui/react'
import Spinner from '@/components/Spinner'
import ePub from 'epubjs'
import { blobUrlToArrayBuffer, convertFilePathToUrl, showError } from '@/utils'
import { User, PostgrestError, SupabaseClient } from '@supabase/supabase-js'
import { Ebook } from '@/database'
import BookDisplay from '@/components/BookDisplay'
import { createBook, deleteBook, getBooks } from '@/ebook'

type Props = {
  ebooks: Ebook[]
  error?: PostgrestError
} & ProtectRouteSession

function Dashboard({ user, ebooks: Eebooks, error }: Props) {
  const [loading, setLoading] = useState(false)
  const [ebooks, setEbooks] = useState<Ebook[]>([])

  useEffect(() => {
    setEbooks(Eebooks)
  }, [Eebooks])

  useEffect(() => {
    if (error) showError(error.message)
  }, [error])

  const onNewEbook = async (book: ArrayBuffer) => {
    try {
      setLoading(true)
      const { data, error } = await createBook(book, user)
      if (error) return showError(error.message)
      setEbooks([...ebooks, ...data])
    } catch (error) {
      showError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (ebook: Ebook) => {
    try {
      await deleteBook(ebook)
      setEbooks(ebooks.filter((e) => e.id !== ebook.id))
    } catch (error) {
      showError('Something went wrong')
    }
  }

  return (
    <>
      <Navbar />
      <Container maxW="container.xl">
        <Upload onNewEbook={onNewEbook} onlyUpload />
        <Spinner loading={loading}>
          <Stack>
            {!ebooks.length && <Upload onNewEbook={onNewEbook} />}
            <Stack
              display="flex"
              flexDir="row"
              align="flex-end"
              justify="space-evenly"
              flexWrap="wrap"
              spacing={4}
            >
              {ebooks.map((ebook) => (
                <Stack key={ebook.id}>
                  <BookDisplay ebook={ebook} onDelete={onDelete} />
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Spinner>
      </Container>
    </>
  )
}

export const getServerSideProps = async (context: any) => {
  const { props, redirect, supabaseServer } = await getUserSessionElseRedirect(
    context
  )
  if (redirect) return { redirect }
  const { ebooks, error } = await getBooks(supabaseServer)
  return {
    props: {
      ...props,
      ebooks,
      error,
    },
  }
}

export default Dashboard
