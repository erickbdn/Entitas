import { LayoutDashboard, Package, ShoppingCart, LineChart, PieChart } from "lucide-react";

export const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Sales", href: "/sales", icon: LineChart },
  { name: "Purchase", href: "/purchase", icon: ShoppingCart },
  { name: "Reports", href: "/reports", icon: PieChart },
];