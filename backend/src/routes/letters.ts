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

export default router