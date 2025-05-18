import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Image from "next/image";
import Link from "next/link";

// Extend the Session type to include id_token
declare module "next-auth" {
  interface Session {
    id_token?: string;
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Not signed in</h1>
        <Link
          href="/api/auth/signin/keycloak?callbackUrl=/profile"
          className="rounded bg-blue-600 text-white px-4 py-2">
          Sign in with Keycloak
        </Link>
      </div>
    );
  }
  else
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {session.user?.image && (
        <Image src={session.user.image} alt="User avatar" width={80} height={80} className="rounded-full mb-4" />
      )}
      <div className="mb-2 text-lg">Name: <span className="font-semibold">{session.user?.name}</span></div>
      <div className="mb-2 text-lg">Email: <span className="font-semibold">{session.user?.email}</span></div>
      <div>
      {typeof session === 'object' && session.id_token && (
        <div className="w-full max-w-2xl mt-4">
          <label className="block text-xs font-semibold mb-1 text-gray-700">ID Token:</label>
          <pre className="break-all bg-gray-900 text-green-200 text-xs p-3 rounded border border-gray-300 shadow-inner overflow-x-auto">
            {String(session.id_token ?? "")}
          </pre>
        </div>
      )}
      </div>
      <form action="/api/auth/signout" method="POST" className="mt-6">
        <input type="hidden" name="callbackUrl" value="/" />
        <button type="submit" className="rounded bg-red-500 text-white px-4 py-2">Sign out</button>
      </form>
      <Link href="/" className="mt-4 text-blue-600 underline">
        Back to Home
      </Link>
    </div>
  );
}
