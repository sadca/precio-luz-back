import { Router } from 'express';
import express = require('express');

const router = Router();

router.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    ok: true,
  });
});

export default router;
