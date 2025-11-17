import { jwtDecode } from "jwt-decode";
import { useAuth } from "../zustand/Auth";

export const decodedUser = () => {
  const { user } = useAuth();
  return jwtDecode(user);
};

// FOR CREATE AND EDIT USER MODAL
export const permissionGroups = [
  {
    name: "Settings",
    children: [
      "Admin Settings",
      "Document Settings",
      "Signatory Settings",
      "Branch Settings",
    ],
  },
  {
    name: "Inventory",
    children: [
      "Procurement",
      "InventoryRequest",
      "InventoryAttributes",
      "Property",
      "InventoryBranch",
    ],
  },
];
