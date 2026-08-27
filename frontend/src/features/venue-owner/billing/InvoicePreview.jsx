import React from "react";
import { formatCurrency } from "../../../lib/formatters";

function formatDiscountLabel(discountType, discountValue) {
  if (!discountType || discountType === "none" || Number(discountValue) <= 0) return "—";
  if (discountType === "percentage") return `${discountValue}%`;
  return formatCurrency(discountValue);
}

export default function InvoicePreview({
  lineItems = [],
  gstEnabled,
  gstRate = 18,
  overallDiscountType = "none",
  overallDiscountValue = 0,
  totals
}) {
  const computed =
    totals ||
    (() => {
      const subtotal = lineItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      const half = gstEnabled ? gstRate / 2 : 0;
      const cgst = subtotal * (half / 100);
      const sgst = subtotal * (half / 100);
      return { subtotal, discountAmount: 0, taxableAmount: subtotal, cgst, sgst, total: subtotal + cgst + sgst };
    })();

  const { subtotal, discountAmount, taxableAmount, cgst, sgst, total } = computed;
  const hasOverallDiscount = overallDiscountType !== "none" && Number(overallDiscountValue) > 0;
  const halfRate = (Number(gstRate) || 0) / 2;

  return (
    <div className="bg-gray-50 rounded-lg p-4 text-sm">
      <table className="w-full mb-3">
        <thead className="text-gray-400 text-left text-xs">
          <tr>
            <th className="pb-1">Item</th>
            <th className="pb-1">Qty</th>
            <th className="pb-1">Rate</th>
            <th className="pb-1">Discount</th>
            <th className="pb-1 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, i) => (
            <tr key={i}>
              <td className="py-1">{item.description || <span className="text-gray-300">—</span>}</td>
              <td className="py-1">{item.quantity}</td>
              <td className="py-1">{formatCurrency(item.rate)}</td>
              <td className="py-1">{formatDiscountLabel(item.discount_type, item.discount_value)}</td>
              <td className="py-1 text-right">{formatCurrency(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right space-y-1">
        <p>Subtotal: {formatCurrency(subtotal)}</p>

        {hasOverallDiscount && (
          <>
            <p className="text-red-600">
              Discount {overallDiscountType === "percentage" ? `(${overallDiscountValue}%)` : "(flat)"}:{" "}
              -{formatCurrency(discountAmount)}
            </p>
            <p>Taxable Amount: {formatCurrency(taxableAmount)}</p>
          </>
        )}

        {gstEnabled && (
          <>
            <p>CGST ({halfRate}%): {formatCurrency(cgst)}</p>
            <p>SGST ({halfRate}%): {formatCurrency(sgst)}</p>
          </>
        )}

        <p className="font-bold text-base">Total: {formatCurrency(total)}</p>
      </div>
    </div>
  );
}