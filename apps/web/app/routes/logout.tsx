import { APIError } from 'better-auth/api'
import { redirect } from 'react-router'
import { auth } from '../lib/auth.server'
import { mergeHeaders } from '../lib/http.server'
import { logger } from '../lib/logger.server'
import type { Route } from './+types/logout'

export async function action({ request }: Route.ActionArgs) {
  try {
    const { headers } = await auth.api.signOut({
      headers: request.headers,
      returnHeaders: true,
    })

    return redirect('/login', {
      headers: mergeHeaders(headers),
    })
  } catch (error) {
    if (error instanceof APIError) {
      logger.warn({ status: error.status }, 'Logout failed.')
      return redirect('/login')
    }

    throw error
  }
}

export default function Logout() {
  return null
}
