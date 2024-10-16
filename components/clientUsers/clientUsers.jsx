"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import { MdAdd } from "react-icons/md";
import { toast } from "sonner";
import { Delete as DeleteIcon } from "@mui/icons-material";

const ClientUsers = ({ users, user }) => {
  const [allUsers, setAllUsers] = useState(users);
  const [gridHeight, setGridHeight] = useState("400px");
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const newHeight =
          window.innerHeight -
          containerRef.current.getBoundingClientRect().top -
          200;
        setGridHeight(`${Math.max(400, newHeight)}px`);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setAllUsers(users);
  }, [users]);

  const columns = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    {
      field: "createdAt",
      headerName: "Created at",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <span>{new Date(params.value).toLocaleString()}</span>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(
            params.value
          )}`}
        >
          {params.value}
        </span>
      ),
    },
  ];

  if (user.role === "admin") {
    columns.push({
      field: "actions",
      headerName: "Delete",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <button
          className="bg-red-600 hover:bg-gray-700 text-white text-sm font-semibold py-1 px-3 rounded-xl transition duration-300 transform hover:scale-105"
          onClick={() => handleDelete(params.row.id)}
        >
          Delete
        </button>
      ),
    });
  }

  const getRoleColor = (role) => {
    const roleColors = {
      admin: "bg-red-100 text-red-800",
      "Co-Host": "bg-blue-100 text-blue-800",
      Maid: "bg-green-100 text-green-800",
      Maintenance: "bg-yellow-100 text-yellow-800",
      Driver: "bg-purple-100 text-purple-800",
    };
    return roleColors[role] || "bg-gray-100 text-gray-800";
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const response = await fetch("/api/deleteUser", {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setAllUsers(allUsers.filter((user) => user.id !== id));
      } else {
        console.error("Failed to delete");
        toast.error("Failed to delete user");
      }
    }
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-md p-6" ref={containerRef}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Your Teammates
          </h2>
          {user.role === "admin" && (
            <Link href="/dashboard/users/add">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 text-xs sm:text-base rounded-lg flex items-center transition duration-300">
                <MdAdd className="mr-1 sm:mr-2 text-sm sm:text-base" />
                <span className="hidden sm:inline">Add New</span>
                <span className="sm:hidden">Add</span>
              </button>
            </Link>
          )}
        </div>
        <div style={{ height: "auto", width: "100%" }}>
          <DataGrid
            columns={columns}
            rows={allUsers}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            className="border-none"
            sx={{
              "& .MuiDataGrid-cell:focus": { outline: "none" },
              "& .MuiDataGrid-row:hover": { backgroundColor: "#f3f4f6" },
              "& .MuiDataGrid-virtualScroller": { overflowY: "auto" },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientUsers;
