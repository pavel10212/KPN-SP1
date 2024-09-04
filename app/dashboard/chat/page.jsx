import { auth } from "@/auth";
import ChatComponent from "@/components/chatComponent/chatcomponent";
import prisma from "@/app/api/prismaClient";

export default async function ChatPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
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
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-xl font-semibold text-gray-800">User not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-indigo-600 p-4">
        <h1 className="text-2xl font-semibold text-white">Team Chat</h1>
      </div>
      <div className="flex-grow overflow-hidden">
        <ChatComponent
          userName={user.name.replace(/\s+/g, "_").toLowerCase()}
          userSecret={user.chatEnginePassword}
          user={user}
        />
      </div>
    </div>
  );
}
