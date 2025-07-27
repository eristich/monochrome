import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from '@/page/auth/login-page'
import RegisterPage from '@/page/auth/register-page'
import AuthLayout from '@/layout/auth-layout'
import RequireAuthLayout from '@/layout/require-auth-layout'
import HomePage from '@/page/home-page'
import ForgotPasswordPage from '@/page/auth/forgot-password-page'
import SettingPage from '@/page/setting-page'
import MusicPage from '@/page/music-page'
import SettingExportDiffusionPage from '@/page/setting-export-diffusion-page'
import SettingChangePasswordPage from '@/page/setting-change-password-page'
import MusicDetailPage from '@/page/music-detail-page'
import NotFoundPage from '@/page/not-found-page'
import SettingReportPage from '@/page/setting-report-page'

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
