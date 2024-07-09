// app/chat/page.js
import { auth } from "@/auth";
import ChatComponent from "@/components/chatComponent/chatcomponent";
import prisma from "@/app/api/prismaClient";

export default async function ChatPage() {
  const session = await auth();

  if (!session) {
    return <div>Please log in to access the chat.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      chatEnginePassword: true,
    },
  });

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen rounded-lg">
      <div className="container mx-auto py-8 m-5 rounded-lg">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ChatComponent
            userName={user.name.replace(/\s+/g, "_").toLowerCase()}
            userSecret={user.chatEnginePassword}
          />
        </div>
      </div>
    </div>
  );
}
