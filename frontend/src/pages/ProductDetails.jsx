import React, {
  useEffect,
  useState,
} from 'react';

import {
  FiArrowLeft,
  FiBox,
  FiClock,
  FiDollarSign,
  FiPackage,
  FiTruck,
} from 'react-icons/fi';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

import StockStatus from '../components/products/StockStatus';

import {
  productService,
} from '../services/productService';

// ============================================================
// HELPERS
// ============================================================

const getId = (value) => {

  if (!value) {
    return null;
  }

  return value._id || value.id || value;
};

const getCategoryName = (category) => {

  if (!category) {
    return '-';
  }

  if (typeof category === 'string') {
    return category;
  }

  return (
    category.categoryName ||
    category.name ||
    '-'
  );
};

const getSupplierName = (supplier) => {

  if (!supplier) {
    return '-';
  }

  if (typeof supplier === 'string') {
    return supplier;
  }

  return (
    supplier.supplierName ||
    supplier.name ||
    '-'
  );
};

const formatMoney = (value) => {

  return new Intl.NumberFormat(
    'en-US',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(
    Number(value || 0)
  );
};

const formatDate = (date) => {

  if (!date) {
    return '-';
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return '-';
  }

  return new Intl.DateTimeFormat(
    'en-US',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    }
  ).format(parsedDate);
};

// ============================================================
// PRODUCT DETAILS
// ============================================================

