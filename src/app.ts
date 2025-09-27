import express from 'express';
import tournamentRoutes from './routes/tournamentRoutes';

const app = express();

app.use(express.json());

app.use('/api/tournaments', tournamentRoutes);

export default app;
