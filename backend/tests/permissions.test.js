const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let Company;
let User;
let Category;
let mongoServer;
let generateToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create(
    process.env.MONGOMS_SYSTEM_BINARY
      ? { instance: { storageEngine: 'wiredTiger' } }
      : {}
  );
  const mongoUri = mongoServer.getUri();
  process.env.MONGO_URI = mongoUri;
  process.env.JWT_SECRET = 'permissions-test-secret';
  process.env.NODE_ENV = 'test';

  app = require('../src/server');
  Company = require('../src/models/Company');
  User = require('../src/models/User');
  Category = require('../src/models/Category');
  ({ generateToken } = require('../src/utils/jwt'));
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

beforeEach(async () => {
  await Promise.all([
    Company.deleteMany({}),
    User.deleteMany({}),
    Category.deleteMany({})
  ]);
});

const createCompany = (name = 'Permission Test Company') =>
  Company.create({
    name,
    status: 'ACTIVE',
    contactEmail: `${name.replace(/\s/g, '').toLowerCase()}@example.com`
  });

const createUser = (companyId, data = {}) =>
  User.create({
    companyId,
    name: data.name || 'Test Staff',
    fullName: data.name || 'Test Staff',
    email: data.email || `staff-${new mongoose.Types.ObjectId()}@example.com`,
    password: 'Password123',
    role: data.role || 'STAFF',
    permissions: data.permissions || [],
    ...(data.isActive === undefined ? {} : { isActive: data.isActive }),
    ...(data.status === undefined ? {} : { status: data.status })
  });

const authorization = (user) => `Bearer ${generateToken(user)}`;

describe('Permission-protected API routes', () => {
  it('returns 401 for unauthenticated requests and 403 for missing permissions', async () => {
    await request(app).get('/api/v1/categories').expect(401);

    const company = await createCompany();
    const staff = await createUser(company._id);
    await request(app)
      .get('/api/v1/categories')
      .set('Authorization', authorization(staff))
      .expect(403);
  });

  it('allows category viewing but blocks category creation without its permission', async () => {
    const company = await createCompany();
    const staff = await createUser(company._id, {
      permissions: ['categories.view']
    });

    await request(app)
      .get('/api/v1/categories')
      .set('Authorization', authorization(staff))
      .expect(200);

    await request(app)
      .post('/api/v1/categories')
      .set('Authorization', authorization(staff))
      .send({ categoryName: 'Not allowed' })
      .expect(403);
  });

  it('does not allow product metadata permission to adjust stock quantities', async () => {
    const company = await createCompany();
    const staff = await createUser(company._id, {
      permissions: ['products.update']
    });

    await request(app)
      .put(`/api/v1/products/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', authorization(staff))
      .send({ quantity: 10 })
      .expect(403);
  });

  it('prevents staff from assigning permissions or changing account status without authorization', async () => {
    const company = await createCompany();
    const staff = await createUser(company._id, {
      permissions: ['staff.update']
    });
    const target = await createUser(company._id, {
      email: 'target@example.com'
    });

    await request(app)
      .put(`/api/v1/users/${target.id}`)
      .set('Authorization', authorization(staff))
      .send({ permissions: ['products.delete'] })
      .expect(403);

    await request(app)
      .put(`/api/v1/users/${target.id}`)
      .set('Authorization', authorization(staff))
      .send({ isActive: false })
      .expect(403);

    const unchangedTarget = await User.findById(target.id);
    expect(unchangedTarget.isActive).toBe(true);
  });

  it('applies deactivation to existing JWTs and permits the same token after reactivation', async () => {
    const company = await createCompany();
    const owner = await createUser(company._id, {
      email: 'owner@example.com',
      role: 'SHOP_OWNER'
    });
    const staff = await createUser(company._id, {
      email: 'active-staff@example.com',
      permissions: ['categories.view']
    });
    const staffToken = authorization(staff);
    const ownerToken = authorization(owner);

    await request(app)
      .put(`/api/v1/users/${staff.id}`)
      .set('Authorization', ownerToken)
      .send({ isActive: false })
      .expect(200);

    await request(app)
      .get('/api/v1/categories')
      .set('Authorization', staffToken)
      .expect(403);

    await request(app)
      .put(`/api/v1/users/${staff.id}`)
      .set('Authorization', ownerToken)
      .send({ isActive: true })
      .expect(200);

    await request(app)
      .get('/api/v1/categories')
      .set('Authorization', staffToken)
      .expect(200);
  });

  it('keeps category records scoped to the authenticated company', async () => {
    const firstCompany = await createCompany('First Company');
    const secondCompany = await createCompany('Second Company');
    await Category.create({
      companyId: firstCompany._id,
      categoryName: 'First company category'
    });
    await Category.create({
      companyId: secondCompany._id,
      categoryName: 'Second company category'
    });
    const staff = await createUser(firstCompany._id, {
      permissions: ['categories.view']
    });

    const response = await request(app)
      .get('/api/v1/categories')
      .set('Authorization', authorization(staff))
      .expect(200);

    const categories = response.body.data;
    expect(JSON.stringify(categories)).toContain('First company category');
    expect(JSON.stringify(categories)).not.toContain('Second company category');
  });
});
