
import express from 'express';
import { characters, postDay, time } from '../controllers/characters.js';

const router = express.Router();

router.get('/players', characters);
router.get('/time', time);
router.post('/time', postDay);

export default router;