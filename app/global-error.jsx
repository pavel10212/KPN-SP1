"use client";

import { useEffect } from "react";

export default function GlobalError({ error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html className="h-full">
      <body className="h-full">
        <div className="min-h-full bg-gray-100 py-16 px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
          <div className="max-w-max mx-auto">
            <main className="sm:flex">
              <p className="text-4xl font-bold text-indigo-600 sm:text-5xl">500</p>
              <div className="sm:ml-6">
                <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                  <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
                    Oops! Something went wrong.
                  </h1>
                  <p className="mt-1 text-base text-gray-500">
                    We apologize for the inconvenience. Our team has been notified and is working on a fix.
                  </p>
                </div>
                <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                  <a
                    href="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Go back home
                  </a>
                </div>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
