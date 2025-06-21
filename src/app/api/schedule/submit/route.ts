import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const editingId = formData.get("editingId") as string;

  const session = await getServerSession(authOptions);
  // Adjust the following line based on where your access token is stored in the session object
  const accessToken = (session as { access_token?: string })?.access_token;

  const baseUrl = process.env.NEXTAUTH_URL || req.nextUrl.origin;

  if (!accessToken) {
    return NextResponse.redirect(`${baseUrl}/schedule?error=unauthorized`, { status: 302 });
  }

  const method = editingId ? "PUT" : "POST";
  const url = editingId ? `${baseUrl}/api/schedule/${editingId}` : `${baseUrl}/api/schedule`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ title, date }),
  });

  if (!res.ok) {
    return NextResponse.redirect(`${baseUrl}/schedule?error=save_failed`, { status: 302 });
  }

  return NextResponse.redirect(`${baseUrl}/schedule`, { status: 302 });
}
