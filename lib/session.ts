import { auth } from "./auth";

export async function getServerSession() {
  return await auth();
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}
