import { Router } from 'express'
import { supabase } from '../utils/supabase'
import { JournalEntry } from '../types'

const router = Router()

// GET /api/journal/:userId - Get user's journal entries
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error fetching journal entries:', error)
    res.status(500).json({ error: 'Failed to fetch journal entries' })
  }
})

// POST /api/journal - Create new journal entry
router.post('/', async (req, res) => {
  try {
    const { user_id, title, content, mood, mood_intensity, tags } = req.body

    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id,
        title,
        content,
        mood,
        mood_intensity,
        tags
      })
      .select()
      .single()

    if (error) throw error
    res.status(201).json(data)
  } catch (error) {
    console.error('Error creating journal entry:', error)
    res.status(500).json({ error: 'Failed to create journal entry' })
  }
})

// DELETE /api/journal/:id - Delete journal entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)

    if (error) throw error
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting journal entry:', error)
    res.status(500).json({ error: 'Failed to delete journal entry' })
  }
})

export default router