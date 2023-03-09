import React from "react";
import { Navigate } from "react-router-dom";
import { AdminLayout } from "../../layouts/AdminLayout";
import { USER_KEY } from "../../utils/constants";

const AdminPrivateRouter = (props) => {
  let customerData = JSON.parse(localStorage.getItem(USER_KEY));
  return customerData && customerData.role === 2 ? (
    <AdminLayout {...props} />
  ) : (
    <Navigate to="/admin/login" />
  );
};

export default AdminPrivateRouter;
