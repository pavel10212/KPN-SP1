import { auth } from "@/auth";
import ChatComponent from "@/components/chatComponent/chatcomponent";
import prisma from "@/app/api/prismaClient";

export default async function ChatPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-xl font-semibold text-gray-800">
            Please log in to access the chat.
          </p>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      chatEnginePassword: true,
    },
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-xl font-semibold text-gray-800">User not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-indigo-600 p-4">
            <h1 className="text-2xl font-semibold text-white">Team Chat</h1>
          </div>
          <ChatComponent
            userName={user.name.replace(/\s+/g, "_").toLowerCase()}
            userSecret={user.chatEnginePassword}
          />
        </div>
      </div>
    </div>
  );
}
