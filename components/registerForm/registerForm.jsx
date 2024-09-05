"use client";

import {useState} from "react";
import {z} from "zod";
import {registerSchema} from "@/lib/zod";
import Image from "next/image";
import {MdError} from "react-icons/md";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export default function RegisterForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        api_key: "",
        prop_key: "",
    });
    const [errors, setErrors] = useState({});
    const [data, setData] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            registerSchema.parse(formData);
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const data = await fetch("api/data")
                if (data.ok) {
                    const result = await data.json();
                    setData(result);

                    // Create bookings

                    const createResponse = await fetch("/api/createBookings", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(result),
                    });

                    if (!createResponse.ok) {
                        throw new Error("Failed to create bookings");
                    }
                    const createdBookings = await createResponse.json();
                    console.log("Created bookings:", createdBookings);

                } else {
                    console.error("Failed to fetch data");
                    toast.error("Failed to fetch data");
                }
                console.log("Registration successful");
                toast.success("Registration successful");
                router.push("/login");
            } else {
                // Handle registration error
                console.error("Registration failed");
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors = {};
                error.issues.forEach((issue) => {
                    newErrors[issue.path[0]] = issue.message;
                });
                setErrors(newErrors);
            }
        }
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        if (errors[e.target.name]) {
            setErrors({...errors, [e.target.name]: ""});
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Image
                    className="mx-auto"
                    width={180}
                    height={180}
                    src="/logo5.png"
                    alt="Your Company"
                />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Register your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 rounded-xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {["name", "email", "password", "api_key", "prop_key"].map(
                            (field) => (
                                <div key={field}>
                                    <label
                                        htmlFor={field}
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        {field
                                            .split("_")
                                            .map(
                                                (word) => word.charAt(0).toUpperCase() + word.slice(1)
                                            )
                                            .join(" ")}
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            id={field}
                                            name={field}
                                            type={field === "password" ? "password" : "text"}
                                            required
                                            value={formData[field]}
                                            onChange={handleChange}
                                            className={`appearance-none block w-full px-3 py-2 border ${
                                                errors[field] ? "border-red-300" : "border-gray-300"
                                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                        />
                                        {errors[field] && (
                                            <div
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <MdError className="h-5 w-5 text-red-500"/>
                                            </div>
                                        )}
                                    </div>
                                    {errors[field] && (
                                        <p className="mt-2 text-sm text-red-600">{errors[field]}</p>
                                    )}
                                </div>
                            )
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5fb9e6] hover:bg-[#3a8ab7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3a8ab7]"
                            >
                                Register
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <a
                                href="/login"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#5fb9e6] bg-gray-50 hover:bg-gray-100"
                            >
                                Sign in
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
