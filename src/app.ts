import express from 'express';
import tournamentRoutes from './routes/tournamentRoutes';
import playerRoutes from './routes/playerRoutes';
import registrationRoutes from './routes/registrationRoutes';


import cashGameRoutes from './routes/cashGameRoutes';
import resultRoutes from './routes/resultRoutes';
import seasonRoutes from './routes/seasonRoutes';

const app = express();

app.use(express.json());

app.use('/api/tournaments', tournamentRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/results', resultRoutes);

app.use('/api/cash-games', cashGameRoutes);

app.use('/api/seasons', seasonRoutes);

export default app;
