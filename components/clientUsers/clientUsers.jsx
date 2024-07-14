"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import { MdAdd } from "react-icons/md";

const ClientUsers = ({ users, user }) => {
  const [allUsers] = useState(users);
  const [gridHeight, setGridHeight] = useState("400px");
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const windowHeight = window.innerHeight;
        const containerTop = containerRef.current.getBoundingClientRect().top;
        const footerHeight = 200; // Adjust based on your footer height
        const newHeight = windowHeight - containerTop - footerHeight;
        setGridHeight(`${Math.max(400, newHeight)}px`);
      }
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "Co-Host":
        return "bg-blue-100 text-blue-800";
      case "Maid":
        return "bg-green-100 text-green-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "Driver":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Users</h1>
      <div className="bg-white rounded-lg shadow-md p-6" ref={containerRef}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Your Teammates
          </h2>
          {user.role === "admin" && (
            <Link href="/dashboard/users/add">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-300">
                <MdAdd className="mr-2" />
                Add New
              </button>
            </Link>
          )}
        </div>
        <div style={{ height: gridHeight, width: "100%" }}>
          <DataGrid
            columns={columns}
            rows={allUsers}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            className="border-none"
            sx={{
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f3f4f6",
              },
              "& .MuiDataGrid-virtualScroller": {
                overflowY: "auto",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientUsers;
