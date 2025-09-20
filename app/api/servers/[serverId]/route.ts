import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    props: { params: Promise<{ serverId: string }> }
) {
    try {
        const profile = await currentProfile();
        const { name, imageUrl } = await req.json();
        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }
        const server = await db.server.update({
            where: {
                id: (await props.params).serverId,
                profileId: profile.id,
            },
            data: {
                name,
                imageUrl,
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("Failed to edit server", error);
        return new Response("Internal Error", { status: 500 });
    }
}