import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import linkRoutes from './routes/links.js';
import { redirectToUrl } from './controllers/linkController.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.get('/:slug', redirectToUrl);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
