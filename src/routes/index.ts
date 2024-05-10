import express, { Request, Response } from 'express';

import authRoute from "../modules/auth/AuthRoute";



const router = express.Router();



router.use('/auth', authRoute);

router.get('/healthz', (req: Request, res: Response) => {
	res.status(200).json({ Status: 'OK' });
});

export default router;
