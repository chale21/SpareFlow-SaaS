jest.mock('../src/models/Company', () => ({
  findById: jest.fn(),
  findOneAndUpdate: jest.fn()
}));

const { validationResult } = require('express-validator');
const Company = require('../src/models/Company');
const CompanyModel = jest.requireActual('../src/models/Company');
const { validateCompanyUpdate } = require('../src/middleware/validate');
const companyService = require('../src/services/companyService');

const validPayload = {
  name: 'Example Auto Parts',
  contactEmail: 'shop@example.com',
  contactPhone: '+251900000000',
  address: 'Addis Ababa',
  settings: {
    currency: 'ETB',
    timezone: 'Africa/Addis_Ababa',
    dateFormat: 'DD/MM/YYYY',
    lowStockThreshold: 5,
    invoicePrefix: 'INV',
    taxRate: 15,
    lowStockNotifications: true,
    emailNotifications: true
  }
};

const validatePayload = async (body) => {
  const req = { body };
  const res = {
    statusCode: 200,
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };

  const chains = validateCompanyUpdate.slice(0, -1);
  for (const chain of chains) {
    await chain.run(req);
  }

  const handleErrors = validateCompanyUpdate[validateCompanyUpdate.length - 1];
  handleErrors(req, res, () => {
    res.nextCalled = true;
  });

  return { req, res, errors: validationResult(req).array() };
};

describe('Company profile updates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('accepts the edit-company and business-settings payload sent by the frontend', async () => {
    const { res, errors } = await validatePayload(validPayload);

    expect(errors).toEqual([]);
    expect(res.statusCode).toBe(200);
    expect(res.nextCalled).toBe(true);
  });

  it('returns field-specific errors for invalid profile and settings values', async () => {
    const { res } = await validatePayload({
      ...validPayload,
      contactEmail: 'not-an-email',
      settings: {
        ...validPayload.settings,
        taxRate: 101
      }
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'contactEmail',
        message: 'Business email must be a valid email address'
      }),
      expect.objectContaining({
        field: 'settings.taxRate',
        message: 'Tax rate must be between 0 and 100'
      })
    ]));
  });

  it('persists company contact email and settings fields', async () => {
    const company = {
      name: 'Example Auto Parts',
      contactEmail: validPayload.contactEmail,
      contactPhone: validPayload.contactPhone,
      address: validPayload.address,
      settings: validPayload.settings
    };
    Company.findOneAndUpdate.mockResolvedValue(company);

    const result = await companyService.updateProfile('company-id', validPayload);

    expect(Company.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'company-id', isDeleted: { $ne: true } },
      {
        $set: {
          name: validPayload.name,
          contactEmail: validPayload.contactEmail,
          contactPhone: validPayload.contactPhone,
          address: validPayload.address,
          ...Object.fromEntries(
            Object.entries(validPayload.settings).map(([key, value]) => [
              `settings.${key}`,
              value
            ])
          )
        }
      },
      { new: true, runValidators: true }
    );
    expect(result.contactEmail).toBe(validPayload.contactEmail);
    expect(result.settings).toEqual(validPayload.settings);
  });

  it('updates profile fields without validating unrelated legacy enum values', async () => {
    const legacyCompany = {
      name: 'Legacy Shop',
      status: 'active',
      subscriptionPlan: 'free',
      contactEmail: 'shop@example.com'
    };
    Company.findOneAndUpdate.mockResolvedValue(legacyCompany);

    await expect(companyService.updateProfile('company-id', {
      name: 'Updated Legacy Shop',
      contactEmail: 'new@example.com'
    })).resolves.toBe(legacyCompany);

    const [, update, options] = Company.findOneAndUpdate.mock.calls[0];
    expect(update.$set).toEqual({
      name: 'Updated Legacy Shop',
      contactEmail: 'new@example.com'
    });
    expect(update.$set).not.toHaveProperty('status');
    expect(update.$set).not.toHaveProperty('subscriptionPlan');
    expect(options.runValidators).toBe(true);
  });

  it('normalizes legacy lowercase status and subscription plan values before validation', async () => {
    const company = new CompanyModel({
      name: 'Legacy Example Auto Parts',
      status: 'active',
      subscriptionPlan: 'free'
    });

    await expect(company.validate()).resolves.toBeUndefined();
    expect(company.status).toBe('ACTIVE');
    expect(company.subscriptionPlan).toBe('FREE');
  });
});
