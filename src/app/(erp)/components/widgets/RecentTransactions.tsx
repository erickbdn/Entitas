import { DashboardWidget } from "../subcomponents/DashboardWidget";
import { useRecentTransactionsContext } from "../../context/RecentTransactionsContext";

const statusColors: Record<string, string> = {
  Shipped: "text-green-500 bg-green-100",
  Pending: "text-yellow-500 bg-yellow-100",
  Cancelled: "text-red-500 bg-red-100",
};

export function RecentTransactions() {
  const { transactions, loading, error } = useRecentTransactionsContext();

  return (
    <DashboardWidget
      title="Recent Transactions"
      className="col-span-5 text-secondary-lighter relative min-h-40 flex"
      titleClassName="z-10 absolute top-4 left-4 text-secondary-lighter"
      contentClassName="p-0"
    >
      {/* Scrollable Container */}
      <div className="w-full overflow-auto max-h-60 mt-16 ml-4 mr-4 mb-4 relative rounded-2xl">
        <table className="w-full border-collapse">
          {/* Sticky Header with Background */}
          <thead className="sticky top-0 z-10 bg-accent">
            <tr className="text-left border-b border-secondary-lighter text-sm text-secondary-lighter">
              <th className="p-2">Order ID</th>
              <th className="p-2">Date</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          {/* Scrollable Rows */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="text-center p-4 text-red-500">
                  {error}
                </td>
              </tr>
            ) : !transactions || transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No recent transactions
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="relative text-sm border-b border-gray-200">
                  <td className="p-2 flex items-center gap-2">
                    <span
                      className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-full ${
                        tx.status === "Shipped"
                          ? "bg-green-500"
                          : tx.status === "Pending"
                          ? "bg-yellow-100"
                          : "bg-red-500"
                      }`}
                    />
                    {tx.id}
                  </td>
                  <td className="p-2">{tx.date}</td>
                  <td className="p-2">{tx.amount}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-lg ${
                        statusColors[tx.status]
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardWidget>
  );
}
