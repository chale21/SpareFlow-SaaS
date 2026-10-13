const Notification = require('../models/Notification');
const User = require('../models/User');

const COMPANY_ROLES = ['SHOP_OWNER', 'STAFF'];

const createForRecipients = async ({ recipients, companyId = null, ...notification }) => {
  if (!recipients.length) return;

  await Notification.bulkWrite(
    recipients.map((recipient) => ({
      updateOne: {
        filter: { recipientId: recipient._id, dedupeKey: notification.dedupeKey },
        update: {
          $setOnInsert: {
            ...notification,
            companyId,
            recipientId: recipient._id
          }
        },
        upsert: true
      }
    })),
    { ordered: true }
  );
};

const notifyCompany = async ({ companyId, roles = COMPANY_ROLES, ...notification }) => {
  const recipients = await User.find({
    companyId,
    role: { $in: roles },
    isActive: true,
    status: 'ACTIVE'
  }).select('_id').lean();

  await createForRecipients({ recipients, companyId, ...notification });
};

const notifySuperAdmins = async (notification) => {
  const recipients = await User.find({
    role: 'SUPER_ADMIN',
    isActive: true,
    status: 'ACTIVE'
  }).select('_id').lean();

  await createForRecipients({ recipients, ...notification });
};

const notifyStockThresholds = async ({
  companyId,
  product,
  previousQuantity,
  previousMinimumStock,
  eventId
}) => {
  const isInitialStock = previousQuantity === null;
  const wasLowStock = !isInitialStock && previousQuantity <= previousMinimumStock;
  const enteredLowStock = isInitialStock
    ? product.quantity <= product.minimumStock
    : !wasLowStock && product.quantity <= product.minimumStock;
  const enteredOutOfStock = isInitialStock
    ? product.quantity === 0
    : previousQuantity > 0 && product.quantity === 0;

  if (enteredLowStock) {
    await notifyCompany({
      companyId,
      type: 'LOW_STOCK',
      title: 'Low stock alert',
      message: `${product.productName} is at ${product.quantity} units, at or below its minimum of ${product.minimumStock}.`,
      link: `/inventory/${product._id}`,
      resourceType: 'product',
      resourceId: product._id,
      dedupeKey: `low-stock:${product._id}:${eventId}`
    });
  }

  if (enteredOutOfStock) {
    await notifyCompany({
      companyId,
      type: 'OUT_OF_STOCK',
      title: 'Product out of stock',
      message: `${product.productName} has reached zero stock.`,
      link: `/inventory/${product._id}`,
      resourceType: 'product',
      resourceId: product._id,
      dedupeKey: `out-of-stock:${product._id}:${eventId}`
    });
  }
};

const notifyPurchaseCompleted = async (companyId, purchase) => notifyCompany({
  companyId,
  type: 'PURCHASE_COMPLETED',
  title: 'Purchase received',
  message: `Purchase ${purchase._id} has been received and inventory has been updated.`,
  link: '/purchases',
  resourceType: 'purchase',
  resourceId: purchase._id,
  dedupeKey: `purchase-completed:${purchase._id}`
});

const notifyPurchaseCreated = async (companyId, purchase) => notifyCompany({
  companyId,
  type: 'PURCHASE_CREATED',
  title: 'Purchase created',
  message: `A purchase for ${purchase.items.length} product${purchase.items.length === 1 ? '' : 's'} has been created.`,
  link: '/purchases',
  resourceType: 'purchase',
  resourceId: purchase._id,
  dedupeKey: `purchase-created:${purchase._id}`
});

const notifySaleCompleted = async (companyId, sale) => notifyCompany({
  companyId,
  type: 'SALE_COMPLETED',
  title: 'Sale completed',
  message: `Sale ${sale._id} has been completed.`,
  link: '/sales/history',
  resourceType: 'sale',
  resourceId: sale._id,
  dedupeKey: `sale-completed:${sale._id}`
});

module.exports = {
  notifyCompany,
  notifySuperAdmins,
  notifyStockThresholds,
  notifyPurchaseCreated,
  notifyPurchaseCompleted,
  notifySaleCompleted
};
