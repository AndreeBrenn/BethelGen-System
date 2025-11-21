import { jwtDecode } from "jwt-decode";
import { useAuth } from "../zustand/Auth";
import { useCallback, useEffect, useState } from "react";
import { handleApiError } from "../utils/HandleError";
import usePrivateAxios from "../hooks/useProtectedAxios";

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

export const get_branch = () => {
  const [branches, setBranches] = useState([]);
  const axiosPrivate = usePrivateAxios();

  const get_all_branch = useCallback(async () => {
    try {
      const res = await axiosPrivate.get("/branch/get-all-branch");

      setBranches(res.data);
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  useEffect(() => {
    get_all_branch();
  }, [get_all_branch]);

  return branches;
};
