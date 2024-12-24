import express from 'express';
import adminRoutes from './modules/admin/admin.routes';
import campaignRoutes from './modules/campaign/campaign.routes';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Initialize express app
const app = express();

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Runes v2 API',
      version: '1.0.0',
      description: 'This API allows you to manage admin users for the system.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: [
    './modules/admin/admin.routes.ts', // Path to your route files where the Swagger comments are located
    './modules/admin/admin.yml', // Additional YAML file for Swagger docs
  ],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Log Swagger specs for debugging
console.log(swaggerDocs);

// Use Swagger UI to serve documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Body Parser middleware
app.use(express.json());

// Define Routes
app.use('/admins', adminRoutes);
app.use('/campaigns', campaignRoutes);

export default app;
