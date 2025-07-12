import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="letter-paper max-w-md w-full mx-4 text-center">
        <h1 className="text-4xl font-script text-ink mb-4">Lost Letter</h1>
        <p className="font-handwriting text-ink-blue mb-6">
          This page seems to have gotten lost in the mail...
        </p>
        <Button asChild className="envelope-card">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}