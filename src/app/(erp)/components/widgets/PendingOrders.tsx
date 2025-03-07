import { DashboardWidget } from "../subcomponents/DashboardWidget";

const transactions = [
  { id: "#83713", date: "11/01/2025", amount: "$89.00", status: "Completed" },
  { id: "#83712", date: "10/01/2025", amount: "$75.00", status: "Cancelled" },
  { id: "#83711", date: "10/01/2025", amount: "$79.00", status: "Completed" },
  { id: "#83710", date: "09/01/2025", amount: "$69.00", status: "Pending" },
  { id: "#83709", date: "08/01/2025", amount: "$89.00", status: "Completed" },
  { id: "#83708", date: "07/01/2025", amount: "$115.00", status: "Completed" },
  { id: "#83707", date: "07/01/2025", amount: "$115.00", status: "Completed" },
  { id: "#83706", date: "07/01/2025", amount: "$115.00", status: "Completed" },
  { id: "#83705", date: "07/01/2025", amount: "$115.00", status: "Completed" },
  { id: "#83704", date: "07/01/2025", amount: "$115.00", status: "Completed" },
];

const statusColors: Record<string, string> = {
  Completed: "text-green-500 bg-green-100",
  Pending: "text-yellow-500 bg-yellow-100",
  Cancelled: "text-red-500 bg-red-100",
};

export function PendingOrders() {
  const pendingOrders = transactions.filter((tx) => tx.status === "Pending");

  return (
    <DashboardWidget
      title="Pending Orders"
      className="col-span-5 text-secondary-lighter relative min-h-40 flex"
      titleClassName="z-10 absolute top-4 left-4 text-secondary-lighter"
      contentClassName="p-0"
    >
      {/* Total Pending Orders Count */}
      <div className="absolute top-4 right-4 text-sm text-secondary-lighter">
        Total Pending Orders: {pendingOrders.length}
      </div>

      {/* Scrollable Container */}
      <div className="w-full overflow-auto max-h-60 mt-16 ml-4 mr-4 mb-4 relative rounded-2xl">
        <table className="w-full border-collapse">
          {/* Sticky Header with Background */}
          <thead className="sticky top-0 z-10 bg-accent">
            <tr className="text-left border-b border-secondary-lighter text-sm text-secondary-lighter">
              <th className="p-2">Order ID</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          {/* Scrollable Rows */}
          <tbody>
            {pendingOrders.map((tx) => (
              <tr key={tx.id} className="text-sm border-b border-gray-200">
                <td className="p-2 flex items-center gap-2">
                  <span
                    className={`w-1 h-4 rounded-full ${
                      statusColors[tx.status]
                    }`}
                  />
                  {tx.id}
                </td>
                <td className="p-2">{tx.date}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </DashboardWidget>
  );
}

