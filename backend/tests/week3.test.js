const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

jest.setTimeout(30000);

let app;
let mongoServer;
let Company;
let User;
let Category;
let Supplier;
let Product;
let Purchase;
let StockMovement;

const createToken = (user) => jwt.sign({
  id: user._id.toString(),
  email: user.email,
  companyId: user.companyId.toString(),
  role: user.role,
  fullName: user.fullName
}, process.env.JWT_SECRET);

const createCompanyUser = async (name, role = 'SHOP_OWNER') => {
  const company = await Company.create({
    name,
    status: 'ACTIVE',
    contactEmail: `${name.toLowerCase().replace(/\s/g, '')}@test.com`
  });
  const user = await User.create({
    companyId: company._id,
    fullName: `${name} User`,
    email: `${name.toLowerCase().replace(/\s/g, '')}-${role.toLowerCase()}@test.com`,
    password: 'Password123',
    role
  });
  return { company, user, token: createToken(user) };
};

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.NODE_ENV = 'test';
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  app = require('../src/server');
  Company = require('../src/models/Company');
  User = require('../src/models/User');
  Category = require('../src/models/Category');
  Supplier = require('../src/models/Supplier');
  Product = require('../src/models/Product');
  Purchase = require('../src/models/Purchase');
  StockMovement = require('../src/models/StockMovement');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Promise.all([
    Company.deleteMany({}),
    User.deleteMany({}),
    Category.deleteMany({}),
    Supplier.deleteMany({}),
    Product.deleteMany({}),
    Purchase.deleteMany({}),
    StockMovement.deleteMany({})
  ]);
});

describe('Week 3 inventory and purchasing API', () => {
  it('creates tenant-owned category, supplier, and product records', async () => {
    const { company, token } = await createCompanyUser('Company A');
    const headers = { Authorization: `Bearer ${token}` };

    const categoryResponse = await request(app)
      .post('/api/v1/categories')
      .set(headers)
      .send({ categoryName: 'Engine Parts' })
      .expect(201);
    const supplierResponse = await request(app)
      .post('/api/v1/suppliers')
      .set(headers)
      .send({ supplierName: 'Parts Wholesale', phone: '+251911111111' })
      .expect(201);

    const productResponse = await request(app)
      .post('/api/v1/products')
      .set(headers)
      .send({
        productName: 'Oil Filter',
        categoryId: categoryResponse.body.data._id,
        productCode: 'OF-001',
        quantity: 5,
        purchasePrice: 10,
        sellingPrice: 15,
        minimumStock: 2,
        supplierId: supplierResponse.body.data._id
      })
      .expect(201);

    expect(productResponse.body.data.companyId.toString()).toBe(company._id.toString());
    expect(productResponse.body.data.quantity).toBe(5);
  });

  it('receives a pending purchase once and records stock movement', async () => {
    const { token } = await createCompanyUser('Company B');
    const headers = { Authorization: `Bearer ${token}` };
    const category = await Category.create({ companyId: (await User.findOne({})).companyId, categoryName: 'Brakes' });
    const supplier = await Supplier.create({ companyId: category.companyId, supplierName: 'Brake Supplier', phone: '+251922222222' });
    const product = await Product.create({
      companyId: category.companyId,
      productName: 'Brake Pad',
      categoryId: category._id,
      productCode: 'BP-001',
      quantity: 4,
      purchasePrice: 20,
      sellingPrice: 30,
      minimumStock: 2,
      supplierId: supplier._id
    });

    const purchaseResponse = await request(app)
      .post('/api/v1/purchases')
      .set(headers)
      .send({ supplierId: supplier._id, items: [{ productId: product._id, quantity: 6, costPrice: 18 }] })
      .expect(201);

    expect(purchaseResponse.body.data.status).toBe('PENDING');
    expect(purchaseResponse.body.data.totalAmount).toBe(108);

    await request(app)
      .put(`/api/v1/purchases/${purchaseResponse.body.data._id}/receive`)
      .set(headers)
      .expect(200);

    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.quantity).toBe(10);
    expect(await StockMovement.countDocuments({ productId: product._id, type: 'PURCHASE' })).toBe(1);

    await request(app)
      .put(`/api/v1/purchases/${purchaseResponse.body.data._id}/receive`)
      .set(headers)
      .expect(409);
  });

  it('rejects cross-tenant access and staff master-data creation', async () => {
    const first = await createCompanyUser('Company C');
    const second = await createCompanyUser('Company D');

    await request(app)
      .get('/api/v1/categories')
      .set('Authorization', `Bearer ${first.token}`)
      .set('x-company-id', second.company._id.toString())
      .expect(403);

    const staff = await createCompanyUser('Company E', 'STAFF');
    await request(app)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${staff.token}`)
      .send({ categoryName: 'Restricted Category' })
      .expect(403);
  });
});
