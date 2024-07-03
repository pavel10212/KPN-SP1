"use client";

import { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/data");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
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
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default Page;
