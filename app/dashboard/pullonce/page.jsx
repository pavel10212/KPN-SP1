import React from "react";

import { pushBookings } from "@/lib/actions";

const page = () => {
  return <div>{pushBookings()}</div>;
};

export default page;
