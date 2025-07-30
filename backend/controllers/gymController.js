import pool from '../config/database.js';

export const getAllGyms = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT g.*, r.id as room_id, r.room_type, r.price_per_month, r.amenities, r.images
      FROM gyms g
      LEFT JOIN rooms r ON g.id = r.gym_id
      WHERE r.is_available = true
    `);
    
    // Transform data to group rooms by gym
    const gymsMap = new Map();
    result.rows.forEach(row => {
      if (!gymsMap.has(row.id)) {
        gymsMap.set(row.id, {
          ...row,
          rooms: []
        });
      }
      if (row.room_id) {
        gymsMap.get(row.id).rooms.push({
          id: row.room_id,
          room_type: row.room_type,
          price_per_month: row.price_per_month,
          amenities: row.amenities,
          images: row.images
        });
      }
    });
    
    res.json([...gymsMap.values()]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGymDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const gymResult = await pool.query('SELECT * FROM gyms WHERE id = $1', [id]);
    const roomsResult = await pool.query('SELECT * FROM rooms WHERE gym_id = $1 AND is_available = true', [id]);
    
    if (gymResult.rows.length === 0) {
      return res.status(404).json({ error: 'Gym not found' });
    }
    
    res.json({
      ...gymResult.rows[0],
      rooms: roomsResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};