import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function Index() {
  const { user } = useAuth()
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden landing-background">
      {/* Vintage decorations */}
      <div className="ink-blot top-20 left-20"></div>
      <div className="ink-blot top-40 right-32"></div>
      <div className="ink-blot bottom-32 left-1/4"></div>
      <div className="ink-blot bottom-20 right-20"></div>
      
      {/* Postage stamp decorations */}
      <div className="postage-stamps top-16 right-16 rotate-12"></div>
      <div className="postage-stamps bottom-24 left-12 -rotate-6"></div>
      <div className="postage-stamps top-1/3 left-8 rotate-45"></div>
      
      <div className="text-center space-y-8 max-w-2xl mx-auto px-4 relative z-20 landing-text">
        <h1 className="text-6xl md:text-8xl font-script text-ink mb-4">
          Tegami
        </h1>
        
        <p className="text-2xl md:text-3xl font-handwriting text-ink-blue mb-8">
          Strangers today. Penpals tomorrow.
        </p>
        
        <p className="text-lg text-ink-blue/80 max-w-lg mx-auto mb-12">
          A digital penpal platform that feels analog, warm, and nostalgic. 
          Experience the art of delayed messaging and meaningful connections.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild
            className="envelope-card hover:rotate-1 transition-transform duration-300 text-lg py-6 px-8"
          >
            <Link to="/write-invite">Browse Penpals</Link>
          </Button>
          
          <Button 
            asChild
            variant="outline"
            className="envelope-card hover:-rotate-1 transition-transform duration-300 text-lg py-6 px-8"
          >
            <Link to="/write-invite">Write Your Letter</Link>
          </Button>
        </div>
        
        <div className="mt-8">
          {user ? (
            <Link 
              to="/dashboard" 
              className="text-ink-blue hover:text-ink transition-colors font-handwriting text-lg underline"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="text-ink-blue hover:text-ink transition-colors font-handwriting text-lg underline"
            >
              Sign up or Login
            </Link>
          )}
        </div>
        
        <div className="mt-16 flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            asChild
            variant="ghost"
            className="envelope-card hover:rotate-1 transition-transform duration-300 font-handwriting text-lg py-3 px-6"
          >
            <Link to="/cassette">
              📼 Voice Vents
            </Link>
          </Button>
          <Button 
            asChild
            variant="ghost"
            className="envelope-card hover:-rotate-1 transition-transform duration-300 font-handwriting text-lg py-3 px-6"
          >
            <Link to="/journal">
              📝 Daily Journal
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}