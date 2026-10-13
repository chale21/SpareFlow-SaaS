const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

jest.setTimeout(60000);

let app;
let mongoServer;
let Company;
let User;
let Category;
let Supplier;
let Product;
let Purchase;
let StockMovement;
let Notification;

const createToken = (user) => jwt.sign({
  id: user._id.toString(),
  email: user.email,
  companyId: user.companyId.toString(),
  role: user.role,
  fullName: user.fullName
}, process.env.JWT_SECRET);

const authHeader = (token) => ['Be', 'arer ', token].join('');

const createCompanyUser = async (name, role = 'SHOP_OWNER') => {
  const company = await Company.create({
    name,
    status: 'ACTIVE',
    contactEmail: `${name.toLowerCase().replace(/\s/g, '')}@test.com`
  });
  const user = await User.create({
    companyId: company._id,
    name: `${name} User`,
    fullName: `${name} User`,
    email: `${name.toLowerCase().replace(/\s/g, '')}-${role.toLowerCase()}@test.com`,
    password: 'Password123',
    role
  });
  return { company, user, token: createToken(user) };
};

const createProduct = async (companyId, { quantity = 5, minimumStock = 2 } = {}) => {
  const category = await Category.create({ companyId, categoryName: `Category-${Math.random()}` });
  const supplier = await Supplier.create({
    companyId,
    supplierName: `Supplier-${Math.random()}`,
    phone: '+12025550123'
  });
  return Product.create({
    companyId,
    productName: 'Air Filter',
    categoryId: category._id,
    productCode: `AF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    quantity,
    purchasePrice: 10,
    sellingPrice: 15,
    minimumStock,
    supplierId: supplier._id
  });
};

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.NODE_ENV = 'test';
  mongoServer = await MongoMemoryServer.create(
    process.env.MONGOMS_SYSTEM_BINARY
      ? { instance: { storageEngine: 'wiredTiger' } }
      : {}
  );
  await mongoose.connect(mongoServer.getUri());

  app = require('../src/server');
  Company = require('../src/models/Company');
  User = require('../src/models/User');
  Category = require('../src/models/Category');
  Supplier = require('../src/models/Supplier');
  Product = require('../src/models/Product');
  Purchase = require('../src/models/Purchase');
  StockMovement = require('../src/models/StockMovement');
  Notification = require('../src/models/Notification');
  await Notification.init();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

beforeEach(async () => {
  await Promise.all([
    Company.deleteMany({}),
    User.deleteMany({}),
    Category.deleteMany({}),
    Supplier.deleteMany({}),
    Product.deleteMany({}),
    Purchase.deleteMany({}),
    StockMovement.deleteMany({}),
    Notification.deleteMany({})
  ]);
});

describe('Inventory and notification API', () => {
  it('creates tenant-owned inventory records', async () => {
    const { company, token } = await createCompanyUser('Company A');
    const headers = { Authorization: authHeader(token) };

    const categoryResponse = await request(app)
      .post('/api/v1/categories')
      .set(headers)
      .send({ categoryName: 'Engine Parts' })
      .expect(201);
    const supplierResponse = await request(app)
      .post('/api/v1/suppliers')
      .set(headers)
      .send({ supplierName: 'Parts Wholesale', phone: '+251911111111', email: 'parts@test.com' })
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

  it('notifies company users on stock transitions and isolates notification operations by tenant', async () => {
    const owner = await createCompanyUser('Company Stock');
    const staff = await User.create({
      companyId: owner.company._id,
      name: 'Stock Staff',
      fullName: 'Stock Staff',
      email: 'stock-staff@test.com',
      password: 'Password123',
      role: 'STAFF'
    });
    const otherCompany = await createCompanyUser('Company Other');
    const product = await createProduct(owner.company._id);

    await request(app)
      .get(`/api/v1/products/${product._id}`)
      .set({ Authorization: authHeader(otherCompany.token) })
      .expect(404);
    await request(app)
      .post('/api/v1/categories')
      .set({ Authorization: authHeader(createToken(staff)) })
      .send({ categoryName: 'Staff Restricted' })
      .expect(403);

    await request(app)
      .put(`/api/v1/products/${product._id}`)
      .set({ Authorization: authHeader(owner.token) })
      .send({ quantity: 2 })
      .expect(200);

    const ownerInbox = await request(app)
      .get(`/api/v1/notifications?companyId=${otherCompany.company._id}`)
      .set({ Authorization: authHeader(owner.token) })
      .expect(200);
    expect(ownerInbox.body.data.notifications).toHaveLength(1);
    expect(ownerInbox.body.data.notifications[0].type).toBe('LOW_STOCK');
    expect(ownerInbox.headers['cache-control']).toContain('no-store');

    const conditionalInbox = await request(app)
      .get('/api/v1/notifications')
      .set({ Authorization: authHeader(owner.token), 'If-None-Match': ownerInbox.headers.etag })
      .expect(200);
    expect(conditionalInbox.body.data.notifications).toHaveLength(1);

    await request(app)
      .put(`/api/v1/products/${product._id}`)
      .set({ Authorization: authHeader(owner.token) })
      .send({ quantity: 1 })
      .expect(200);
    expect(await Notification.countDocuments({ recipientId: owner.user._id, type: 'LOW_STOCK' })).toBe(1);

    await request(app)
      .put(`/api/v1/products/${product._id}`)
      .set({ Authorization: authHeader(owner.token) })
      .send({ quantity: 0 })
      .expect(200);

    const staffInbox = await request(app)
      .get('/api/v1/notifications')
      .set({ Authorization: authHeader(createToken(staff)) })
      .expect(200);
    expect(staffInbox.body.data.notifications.map((notification) => notification.type).sort())
      .toEqual(['LOW_STOCK', 'OUT_OF_STOCK']);

    const otherInbox = await request(app)
      .get('/api/v1/notifications')
      .set({ Authorization: authHeader(otherCompany.token) })
      .expect(200);
    expect(otherInbox.body.data.notifications).toHaveLength(0);

    await request(app)
      .patch(`/api/v1/notifications/${ownerInbox.body.data.notifications[0].id}/read`)
      .set({ Authorization: authHeader(otherCompany.token) })
      .expect(404);

    await request(app)
      .patch('/api/v1/notifications/read-all')
      .set({ Authorization: authHeader(owner.token) })
      .expect(200);
    const unread = await request(app)
      .get('/api/v1/notifications/unread-count')
      .set({ Authorization: authHeader(owner.token) })
      .expect(200);
    expect(unread.body.data.unreadCount).toBe(0);

    const latestInbox = await request(app)
      .get('/api/v1/notifications')
      .set({ Authorization: authHeader(owner.token) });
    await request(app)
      .delete(`/api/v1/notifications/${latestInbox.body.data.notifications[0].id}`)
      .set({ Authorization: authHeader(owner.token) })
      .expect(200);
    expect(await Notification.countDocuments({ recipientId: owner.user._id })).toBe(1);
  });

  it('notifies owners when purchases are received and staff are added', async () => {
    const owner = await createCompanyUser('Company Events');
    const staff = await User.create({
      companyId: owner.company._id,
      name: 'Authorized Staff',
      fullName: 'Authorized Staff',
      email: 'authorized-staff@test.com',
      password: 'Password123',
      role: 'STAFF'
    });
    const product = await createProduct(owner.company._id);
    const supplier = await Supplier.findById(product.supplierId);
    const headers = { Authorization: authHeader(owner.token) };

    const purchase = await request(app)
      .post('/api/v1/purchases')
      .set(headers)
      .send({ supplierId: supplier._id, items: [{ productId: product._id, quantity: 6, costPrice: 18 }] })
      .expect(201);
    expect(await Notification.countDocuments({
      recipientId: owner.user._id,
      type: 'PURCHASE_CREATED',
      resourceId: purchase.body.data._id
    })).toBe(1);
    expect(await Notification.countDocuments({
      recipientId: staff._id,
      type: 'PURCHASE_CREATED',
      resourceId: purchase.body.data._id
    })).toBe(1);

    await request(app)
      .put(`/api/v1/purchases/${purchase.body.data._id}/receive`)
      .set(headers)
      .expect(200);
    expect(await Product.findById(product._id).then((item) => item.quantity)).toBe(11);
    expect(await Notification.countDocuments({ recipientId: owner.user._id, type: 'PURCHASE_COMPLETED' })).toBe(1);
    expect(await Notification.countDocuments({ recipientId: staff._id, type: 'PURCHASE_COMPLETED' })).toBe(1);

    const addedStaff = await request(app)
      .post('/api/v1/users')
      .set(headers)
      .send({
        fullName: 'New teammate',
        email: 'new-teammate@test.com',
        password: 'Password123',
        role: 'STAFF'
      })
      .expect(201);
    expect(await Notification.countDocuments({
      recipientId: owner.user._id,
      type: 'NEW_STAFF',
      resourceId: addedStaff.body.data.id
    })).toBe(1);
    expect(await Notification.countDocuments({ recipientId: staff._id, type: 'NEW_STAFF' })).toBe(0);

    const inbox = await request(app)
      .get('/api/v1/notifications')
      .set(headers)
      .expect(200);
    expect(inbox.body.data.notifications.map((notification) => notification.type)).toEqual(
      expect.arrayContaining(['PURCHASE_CREATED', 'PURCHASE_COMPLETED', 'NEW_STAFF'])
    );
  });

  it('notifies company users when a sale moves a product into low or zero stock', async () => {
    const owner = await createCompanyUser('Company Sales');
    const staff = await User.create({
      companyId: owner.company._id,
      name: 'Sales Staff',
      fullName: 'Sales Staff',
      email: 'sales-staff@test.com',
      password: 'Password123',
      role: 'STAFF'
    });
    const product = await createProduct(owner.company._id, { quantity: 4, minimumStock: 2 });

    await request(app)
      .post('/api/v1/sales')
      .set({ Authorization: authHeader(owner.token) })
      .send({ items: [{ productId: product._id, quantity: 2 }] })
      .expect(201);

    expect(await Notification.countDocuments({ recipientId: owner.user._id, type: 'SALE_COMPLETED' })).toBe(1);
    expect(await Notification.countDocuments({ recipientId: staff._id, type: 'SALE_COMPLETED' })).toBe(1);
    expect(await Notification.countDocuments({ recipientId: owner.user._id, type: 'LOW_STOCK' })).toBe(1);
    expect(await Notification.countDocuments({ recipientId: staff._id, type: 'LOW_STOCK' })).toBe(1);

    await request(app)
      .post('/api/v1/sales')
      .set({ Authorization: authHeader(owner.token) })
      .send({ items: [{ productId: product._id, quantity: 2 }] })
      .expect(201);

    expect(await Notification.countDocuments({ recipientId: owner.user._id, type: 'SALE_COMPLETED' })).toBe(2);
    expect(await Notification.countDocuments({ recipientId: owner.user._id, type: 'OUT_OF_STOCK' })).toBe(1);
  });

  it('notifies only platform administrators about successful company registrations', async () => {
    const admin = await createCompanyUser('Platform Admin');
    admin.user.role = 'SUPER_ADMIN';
    await admin.user.save();
    const adminToken = createToken(admin.user);

    const registration = await request(app)
      .post('/api/v1/auth/register')
      .send({
        companyName: 'Newly Registered Company',
        ownerName: 'New Owner',
        email: 'new-owner@test.com',
        password: 'Password123'
      })
      .expect(201);

    const platformInbox = await request(app)
      .get('/api/v1/notifications')
      .set({ Authorization: authHeader(adminToken) })
      .expect(200);
    expect(platformInbox.body.data.notifications).toHaveLength(1);
    expect(platformInbox.body.data.notifications[0].type).toBe('NEW_COMPANY');
    expect(platformInbox.body.data.notifications[0].resourceId.toString())
      .toBe(registration.body.data.company.id.toString());

    const companyInbox = await request(app)
      .get('/api/v1/notifications')
      .set({ Authorization: authHeader(registration.body.data.token) })
      .expect(200);
    expect(companyInbox.body.data.notifications).toHaveLength(0);
  });
});