const ProductDetails = () => {

  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [product, setProduct] =
    useState(null);

  const [movements, setMovements] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  // ==========================================================
  // LOAD PRODUCT
  // ==========================================================

  useEffect(() => {

    const loadProductDetails =
      async () => {

        setLoading(true);
        setError('');

        try {

          const [
            productResponse,
            movementResponse,
          ] = await Promise.all([
            productService.getProduct(id),
            productService.getStockMovements(id),
          ]);

          setProduct(
            productResponse
          );

          setMovements(
            Array.isArray(
              movementResponse
            )
              ? movementResponse
              : []
          );

        } catch (err) {

          console.error(
            'Failed to load product details:',
            err
          );

          setError(
            err?.response?.data?.message ||
            'Failed to load product details.'
          );

        } finally {

          setLoading(false);

        }

      };

    loadProductDetails();

  }, [id]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <div className="
        py-20
        flex
        justify-center
      ">
        <Loading />
      </div>
    );

  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !product) {

    return (
      <div className="space-y-5">

        <Button
          variant="outline"
          onClick={() =>
            navigate('/inventory')
          }
        >
          <FiArrowLeft className="mr-2" />

          Back to Inventory
        </Button>

        <ErrorMessage
          message={
            error ||
            'Product not found.'
          }
        />

      </div>
    );

  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          BACK BUTTON
      ====================================================== */}

      <Button
        variant="ghost"
        onClick={() =>
          navigate('/inventory')
        }
      >
        <FiArrowLeft className="mr-2" />

        Back to Inventory
      </Button>

      {/* ======================================================
          PRODUCT HEADER
      ====================================================== */}

      <div className="
        bg-white
        border
        border-slate-200
        rounded-xl
        shadow-sm
        p-6
      ">

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-start
          md:justify-between
          gap-5
        ">

          <div className="
            flex
            items-center
            gap-4
          ">

            <div className="
              w-14
              h-14
              rounded-xl
              bg-emerald-50
              text-emerald-600
              flex
              items-center
              justify-center
            ">
              <FiBox size={26} />
            </div>

            <div>

              <h1 className="
                text-2xl
                font-bold
                text-slate-900
              ">
                {product.productName}
              </h1>

              <p className="
                mt-1
                text-sm
                text-slate-500
              ">
                Product Code:
                {' '}
                <span className="
                  font-semibold
                  text-slate-700
                ">
                  {product.productCode}
                </span>
              </p>

            </div>

          </div>

          <StockStatus
            quantity={
              product.quantity
            }
            minimumStock={
              product.minimumStock
            }
          />

        </div>

        {/* ====================================================
            INFORMATION CARDS
        ==================================================== */}

        <div className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-4
          mt-8
        ">

          <InfoCard
            icon={<FiPackage />}
            label="Current Stock"
            value={
              product.quantity
            }
          />

          <InfoCard
            icon={<FiPackage />}
            label="Minimum Stock"
            value={
              product.minimumStock
            }
          />

          <InfoCard
            icon={<FiDollarSign />}
            label="Purchase Price"
            value={
              formatMoney(
                product.purchasePrice
              )
            }
          />

          <InfoCard
            icon={<FiDollarSign />}
            label="Selling Price"
            value={
              formatMoney(
                product.sellingPrice
              )
            }
          />

        </div>

        {/* ====================================================
            PRODUCT INFORMATION
        ==================================================== */}

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
          mt-8
          pt-6
          border-t
          border-slate-200
        ">

          <Detail
            label="Category"
            value={
              getCategoryName(
                product.categoryId
              )
            }
          />

          <Detail
            label="Supplier"
            value={
              getSupplierName(
                product.supplierId
              )
            }
          />

          <Detail
            label="Maximum Stock"
            value={
              product.maximumStock ??
              '-'
            }
          />

          <Detail
            label="Product Code"
            value={
              product.productCode
            }
          />

          <Detail
            label="Created"
            value={
              formatDate(
                product.createdAt
              )
            }
          />

          <Detail
            label="Last Updated"
            value={
              formatDate(
                product.updatedAt
              )
            }
          />

        </div>

      </div>

      {/* ======================================================
          STOCK MOVEMENT HISTORY
      ====================================================== */}

      <div className="
        bg-white
        border
        border-slate-200
        rounded-xl
        shadow-sm
      ">

        <div className="
          p-5
          border-b
          border-slate-200
        ">

          <h2 className="
            font-bold
            text-slate-900
            flex
            items-center
            gap-2
          ">
            <FiClock />

            Stock Movement History
          </h2>

          <p className="
            mt-1
            text-sm
            text-slate-500
          ">
            History of inventory quantity changes
            for this product.
          </p>

        </div>

        {movements.length === 0 ? (

          <div className="
            p-12
            text-center
          ">

            <FiClock
              className="
                mx-auto
                text-4xl
                text-slate-300
              "
            />

            <h3 className="
              mt-3
              font-semibold
              text-slate-800
            ">
              No stock movements
            </h3>

            <p className="
              mt-1
              text-sm
              text-slate-500
            ">
              No stock adjustments have
              been recorded yet.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="
              min-w-[900px]
              w-full
            ">

              <thead className="
                bg-slate-50
              ">

                <tr className="
                  text-left
                  text-xs
                  uppercase
                  tracking-wide
                  text-slate-500
                ">

                  <th className="px-5 py-3">
                    Date
                  </th>

                  <th className="px-5 py-3">
                    Type
                  </th>

                  <th className="px-5 py-3">
                    Change
                  </th>

                  <th className="px-5 py-3">
                    Previous
                  </th>

                  <th className="px-5 py-3">
                    New Stock
                  </th>

                  <th className="px-5 py-3">
                    Notes
                  </th>

                </tr>

              </thead>

              <tbody className="
                divide-y
                divide-slate-100
              ">

                {movements.map(
                  (movement, index) => {

                    const movementId =
                      getId(movement) ||
                      index;

                    const quantityChange =
                      Number(
                        movement.quantity ||
                        0
                      );

                    return (
                      <tr
                        key={movementId}
                        className="
                          hover:bg-slate-50
                        "
                      >

                        <td className="
                          px-5
                          py-4
                          text-sm
                          text-slate-600
                        ">
                          {formatDate(
                            movement.createdAt
                          )}
                        </td>

                        <td className="
                          px-5
                          py-4
                        ">

                          <span className="
                            inline-flex
                            px-2.5
                            py-1
                            rounded-full
                            bg-slate-100
                            text-slate-700
                            text-xs
                            font-semibold
                          ">
                            {movement.type}
                          </span>

                        </td>

                        <td className="
                          px-5
                          py-4
                        ">

                          <span className={`
                            font-bold
                            ${
                              quantityChange >= 0
                                ? 'text-emerald-600'
                                : 'text-red-600'
                            }
                          `}>
                            {quantityChange >= 0
                              ? '+'
                              : ''}
                            {quantityChange}
                          </span>

                        </td>

                        <td className="
                          px-5
                          py-4
                          text-sm
                          font-medium
                          text-slate-700
                        ">
                          {movement.previousQuantity}
                        </td>

                        <td className="
                          px-5
                          py-4
                          text-sm
                          font-bold
                          text-slate-900
                        ">
                          {movement.newQuantity}
                        </td>

                        <td className="
                          px-5
                          py-4
                          text-sm
                          text-slate-500
                        ">
                          {movement.notes ||
                            '-'}
                        </td>

                      </tr>
                    );

                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

// ============================================================
// INFORMATION CARD
// ============================================================

const InfoCard = ({
  icon,
  label,
  value,
}) => {

  return (
    <div className="
      rounded-xl
      bg-slate-50
      p-4
    ">

      <div className="
        w-9
        h-9
        rounded-lg
        bg-white
        text-emerald-600
        flex
        items-center
        justify-center
        shadow-sm
      ">
        {icon}
      </div>

      <p className="
        mt-3
        text-xs
        text-slate-500
      ">
        {label}
      </p>

      <p className="
        mt-1
        text-lg
        font-bold
        text-slate-900
      ">
        {value}
      </p>

    </div>
  );
};

// ============================================================
// DETAIL
// ============================================================

const Detail = ({
  label,
  value,
}) => {

  return (
    <div>

      <p className="
        text-xs
        font-semibold
        uppercase
        tracking-wide
        text-slate-400
      ">
        {label}
      </p>

      <p className="
        mt-1
        text-sm
        font-semibold
        text-slate-800
      ">
        {value}
      </p>

    </div>
  );
};

export default ProductDetails;