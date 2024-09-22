import * as React from "react";
import Image from "next/image";

export const EmailTemplate = ({ firstName, role, password, email }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-sans">
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-indigo-600 p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white">Welcome, {firstName}!</h1>
      </div>
      <div className="p-6 space-y-4">
        <p className="text-gray-800 text-lg">
          We're thrilled to have you join our team as a{" "}
          <span className="font-semibold text-indigo-600">{role}</span>.
        </p>
        <p className="text-gray-700">
          Your account has been successfully created. Here are your login
          details:
        </p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Email: <span className="font-medium">{email}</span>
          </p>
          <p className="text-sm text-gray-600">
            Password: <span className="font-medium">{password}</span>
          </p>
        </div>
      </div>
      <div className="bg-gray-50 p-4 text-center">
        <p className="text-sm text-gray-500">
          © 2024 KPN-SP1. All rights reserved.
        </p>
      </div>
    </div>
  </div>
);

export default EmailTemplate;
