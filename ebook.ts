import { SupabaseClient, User } from '@supabase/supabase-js'
import ePub from 'epubjs'
import { Ebook } from './database'
import { blobUrlToArrayBuffer, convertFilePathToUrl } from './utils'
import supabase from './supabaseClient'

export const getBooks = async (supabaseClient: SupabaseClient = supabase) => {
  const { data, error } = await supabaseClient.from('Ebooks').select(`*`)
  if (data) {
    return convertFilePathToUrl(data as Ebook[], supabaseClient)
  }
  return { ebooks: [], error }
}

export const createBook = async (book: ArrayBuffer, user: User) => {
  const promiseBook = supabase.storage
    .from('ebooks')
    .upload(`${user.id}/${Date.now()}.epub`, book, {
      contentType: 'application/epub+zip',
    })
  const epub = ePub(book)
  const cover = await epub.coverUrl()
  const metaData = await epub.loaded.metadata
  const author = metaData.creator || 'unknown'
  const title = metaData.title || 'unknown'
  let promiseCover: Promise<any> | undefined = undefined
  if (cover) {
    const coverArrayBuffer = await blobUrlToArrayBuffer(cover)
    promiseCover = supabase.storage
      .from('ebooks')
      .upload(`${user.id}/${Date.now()}_cover.jpg`, coverArrayBuffer, {
        contentType: 'image/jpeg',
      })
  }
  const values = await Promise.all([promiseBook, promiseCover])
  const bookUrl = values[0].data?.path
  const coverUrl = values[1]?.data?.path
  const { status, error, data } = await supabase
    .from('Ebooks')
    .insert({
      book: bookUrl,
      cover: coverUrl,
      author,
      title,
      user: user.id,
    })
    .select()
  if (error)
    return {
      error,
      data: undefined,
    }
  const { ebooks, error: urlsError } = await convertFilePathToUrl(
    data as Ebook[],
    supabase
  )
  if (urlsError) return { error: urlsError, data: undefined }
  return {
    error: undefined,
    data: ebooks,
  }
}

export const deleteBook = async (book: Ebook) => {
  const { error } = await supabase.storage
    .from('ebooks')
    .remove([book.book, book.cover])
  if (error) return { error, data: undefined }
  const { error: deleteError } = await supabase
    .from('Ebooks')
    .delete()
    .eq('id', book.id)
  if (deleteError) return { error: deleteError, data: undefined }
  return { error: undefined, data: book }
}
