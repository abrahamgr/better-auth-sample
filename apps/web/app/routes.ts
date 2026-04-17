import {
  index,
  layout,
  type RouteConfig,
  route,
} from '@react-router/dev/routes'

export default [
  layout('./routes/layouts/marketing-layout.tsx', [index('./routes/home.tsx')]),
  layout('./routes/layouts/auth-layout.tsx', [
    route('login', './routes/login.tsx'),
    route('signup', './routes/signup.tsx'),
    route('forgot-password', './routes/forgot-password.tsx'),
    route('reset-password', './routes/reset-password.tsx'),
  ]),
  layout('./routes/layouts/app-layout.tsx', [
    route('profile', './routes/profile.tsx'),
  ]),
  route('logout', './routes/logout.tsx'),
  route('api/auth/*', './routes/api.auth.$.ts'),
] satisfies RouteConfig
