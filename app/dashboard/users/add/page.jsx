"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { registerSchema } from "@/lib/zod";

const AddMemberPage = () => {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Co-Host",
    session: session,
  });

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
        console.log("Registration successful");
      } else {
        const errorText = await response.text();
        console.error("Registration failed:", errorText);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error.issues, "ZODERROR");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="p-5 rounded-xl mt-5">
      <h1>ADD</h1>
      <form className="flex flex-wrap justify-between" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          name="name"
          required
          value={formData.fullName}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <label htmlFor="role">Select the role</label>
        <select
          name="role"
          required
          value={formData.role}
          onChange={handleChange}
        >
          <option value="Co-Host">Co-Host</option>
          <option value="Maid">Maid</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Driver">Driver</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddMemberPage;
