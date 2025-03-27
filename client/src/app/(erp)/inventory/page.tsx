"use client";

import { InventoryUtilities } from "../components/inventory/InventoryUtilities";
import { InventoryTable } from "../components/inventory/InventoryTable";
import { InventoryDataProvider } from "../context/InventoryDataContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InventoryProductsProvider } from "../context/InventoryProductsContext";

const queryClient = new QueryClient();

export default function Inventory() {
  return (
    <QueryClientProvider client={queryClient}>
      <InventoryDataProvider>
        <InventoryProductsProvider>
          <InventoryContent />
        </InventoryProductsProvider>
      </InventoryDataProvider>
    </QueryClientProvider>
  );
}

function InventoryContent() {
  return (
    <div className="pb-12 flex flex-col gap-4 px-1">
      <InventoryUtilities />
      <InventoryTable />
    </div>
  );
}
