import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  props: { params: Promise<{ serverId: string }> }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { serverId } = await props.params; // await params
    if (!serverId) {
      return new Response("Server ID is required", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("Failed to generate new invite link", error);
    return new Response("Internal Error", { status: 500 });
  }
}