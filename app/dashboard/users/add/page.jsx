"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MdArrowBack, MdCheckCircle, MdError } from "react-icons/md";

const AddMemberPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
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
    if (!session?.user?.email) {
      console.error("Session token is not available.");
      return;
    }
    try {
      const response = await fetch("/api/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        try {
          const emailResponse = await fetch("/api/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: formData.email,
              name: formData.name,
              role: formData.role,
              password: formData.password,
              email: formData.email,
            }),
          });

          if (!emailResponse.ok) {
            console.error("Failed to send welcome email");
          }
        } catch (emailError) {
          console.error("Error sending welcome email:", emailError);
        }

        setSubmitStatus("success");
        setTimeout(() => router.push("/dashboard/users"), 1000);
      } else {
        console.error("Registration failed:", await response.text());
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Caught an error:", error);
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors);
      } else {
        setSubmitStatus("error");
      }
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="relative">
          <button
            onClick={() => router.back()}
            className="absolute top-3 right-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
          >
            <MdArrowBack className="mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Add New</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Team Member</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  defaultValue=""
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                >
                  <option value="">Select Role</option>
                  <option value="Co-Host">Co-Host</option>
                  <option value="Maid">Maid</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Driver">Driver</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
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
                  <MdCheckCircle className="h-5 w-5" />
                ) : (
                  <MdError className="h-5 w-5" />
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
