import { Link } from 'react-router-dom'
import { Chrome as Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-7xl font-extrabold gradient-text">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">
        <Home className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  )
}
