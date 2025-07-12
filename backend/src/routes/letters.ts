import { Router } from 'express'
import { supabase } from '../utils/supabase'
import { Letter } from '../types'

const router = Router()

// GET /api/letters - Get all public letters
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error fetching letters:', error)
    res.status(500).json({ error: 'Failed to fetch letters' })
  }
})

// GET /api/letters/user/:userId - Get user's own letter
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No letter found
        return res.status(404).json({ error: 'No letter found for user' })
      }
      throw error
    }
    res.json(data)
  } catch (error) {
    console.error('Error fetching user letter:', error)
    res.status(500).json({ error: 'Failed to fetch user letter' })
  }
})

// POST /api/letters - Create new letter
router.post('/', async (req, res) => {
  try {
    const { content, country, age_range, writing_style, user_id } = req.body

    const { data, error } = await supabase
      .from('letters')
      .insert({
        user_id,
        content,
        country,
        age_range,
        writing_style,
        author_name: 'Anonymous'
      })
      .select()
      .single()

    if (error) throw error
    res.status(201).json(data)
  } catch (error) {
    console.error('Error creating letter:', error)
    res.status(500).json({ error: 'Failed to create letter' })
  }
})

// PUT /api/letters/:id - Update existing letter
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { content, country, age_range, writing_style, user_id } = req.body

    // Verify the letter belongs to the user
    const { data: existingLetter, error: fetchError } = await supabase
      .from('letters')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    if (existingLetter.user_id !== user_id) {
      return res.status(403).json({ error: 'Not authorized to update this letter' })
    }

    const { data, error } = await supabase
      .from('letters')
      .update({
        content,
        country,
        age_range,
        writing_style
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error updating letter:', error)
    res.status(500).json({ error: 'Failed to update letter' })
  }
})

export default router