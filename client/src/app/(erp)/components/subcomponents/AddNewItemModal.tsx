import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInventoryProductsContext } from "../../context/InventoryProductsContext";
import axios from "axios";
import { getAuth } from "firebase/auth";

export function AddNewItemModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { refetch } = useInventoryProductsContext(); // ✅ Refresh after adding item
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    sku: "",
    status: "In Stock",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle form submit
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken();

      await axios.post(
        "http://localhost:3001/api/inventory-products",
        {
          name: formData.name,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          sku: formData.sku,
          status: formData.status,
          imageUrl: formData.imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      refetch(); // ✅ Refresh inventory list
      onClose(); // ✅ Close modal
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 bg-white shadow-lg rounded-lg backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>

        {/* 🔹 Input Fields */}
        <div className="space-y-4">
          <Input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} />
          <Input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} />
          <Input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} />
          <Input name="sku" placeholder="SKU" value={formData.sku} onChange={handleChange} />
          <Input name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} />
        </div>

        {/* 🔹 Footer Buttons */}
        <DialogFooter className="mt-4 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
