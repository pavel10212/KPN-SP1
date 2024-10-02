"use client";

import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";
import {useState} from "react";
import {signInSchema} from "@/lib/zod";
import Image from "next/image";
import {z} from "zod";
import {MdError} from "react-icons/md";
import {toast} from "sonner";
import {motion} from "framer-motion";

const LoginPage = () => {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [errors, setErrors] = useState({});

    const errorMessages = {
        CredentialsSignin: "Invalid email or password.",
        default: "An unexpected error occurred.",
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            signInSchema.parse({email: userEmail, password: userPassword});
            const result = await signIn("credentials", {
                email: userEmail,
                password: userPassword,
                redirect: false,
            });
            if (result?.error) {
                setErrors({general: errorMessages[result.error] || errorMessages.default});
            } else {
                toast.success("Login successful");
                router.push("/dashboard");
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                const newErrors = {};
                err.issues.forEach((issue) => {
                    newErrors[issue.path[0]] = issue.message;
                });
                setErrors(newErrors);
            } else {
                console.error(err);
                setErrors({general: errorMessages.default});
            }
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 to-indigo-100">
            <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}}
                        className="sm:mx-auto sm:w-full sm:max-w-md">
                <Image className="mx-auto" width={120} height={120} src="/logo5.png" alt="Your Company"/>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome back</h2>
            </motion.div>

            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.2}} className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email
                                address</label>
                            <div className="mt-1">
                                <input id="email" name="email" type="email" autoComplete="email" required
                                       value={userEmail} onChange={(e) => setUserEmail(e.target.value)}
                                       className={`appearance-none block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}/>
                            </div>
                            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password"
                                   className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1">
                                <input id="password" name="password" type="password" autoComplete="current-password"
                                       required value={userPassword} onChange={(e) => setUserPassword(e.target.value)}
                                       className={`appearance-none block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}/>
                            </div>
                            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        {errors.general && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <MdError className="h-5 w-5 text-red-400" aria-hidden="true"/>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{errors.general}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">Sign
                                in
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Not a member?</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <a href="/register"
                               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">Register</a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;