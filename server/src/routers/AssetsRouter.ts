import { Router } from 'express';

export const AssetsRouter = Router();

AssetsRouter.get('/user', async (_, res) => {
  res.json({ success: true });
});

AssetsRouter.get('/corporation', (_, res) => {
  res.json({ success: true });
});
