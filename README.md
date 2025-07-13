# Tegami 📮

> *Strangers today. Penpals tomorrow. Friends Forever.*

Tegami is a digital penpal platform that brings back the lost art of letter writing in the modern age. Connect with people around the world through heartfelt letters, voice recordings, and personal journaling - all while building meaningful friendships that transcend borders.

## ✨ Features

### 📝 Letter Exchange
- **Browse Penpals**: Discover potential friends from around the world
- **Write Invitations**: Craft personalized letters to connect with new people
- **Real-time Messaging**: Exchange letters with your penpals once connected
- **Letter Status Tracking**: See when your letters are in-transit, delivered, or read

### 🎵 Voice Vents (Audio Memories)
- **Record Audio**: Capture voice memos and audio memories
- **Cassette Wall**: Browse and play your collection of audio recordings
- **Audio Visualization**: Beautiful visual feedback while recording and playing

### 📖 Daily Journal
- **Personal Journaling**: Write daily entries to track your thoughts and experiences
- **Mood Tracking**: Record your mood and emotional intensity
- **Tag System**: Organize entries with custom tags
- **Private & Secure**: Your journal entries are completely private

### 🌍 Global Connections
- **Country Filtering**: Connect with people from specific countries
- **Age Range Matching**: Find penpals in your preferred age group
- **Writing Style Preferences**: Match with people who share your communication style

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for client-side routing
- **Tailwind CSS** for styling with custom vintage theme
- **Radix UI** for accessible component primitives
- **React Query** for server state management
- **Supabase** for authentication and real-time features

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Supabase** for database and storage
- **Multer** for file upload handling
- **Helmet** & **CORS** for security
- **Morgan** for request logging

### Database & Storage
- **Supabase** (PostgreSQL) for data persistence
- **Supabase Storage** for audio file management
- **Real-time subscriptions** for live updates

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/username/tegami.git
   cd tegami
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` files in both frontend and backend directories:

   **Frontend (.env)**
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   **Backend (.env)**
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   PORT=3001
   ```

4. **Database Setup**
   
   Set up your Supabase database with the required tables:
   - `profiles` - User profile information
   - `letters` - Public invitation letters
   - `penpals` - Penpal connections
   - `penpal_letters` - Private messages between penpals
   - `journal_entries` - Personal journal entries
   - `audio_memories` - Voice recordings metadata

5. **Start the development servers**
   
   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3001`.

## 📁 Project Structure

```
tegami/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Auth, etc.)
│   │   ├── lib/            # Utilities and API clients
│   │   └── pages/          # Page components
│   └── public/             # Static assets
├── backend/                 # Express.js backend API
│   └── src/
│       ├── routes/         # API route handlers
│       ├── types/          # TypeScript type definitions
│       └── utils/          # Backend utilities
└── README.md
```

## 🎨 Design Philosophy

Tegami embraces a vintage, handwritten aesthetic that evokes the nostalgia of traditional letter writing:

- **Vintage Typography**: Custom fonts that mimic handwriting and vintage typewriters
- **Paper Textures**: Subtle background textures that simulate aged paper
- **Ink Blots & Stamps**: Decorative elements that add character
- **Warm Color Palette**: Ink blues and sepia tones for a timeless feel

## 🔐 Authentication

Tegami uses Supabase Auth for secure user authentication:
- Email/password registration and login
- Google OAuth integration
- Secure session management
- Protected routes and API endpoints

## 📱 API Endpoints

### Letters
- `GET /api/letters` - Fetch public invitation letters
- `POST /api/letters` - Create a new invitation letter
- `PUT /api/letters/:id` - Update an existing letter

### Penpals
- `GET /api/penpals` - Get user's penpal connections
- `POST /api/penpals/connect` - Send a connection request
- `GET /api/penpals/letters` - Fetch penpal correspondence
- `POST /api/penpals/letters` - Send a letter to a penpal

### Journal
- `GET /api/journal` - Get user's journal entries
- `POST /api/journal` - Create a new journal entry
- `PUT /api/journal/:id` - Update a journal entry
- `DELETE /api/journal/:id` - Delete a journal entry

### Audio
- `GET /api/audio` - Get user's audio memories
- `POST /api/audio` - Upload a new audio recording
- `DELETE /api/audio/:id` - Delete an audio memory

## 🤝 Contributing

We welcome contributions to Tegami! Please feel free to submit issues, feature requests, or pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the timeless art of letter writing
- Built with love for meaningful human connections
- Special thanks to the open-source community

---

*Made with ❤️ for bringing people together, one letter at a time.*