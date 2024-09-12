"use client";

import {useState} from "react";
import {z} from "zod";
import {registerSchema} from "@/lib/zod";
import Image from "next/image";
import {MdError} from "react-icons/md";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {motion} from "framer-motion";
import {LoadingWrapper, useLoading} from "@/components/loading/loadingWrapper";

export default function RegisterForm() {
    const router = useRouter();
    const {setIsLoading} = useLoading();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        api_key: "",
        prop_key: "",
    });
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (formData.password !== formData.confirmPassword) {
                setErrors({...errors, confirmPassword: "Passwords do not match"});
                setIsLoading(false);
                return;
            }
            const {confirmPassword, ...dataToSubmit} = formData;
            registerSchema.parse(dataToSubmit);
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(dataToSubmit),
            });
            const user = await response.json();
            if (response.ok) {
                const data = await fetch("api/data", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(user.userId),
                });
                if (data.ok) {
                    const result = await data.json();

                    const createResponse = await fetch("/api/createBookings", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                                userId: user.userId,
                                bookingsData: result
                            }
                        ),
                    });

                    if (!createResponse.ok) {
                        const errorBody = await createResponse.text();
                        throw new Error(`Failed to create bookings: ${createResponse.status} ${createResponse.statusText}. ${errorBody || 'No additional error information available.'}`);
                    }
                    const createdBookings = await createResponse.json();
                    console.log("Created bookings:", createdBookings);

                } else {
                    const errorBody = await data.text();
                    console.error("Failed to fetch data", data.status, data.statusText, errorBody);
                    toast.error(`Failed to fetch data: ${data.status} ${data.statusText}. ${errorBody || 'No additional error information available.'}`);
                    setIsLoading(false);
                    return;
                }
                setIsLoading(false);
                console.log("Registration successful");
                toast.success("Registration successful");
                router.push("/login");
            } else {
                setIsLoading(false);
                const errorBody = await response.text();
                console.error("Registration failed", response.status, response.statusText, errorBody);
                toast.error(`Registration failed: ${response.status} ${response.statusText}. ${errorBody || 'No additional error information available.'}`);
            }
        } catch (error) {
            setIsLoading(false);
            if (error instanceof z.ZodError) {
                const newErrors = {};
                error.issues.forEach((issue) => {
                    newErrors[issue.path[0]] = issue.message;
                });
                setErrors(newErrors);
            } else {
                console.error("An unexpected error occurred", error);
                toast.error(`An unexpected error occurred: ${error.message}`);
            }
        }
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        if (errors[e.target.name]) {
            setErrors({...errors, [e.target.name]: ""});
        }
    };

    const containerVariants = {
        hidden: {opacity: 0},
        visible: {opacity: 1, transition: {duration: 0.5}},
    };

    const itemVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {opacity: 1, y: 0, transition: {duration: 0.5}},
    };

    return (
        <LoadingWrapper>
            <motion.div
                className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex flex-col justify-center sm:px-6 lg:px-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="sm:mx-auto sm:w-full sm:max-w-md"
                    variants={itemVariants}
                >
                    <Image
                        className="mx-auto"
                        width={120}
                        height={120}
                        src="/logo5.png"
                        alt="Your Company"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </motion.div>

                <motion.div
                    className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
                    variants={itemVariants}
                >
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 rounded-xl">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {["name", "email", "password", "confirmPassword", "api_key", "prop_key"].map((field, index) => (
                                <motion.div
                                    key={field}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{delay: index * 0.1}}
                                >
                                    <label
                                        htmlFor={field}
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        {field === "confirmPassword"
                                            ? "Confirm Password"
                                            : field
                                                .split("_")
                                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                .join(" ")}
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            id={field}
                                            name={field}
                                            type={field.includes("password") ? "password" : "text"}
                                            required
                                            value={formData[field]}
                                            onChange={handleChange}
                                            className={`appearance-none block w-full px-3 py-2 border ${
                                                errors[field] ? "border-red-300" : "border-gray-300"
                                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out`}
                                        />
                                        {errors[field] && (
                                            <div
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <MdError className="h-5 w-5 text-red-500"/>
                                            </div>
                                        )}
                                    </div>
                                    {errors[field] && <p className="mt-2 text-sm text-red-600">{errors[field]}</p>}
                                </motion.div>
                            ))}

                            <motion.div variants={itemVariants}>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                >
                                    Register
                                </button>
                            </motion.div>
                        </form>

                        <motion.div className="mt-6" variants={itemVariants}>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <a
                                    href="/login"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition duration-150 ease-in-out"
                                >
                                    Sign in
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </LoadingWrapper>
    );
}