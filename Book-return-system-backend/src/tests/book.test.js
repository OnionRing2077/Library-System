const request = require('supertest');
const app = require('../../server'); // อ้างอิงไปที่ server.js

describe('Book API Endpoints', () => {
  
  // Test Case 1: ทดสอบการดึงข้อมูลหนังสือ (GET)
  it('should get all books', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toEqual(200); // คาดหวัง code 200 (OK)
    expect(Array.isArray(res.body)).toBe(true); // คาดหวังข้อมูลเป็น Array
  });

  // Test Case 2: ทดสอบ Validation เมื่อข้อมูลไม่ครบ (POST)
  it('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({ author: 'Unknown' }); // ส่งไปแค่ผู้แต่ง ขาดชื่อเรื่อง
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Title and Author are required');
  });

});