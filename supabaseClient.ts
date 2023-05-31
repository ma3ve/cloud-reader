import {
  createBrowserSupabaseClient,
  createServerSupabaseClient,
} from '@supabase/auth-helpers-nextjs'
import { Session } from '@supabase/supabase-js'

const supabase = createBrowserSupabaseClient()

export type ProtectRouteSession = {
  user: Session['user']
  initialSession: Session
}
export const getUserSessionElseRedirect = async (context: any) => {
  const supabaseServer = createServerSupabaseClient(context)
  const {
    data: { session },
  } = await supabaseServer.auth.getSession()
  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
      supabaseServer,
    }

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
    supabaseServer,
  }
}

export default supabase
