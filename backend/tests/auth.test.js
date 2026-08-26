const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let Company;
let User;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  process.env.MONGO_URI = mongoUri;
  process.env.JWT_SECRET = 'test-secret';
  process.env.NODE_ENV = 'test';

  app = require('../src/server');
  Company = require('../src/models/Company');
  User = require('../src/models/User');

  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await Company.deleteMany({});
  await User.deleteMany({});
});

describe('Authentication API', () => {
  it('registers a company and creates the shop owner account', async () => {
    const payload = {
      companyName: 'Aliyah Auto Parts',
      ownerName: 'Abebe Bekele',
      email: 'owner@aliyahparts.com',
      password: 'Password123'
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(payload)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(payload.email);
    expect(response.body.data.company.name).toBe(payload.companyName);
    expect(response.body.data.token).toBeTruthy();

    const dbCompany = await Company.findOne({ name: payload.companyName });
    const dbUser = await User.findOne({ email: payload.email });

    expect(dbCompany).not.toBeNull();
    expect(dbUser).not.toBeNull();
    expect(dbUser.companyId.toString()).toBe(dbCompany._id.toString());
    expect(dbUser.role).toBe('SHOP_OWNER');
  });

  it('logs in an existing user and returns JWT token', async () => {
    const company = await Company.create({
      name: 'Test Company',
      status: 'ACTIVE',
      contactEmail: 'support@testcompany.com'
    });

    await User.create({
      companyId: company._id,
      fullName: 'Test Owner',
      email: 'owner@testcompany.com',
      password: 'Password123',
      role: 'SHOP_OWNER'
    });

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'owner@testcompany.com',
        password: 'Password123'
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeTruthy();
    expect(response.body.data.user.email).toBe('owner@testcompany.com');
  });

  it('rejects invalid login credentials', async () => {
    const company = await Company.create({
      name: 'Test Company',
      status: 'ACTIVE',
      contactEmail: 'support@testcompany.com'
    });

    await User.create({
      companyId: company._id,
      fullName: 'Test Owner',
      email: 'owner@testcompany.com',
      password: 'Password123',
      role: 'SHOP_OWNER'
    });

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'owner@testcompany.com',
        password: 'WrongPassword123'
      })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/invalid|incorrect|password/i);
  });
});
