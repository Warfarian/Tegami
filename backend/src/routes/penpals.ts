import { Router } from 'express'
import { supabase } from '../utils/supabase'
import { Penpal, PenpalLetter } from '../types'

const router = Router()

// GET /api/penpals/:userId - Get user's penpals
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const { data, error } = await supabase
      .from('penpals')
      .select(`
        *,
        user1:profiles!penpals_user1_id_fkey(full_name, country, writing_style),
        user2:profiles!penpals_user2_id_fkey(full_name, country, writing_style)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('status', 'accepted')

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error fetching penpals:', error)
    res.status(500).json({ error: 'Failed to fetch penpals' })
  }
})

// GET /api/penpals/:userId/letters - Get penpal letters for user
router.get('/:userId/letters', async (req, res) => {
  try {
    const { userId } = req.params
    const { type } = req.query // 'inbox' or 'outbox'

    let query = supabase
      .from('penpal_letters')
      .select('*')
      .order('created_at', { ascending: false })

    if (type === 'inbox') {
      query = query.eq('to_user_id', userId)
    } else if (type === 'outbox') {
      query = query.eq('from_user_id', userId)
    } else {
      query = query.or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
    }

    const { data, error } = await query

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error fetching penpal letters:', error)
    res.status(500).json({ error: 'Failed to fetch penpal letters' })
  }
})

// POST /api/penpals/letters - Send letter to penpal
router.post('/letters', async (req, res) => {
  try {
    const { from_user_id, to_user_id, content } = req.body

    const { data, error } = await supabase
      .from('penpal_letters')
      .insert({
        from_user_id,
        to_user_id,
        content,
        status: 'in-transit',
        delivery_time: new Date(Date.now() + 120000).toISOString() // 2 minutes delay
      })
      .select()
      .single()

    if (error) throw error
    res.status(201).json(data)
  } catch (error) {
    console.error('Error sending letter:', error)
    res.status(500).json({ error: 'Failed to send letter' })
  }
})

export default router