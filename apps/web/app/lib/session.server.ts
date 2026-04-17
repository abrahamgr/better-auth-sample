import { redirect } from 'react-router'

import { getServerSession } from './auth.server'

export async function requireSession(request: Request) {
  const session = await getServerSession(request)

  if (!session) {
    throw redirect('/login')
  }

  return session
}
