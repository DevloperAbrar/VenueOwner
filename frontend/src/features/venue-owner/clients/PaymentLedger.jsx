import React from "react";
import { formatCurrency, formatDate } from "../../../lib/formatters";

export default function PaymentLedger({ bookings = [] }) {
  const allEntries = bookings.flatMap((b) => (b.ledger || []).map((entry) => ({ ...entry, eventDate: b.event_date })));

  if (allEntries.length === 0) {
    return <p className="text-sm text-gray-400">No payment history yet.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead className="text-gray-400 text-left">
        <tr>
          <th className="py-2">Date</th>
          <th className="py-2">Type</th>
          <th className="py-2">Method</th>
          <th className="py-2">Amount</th>
        </tr>
      </thead>
      <tbody>
        {allEntries.map((entry) => (
          <tr key={entry.id} className="border-t border-gray-50">
            <td className="py-2">{formatDate(entry.paid_at)}</td>
            <td className="py-2 capitalize">{entry.type}</td>
            <td className="py-2 capitalize">{entry.method}</td>
            <td className="py-2">{formatCurrency(entry.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}