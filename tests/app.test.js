import request from 'supertest';
import app from '#src/app.js';

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return 200 for health check', async () => {
      const response = await request(app).get('/health');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'OK');
    });
  });

  describe('GET /api', () => {
    it('should return 200 for API endpoint', async () => {
      const response = await request(app).get('/api');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Acquisitions API is running!'
      );
    });
  });

  describe('GET /non-existent-route', () => {
    it('should return 404 for route not found', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message', 'Route not found');
    });
  });
});
