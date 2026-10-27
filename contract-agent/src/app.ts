import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import profileRoutes from './agent.contract.profile.router';
import negotiationRoutes from './agent.contract.negotiation.router';
import consentRoutes from './agent.consent.router';
import swaggerDocument from '../docs/swagger.json';

const app : Application= express();

// Do not disclose the framework in the X-Powered-By header
app.disable('x-powered-by');
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/profile', profileRoutes);
app.use('/api/negotiation', negotiationRoutes);
app.use('/api/consent', consentRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-undef
  console.log(`Server started at port ${PORT}`);
  // eslint-disable-next-line no-undef
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
