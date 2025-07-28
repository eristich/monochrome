import { Outlet } from 'react-router-dom'
import UIMonochromeIcon from '../component/nano/ui-monochrome-icon'

export default function AuthLayout() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white px-5">
      <span className='h-18' />
      <UIMonochromeIcon
        aria-label="Icone monochrome"
        data-testid="auth-monochrome-icon"
      />
      <span className='h-12' />
      <Outlet />
    </div>
  )
}
