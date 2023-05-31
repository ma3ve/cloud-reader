import { SupabaseClient } from '@supabase/supabase-js'
import { toast } from 'react-toastify'
import { Ebook } from './database'

export const blobUrlToArrayBuffer = async (url: string) => {
  const res = await fetch(url)
  const blob = await res.blob()
  return blob.arrayBuffer()
}

export const showError = (message: string) => {
  toast.error(message)
}

export const convertFilePathToUrl = async (
  ebooks: Ebook[],
  supabase: SupabaseClient
) => {
  const resources: string[] = []

  ebooks.forEach((ebook) => {
    resources.push(ebook.book, ebook.cover)
  })
  const { data: urls, error } = await supabase.storage
    .from('ebooks')
    .createSignedUrls(resources, 60 * 60 * 24)
  if (urls) {
    urls.forEach((url, index) => {
      if (index % 2 === 0) {
        ebooks[index / 2].book = url.signedUrl || ''
      } else {
        ebooks[(index - 1) / 2].cover = url.signedUrl || ''
      }
    })
  }

  return {
    ebooks,
    error,
  }
}
