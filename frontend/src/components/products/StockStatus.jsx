import React from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';

// ============================================================
// STOCK STATUS CALCULATION
// ============================================================

export const getStockStatus = (
  quantity,
  minimumStock = 0
) => {
  const qty = Number(quantity ?? 0);
  const minimum = Number(minimumStock ?? 0);

  // No stock
  if (qty === 0) {
    return 'out';
  }

  // At or below minimum stock
  if (qty <= minimum) {
    return 'low';
  }

  // Normal stock
  return 'in';
};

// ============================================================
// STOCK STATUS COMPONENT
// ============================================================

const StockStatus = ({
  quantity,
  minimumStock,
  compact = false,
}) => {
  const status = getStockStatus(
    quantity,
    minimumStock
  );

  const configuration = {
    in: {
      label: 'In Stock',
      className:
        'bg-emerald-50 text-emerald-700 border-emerald-200',
      Icon: FiCheckCircle,
    },

    low: {
      label: 'Low Stock',
      className:
        'bg-amber-50 text-amber-700 border-amber-200',
      Icon: FiAlertCircle,
    },

    out: {
      label: 'Out of Stock',
      className:
        'bg-red-50 text-red-700 border-red-200',
      Icon: FiXCircle,
    },
  };

  const config = configuration[status];

  const Icon = config.Icon;

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        border
        rounded-full
        font-semibold
        ${compact
          ? 'px-2 py-1 text-[11px]'
          : 'px-2.5 py-1 text-xs'
        }
        ${config.className}
      `}
    >
      <Icon className="shrink-0" />

      {config.label}
    </span>
  );
};

export default StockStatus;