import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
  //Force pushing chages
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <Image
          src="/favicon.ico"
          alt="KPN Logo"
          width={100}
          height={100}
          className="mx-auto mb-6"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to KPN Senior Project 1
        </h1>
        <p className="text-gray-600 mb-8">
          Streamline your property management with our innovative platform.
        </p>
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Get Started
        </Link>
      </div>
      <footer className="mt-8 text-center text-gray-600">
        <p>&copy; 2024 KPN Senior Project. All rights reserved.</p>
      </footer>
    </div>
  );
}
