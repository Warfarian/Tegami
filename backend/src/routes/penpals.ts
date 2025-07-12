import { Router } from 'express'
import { supabase } from '../utils/supabase'
import { Penpal, PenpalLetter } from '../types'

const router = Router()

// GET /api/penpals/:userId - Get user's penpals
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    // First get the penpal relationships
    const { data: penpals, error: penpalsError } = await supabase
      .from('penpals')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('status', 'accepted')

    if (penpalsError) throw penpalsError

    // Fetch user details from letters table for each penpal
    const enhancedPenpals = await Promise.all(penpals.map(async penpal => {
      // Get user1 details
      const { data: user1Letter } = await supabase
        .from('letters')
        .select('author_name, country, writing_style')
        .eq('user_id', penpal.user1_id)
        .single()
      
      // Get user2 details
      const { data: user2Letter } = await supabase
        .from('letters')
        .select('author_name, country, writing_style')
        .eq('user_id', penpal.user2_id)
        .single()
      
      return {
        ...penpal,
        user1: {
          full_name: user1Letter?.author_name || 'Penpal User',
          country: user1Letter?.country || 'Unknown',
          writing_style: user1Letter?.writing_style || 'Friendly'
        },
        user2: {
          full_name: user2Letter?.author_name || 'Penpal User',
          country: user2Letter?.country || 'Unknown',
          writing_style: user2Letter?.writing_style || 'Friendly'
        }
      }
    }))

    res.json(enhancedPenpals)
  } catch (error) {
    console.error('Error fetching penpals:', error)
    res.status(500).json({ error: 'Failed to fetch penpals' })
  }
})

// GET /api/penpals/:userId/requests - Get pending penpal requests
router.get('/:userId/requests', async (req, res) => {
  try {
    const { userId } = req.params

    const { data: requests, error } = await supabase
      .from('penpals')
      .select('*')
      .eq('user2_id', userId)
      .eq('status', 'pending')
      .order('connected_at', { ascending: false })

    if (error) throw error
    res.json(requests)
  } catch (error) {
    console.error('Error fetching penpal requests:', error)
    res.status(500).json({ error: 'Failed to fetch penpal requests' })
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

// POST /api/penpals - Create new penpal connection
router.post('/', async (req, res) => {
  try {
    const { user1_id, user2_id } = req.body

    // Check if connection already exists
    const { data: existingConnection, error: checkError } = await supabase
      .from('penpals')
      .select('*')
      .or(`and(user1_id.eq.${user1_id},user2_id.eq.${user2_id}),and(user1_id.eq.${user2_id},user2_id.eq.${user1_id})`)
      .single()

    if (checkError && checkError.code !== 'PGRST116') throw checkError

    if (existingConnection) {
      return res.status(409).json({ error: 'Penpal connection already exists' })
    }

    // Create new penpal connection request
    const { data, error } = await supabase
      .from('penpals')
      .insert({
        user1_id,
        user2_id,
        status: 'pending',
        connected_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    res.status(201).json(data)
  } catch (error) {
    console.error('Error creating penpal connection:', error)
    res.status(500).json({ error: 'Failed to create penpal connection' })
  }
})

// PUT /api/penpals/:id/accept - Accept penpal connection request
router.put('/:id/accept', async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body

    // Verify the user is the recipient of the request
    const { data: penpal, error: fetchError } = await supabase
      .from('penpals')
      .select('*')
      .eq('id', id)
      .eq('user2_id', userId)
      .eq('status', 'pending')
      .single()

    if (fetchError || !penpal) {
      return res.status(404).json({ error: 'Penpal request not found' })
    }

    // Accept the connection
    const { data, error } = await supabase
      .from('penpals')
      .update({ status: 'accepted' })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error accepting penpal request:', error)
    res.status(500).json({ error: 'Failed to accept penpal request' })
  }
})

// GET /api/penpals/request/:id/details - Get request details with user's invite letter
router.get('/request/:id/details', async (req, res) => {
  try {
    const { id } = req.params

    // Get the penpal request
    const { data: request, error: requestError } = await supabase
      .from('penpals')
      .select('*')
      .eq('id', id)
      .eq('status', 'pending')
      .single()

    if (requestError || !request) {
      return res.status(404).json({ error: 'Request not found' })
    }

    // Get the requester's invite letter
    const { data: letter, error: letterError } = await supabase
      .from('letters')
      .select('*')
      .eq('user_id', request.user1_id)
      .single()

    // Letter might not exist, that's okay
    const letterData = letterError ? null : letter

    res.json({ request, letter: letterData })
  } catch (error) {
    console.error('Error fetching request details:', error)
    res.status(500).json({ error: 'Failed to fetch request details' })
  }
})

export default router