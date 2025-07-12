import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Mail, Lock, User } from 'lucide-react'

export default function Login() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const { signIn, signUp, signInWithGoogle, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      if (mode === 'login') {
        await signIn(email, password)
        navigate('/dashboard')
      } else {
        await signUp(email, password)
        setMessage('Check your email for a confirmation link!')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setMessage('')
    
    try {
      await signInWithGoogle()
      // Note: Google OAuth will redirect, so no need to navigate here
    } catch (err: any) {
      setError(err.message || 'An error occurred with Google sign-in')
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 letter-writing-background">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Button 
            asChild
            variant="ghost" 
            className="font-handwriting text-ink-blue hover:text-ink"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back Home
            </Link>
          </Button>
        </div>

        <div className="letter-paper">
          <h1 className="text-3xl font-script text-ink mb-6 text-center">
            {mode === 'login' ? 'Welcome Back' : 'Join Tegami'}
          </h1>
          
          <p className="font-handwriting text-ink-blue text-center mb-8">
            {mode === 'login' 
              ? 'Sign in to continue your penpal journey' 
              : 'Create an account to start writing letters'
            }
          </p>

          {error && (
            <div className="mb-4 p-3 bg-stamp-red/10 border border-stamp-red/20 rounded-md">
              <p className="font-handwriting text-stamp-red text-sm">{error}</p>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="font-handwriting text-green-700 text-sm">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-handwriting text-ink-blue mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="font-handwriting"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-handwriting text-ink-blue mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="font-handwriting"
                required
              />
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full envelope-card hover:rotate-1 transition-transform duration-300"
            >
              <User className="w-4 h-4 mr-2" />
              {loading 
                ? (mode === 'login' ? 'Signing In...' : 'Creating Account...') 
                : (mode === 'login' ? 'Sign In' : 'Create Account')
              }
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ink-blue/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-paper px-4 font-handwriting text-ink-blue/60">or</span>
              </div>
            </div>

            <Button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant="outline"
              className="w-full envelope-card hover:rotate-1 transition-transform duration-300"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Signing In...' : 'Continue with Google'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="font-handwriting text-ink-blue hover:text-ink transition-colors"
            >
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}