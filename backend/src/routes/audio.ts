import { Router } from 'express'
import { supabase } from '../utils/supabase'
import { AudioMemory } from '../types'

const router = Router()

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

// POST /api/audio - Create new audio memory
router.post('/', async (req, res) => {
  try {
    const { user_id, title, description, audio_url, duration } = req.body

    const { data, error } = await supabase
      .from('audio_memories')
      .insert({
        user_id,
        title,
        description,
        audio_url,
        duration
      })
      .select()
      .single()

    if (error) throw error
    res.status(201).json(data)
  } catch (error) {
    console.error('Error creating audio memory:', error)
    res.status(500).json({ error: 'Failed to create audio memory' })
  }
})

// DELETE /api/audio/:id - Delete audio memory
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('audio_memories')
      .delete()
      .eq('id', id)

    if (error) throw error
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting audio memory:', error)
    res.status(500).json({ error: 'Failed to delete audio memory' })
  }
})

export default router