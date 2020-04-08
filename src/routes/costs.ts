import { Router } from 'express';
import MySQL from '../mysql/mysql';
import express = require('express');

const router = Router();

router.post('/', (req: express.Request, res: express.Response) => {
  res.json({
    ok: true
  });
});

export default router;
