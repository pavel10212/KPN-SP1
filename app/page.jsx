import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1>Welcome to KPN Senior Project 1</h1>
      <a href="/login">Go to Login</a>
    </div>
  );
}
