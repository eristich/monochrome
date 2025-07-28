import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from '@/page/auth/login-page'
import RegisterPage from '@/page/auth/register-page'
import AuthLayout from '@/layout/auth-layout'
import RequireAuthLayout from '@/layout/require-auth-layout'
import ForgotPasswordPage from '@/page/auth/forgot-password-page'
import SettingPage from '@/page/setting/setting-page'
import MusicPage from '@/page/main/music-page'
import SettingChangePasswordPage from '@/page/setting/setting-change-password-page'
// import SettingExportDiffusionPage from '@/page/setting/setting-export-diffusion-page'
// import HomePage from '@/page/main/home-page'
// import MusicDetailPage from '@/page/main/music-detail-page'
// import NotFoundPage from '@/page/not-found-page'
// import SettingReportPage from '@/page/setting/setting-report-page'

function HomePage() {
  return <div>HomePage</div>
}

function SettingReportPage() {
  return <div>SettingReportPage</div>
}

function SettingExportDiffusionPage() {
  return <div>SettingExportDiffusionPage</div>
}

function MusicDetailPage() {
  return <div>MusicDetailPage</div>
}

function NotFoundPage() {
  return <div>NotFoundPage</div>
}

const router = createBrowserRouter([
  {
    path: "/app",
    children: [
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
          { path: "forgot-password", element: <ForgotPasswordPage /> },
        ],
      },
      {
        element: <RequireAuthLayout />, // Toutes les routes suivantes sont protégées
        children: [
          { path: "home", element: <HomePage /> },
          { path: "music", element: <MusicPage /> },
          { path: "music/:id", element: <MusicDetailPage /> },
          { path: "setting", element: <SettingPage /> },
          { path: "setting/report", element: <SettingReportPage /> },
          { path: "setting/change-password", element: <SettingChangePasswordPage /> },
          { path: "setting/export-diffusion", element: <SettingExportDiffusionPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
