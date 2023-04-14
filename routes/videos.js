import express from 'express';
import { addVideo, updateVideo, deleteVideo, sub, addView, trend, random, getVideo, getByTags, search, getBySpecialTag } from '../controllers/video.js';
import { verifyToken } from '../verifyToken.js';

const router = express.Router();
//  route: /api/videos

router.post('/', verifyToken, addVideo);
router.put('/:id', verifyToken, updateVideo);
router.delete('/:id', verifyToken, deleteVideo);
router.put('/view/:id', addView);
router.get('/find/:id', getVideo);
router.get('/random', random);
router.get('/trend', trend);
router.get('/sub', verifyToken, sub);
router.get('/tags', getByTags);
router.post('/special', getBySpecialTag);
router.get('/search', search);

export default router; 