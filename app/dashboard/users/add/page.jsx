"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { registerSchema } from "@/lib/zod";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MdCheckCircle, MdError, MdArrowBack } from "react-icons/md";

const AddMemberPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Co-Host",
    session: session,
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      session: session,
    }));
  }, [session]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session || !session.user || !session.user.email) {
      console.error("Session token is not available.");
      return;
    }
    try {
      registerSchema.parse(formData);
      const response = await fetch("/api/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitStatus("success");
        setTimeout(() => router.push("/dashboard/users"), 2000);
      } else {
        const errorText = await response.text();
        console.error("Registration failed:", errorText);
        setSubmitStatus("error");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors);
      } else {
        console.error("Unexpected error:", error);
        setSubmitStatus("error");
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6 shadow-lg relative">
          <button
            onClick={() => router.back()}
            className="absolute top-3 right-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
          >
            <MdArrowBack className="mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            Add New <br />
            Team Member
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6 mt-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="Co-Host">Co-Host</option>
                  <option value="Maid">Maid</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Driver">Driver</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Add Team Member
              </button>
            </form>
            {submitStatus && (
              <Alert
                variant={submitStatus === "success" ? "default" : "destructive"}
                className="mt-6"
              >
                {submitStatus === "success" ? (
                  <MdCheckCircle className="h-4 w-4" />
                ) : (
                  <MdError className="h-4 w-4" />
                )}
                <AlertTitle>
                  {submitStatus === "success" ? "Success!" : "Error!"}
                </AlertTitle>
                <AlertDescription>
                  {submitStatus === "success"
                    ? "New team member has been successfully added."
                    : "There was an error adding the team member. Please try again."}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberPage;
