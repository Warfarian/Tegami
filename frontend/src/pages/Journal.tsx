export default function Journal() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative" style={{backgroundImage: 'url(/books.JPG)'}}>
      <div className="absolute inset-0 bg-white bg-opacity-60"></div>
      <div className="letter-paper max-w-2xl w-full mx-4 relative z-10">
        <h1 className="text-3xl font-script text-ink mb-6 text-center">Daily Journal ✍️</h1>
        <p className="font-handwriting text-ink-blue text-center">
          Mood tracking and journaling coming soon...
        </p>
      </div>
    </div>
  )
}