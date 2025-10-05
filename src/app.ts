import express from 'express';
import tournamentRoutes from './routes/tournamentRoutes';
import playerRoutes from './routes/playerRoutes';
import registrationRoutes from './routes/registrationRoutes';
import resultRoutes from './routes/resultRoutes';

const app = express();

app.use(express.json());

app.use('/api/tournaments', tournamentRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/results', resultRoutes);

export default app;
