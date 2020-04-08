import { Router } from 'express';
import express = require('express');

const router = Router();

router.post('/login', (req: express.Request, res: express.Response) => {
  res.json({
    ok: true,
  });
});

router.post('/register', (req: express.Request, res: express.Response) => {
  res.json({
    ok: true,
  });
});

router.post('/changepass', (req: express.Request, res: express.Response) => {
  res.json({
    ok: true,
  });
});

router.post('/remember', (req: express.Request, res: express.Response) => {
  res.json({
    ok: true,
  });
});

export default router;
