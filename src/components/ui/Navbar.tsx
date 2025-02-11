// components/ui/Navbar.tsx
import { Menu } from "lucide-react"; // Icon for mobile menu
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-14 bg-white shadow-md flex items-center px-4 z-50">
      {/* Left side: Mobile Menu (Only shows on small screens) */}
      <button className="lg:hidden p-2">
        <Menu className="w-6 h-6" />
      </button>

      {/* Center: Branding / Title */}
      <h1 className="text-lg font-semibold flex-1 text-center lg:text-left">
        ERP Dashboard 
      </h1>

      {/* Right Side: User Profile / Actions */}
      <div className="flex items-center space-x-4">
        <Button variant="outline">Notifications</Button>
        <Button>User</Button>
      </div>
    </nav>
  );
};

export default Navbar;
