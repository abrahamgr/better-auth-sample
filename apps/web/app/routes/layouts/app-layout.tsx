import { Container } from '@workspace/ui'
import { Outlet } from 'react-router'

export default function AppLayout() {
  return (
    <Container>
      <Outlet />
    </Container>
  )
}
