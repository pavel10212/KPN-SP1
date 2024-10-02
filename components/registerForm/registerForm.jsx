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
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

const InputFieldWithTooltip = ({field, label, value, onChange, error, tooltipText}) => (
    <div>
        <label htmlFor={field} className="block text-sm font-medium text-gray-700 flex items-center">
            {label}
            {tooltipText && (
                <Tooltip title={tooltipText} arrow>
                    <IconButton size="small" aria-label={`info about ${field}`}>
                        <InfoIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
            )}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <input
                id={field}
                name={field}
                type={field.includes("password") ? "password" : "text"}
                required
                value={value}
                onChange={onChange}
                className={`appearance-none block w-full px-3 py-2 border ${error ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out`}
            />
            {error && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <MdError className="h-5 w-5 text-red-500"/>
                </div>
            )}
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
);

export default function RegisterForm() {
    const router = useRouter();
    const {setIsLoading} = useLoading();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        api_key: "",
        prop_key: "",
    });
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            if (formData.password !== formData.confirm_password) {
                throw new Error("Passwords do not match");
            }

            const dataToSubmit = {...formData};
            registerSchema.parse(dataToSubmit);

            const response = await fetch("/api/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(dataToSubmit),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Registration failed: ${response.status} ${response.statusText}. ${errorBody || 'No additional error information available.'}`);
            }

            const user = await response.json();

            const dataResponse = await fetch("/api/data", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(user.userId),
            });

            if (!dataResponse.ok) {
                const errorBody = await dataResponse.text();
                throw new Error(`Failed to fetch data: ${dataResponse.status} ${dataResponse.statusText}. ${errorBody || 'No additional error information available.'}`);
            }

            const result = await dataResponse.json();

            const createResponse = await fetch("/api/createBookings", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({userId: user.userId, bookingsData: result}),
            });

            if (!createResponse.ok) {
                const errorBody = await createResponse.text();
                throw new Error(`Failed to create bookings: ${createResponse.status} ${createResponse.statusText}. ${errorBody || 'No additional error information available.'}`);
            }

            toast.success("Registration successful");
            router.push("/login");
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors = {};
                error.issues.forEach((issue) => {
                    newErrors[issue.path[0]] = issue.message;
                });
                setErrors(newErrors);
            } else if (error.message === "Passwords do not match") {
                setErrors({confirm_password: "Passwords do not match"});
            } else {
                toast.error(`An error occurred: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
        if (errors[name]) {
            setErrors((prev) => ({...prev, [name]: ""}));
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
                <motion.div className="sm:mx-auto sm:w-full sm:max-w-md" variants={itemVariants}>
                    <Image className="mx-auto" width={120} height={120} src="/logo5.png" alt="Your Company"/>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
                </motion.div>

                <motion.div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" variants={itemVariants}>
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 rounded-xl">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {["name", "email", "password", "confirm_password"].map((field, index) => (
                                <motion.div key={field} variants={itemVariants} initial="hidden" animate="visible"
                                            transition={{delay: index * 0.1}}>
                                    <InputFieldWithTooltip
                                        field={field}
                                        label={field === "confirm_password" ? "Confirm Password" : field.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        error={errors[field]}
                                    />
                                </motion.div>
                            ))}

                            {["api_key", "prop_key"].map((field, index) => (
                                <motion.div key={field} variants={itemVariants} initial="hidden" animate="visible"
                                            transition={{delay: (index + 4) * 0.1}}>
                                    <InputFieldWithTooltip
                                        field={field}
                                        label={field.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        error={errors[field]}
                                        tooltipText="This is a key from beds24"
                                    />
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