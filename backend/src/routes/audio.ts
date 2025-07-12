import { Router } from 'express'
import multer from 'multer'
import { supabase } from '../utils/supabase'
import { AudioMemory } from '../types'

const router = Router()

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true)
    } else {
      cb(new Error('Only audio files are allowed'))
    }
  }
})

// GET /api/audio/:userId - Get user's audio memories
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const { data, error } = await supabase
      .from('audio_memories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error fetching audio memories:', error)
    res.status(500).json({ error: 'Failed to fetch audio memories' })
  }
})

// POST /api/audio - Create new audio memory with file upload
router.post('/', upload.single('audio'), async (req, res) => {
  try {
    const { user_id, title, description, duration } = req.body
    const audioFile = req.file

    if (!audioFile) {
      return res.status(400).json({ error: 'Audio file is required' })
    }

    // Generate unique filename
    const fileExtension = audioFile.originalname.split('.').pop() || 'webm'
    const fileName = `${user_id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`
    const filePath = `audio-memories/${fileName}`

    // Upload file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio-memories')
      .upload(filePath, audioFile.buffer, {
        contentType: audioFile.mimetype,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return res.status(500).json({ error: 'Failed to upload audio file' })
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('audio-memories')
      .getPublicUrl(filePath)

    // Save audio memory metadata to database
    const { data, error } = await supabase
      .from('audio_memories')
      .insert({
        user_id,
        title,
        description,
        audio_url: urlData.publicUrl,
        duration: duration ? parseInt(duration) : null
      })
      .select()
      .single()

    if (error) {
      // If database insert fails, clean up uploaded file
      await supabase.storage
        .from('audio-memories')
        .remove([filePath])
      throw error
    }

    res.status(201).json(data)
  } catch (error) {
    console.error('Error creating audio memory:', error)
    res.status(500).json({ error: 'Failed to create audio memory' })
  }
})

// DELETE /api/audio/:id - Delete audio memory and file
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // First get the audio memory to find the file URL
    const { data: audioMemory, error: fetchError } = await supabase
      .from('audio_memories')
      .select('audio_url')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    // Delete from database
    const { error: deleteError } = await supabase
      .from('audio_memories')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    // Extract file path from URL and delete from storage
    if (audioMemory?.audio_url) {
      try {
        const url = new URL(audioMemory.audio_url)
        const pathParts = url.pathname.split('/')
        const filePath = pathParts.slice(-2).join('/') // Get 'audio-memories/filename'
        
        await supabase.storage
          .from('audio-memories')
          .remove([filePath])
      } catch (storageError) {
        console.error('Error deleting file from storage:', storageError)
        // Don't fail the request if storage deletion fails
      }
    }

    res.status(204).send()
  } catch (error) {
    console.error('Error deleting audio memory:', error)
    res.status(500).json({ error: 'Failed to delete audio memory' })
  }
})
export default router