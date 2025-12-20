import { createAgentUIStreamResponse, type UIMessage } from "ai";
import { auth } from "@clerk/nextjs/server";
import { createShoppingAgent } from "@/lib/ai/shopping-agent";

export async function POST(request: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json();

    // Get the user's session - userId will be null if not authenticated
    const { userId } = await auth();

    // Create agent with user context (orders tool only available if authenticated)
    const agent = createShoppingAgent({ userId });

    return createAgentUIStreamResponse({
      agent,
      messages,
    });
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
