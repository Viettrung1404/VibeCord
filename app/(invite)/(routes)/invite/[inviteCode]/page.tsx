import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
    params: Promise<{ 
        inviteCode: string 
    }>
}

const InviteCodePage = async ({
    params
}: InviteCodePageProps) => {
    const { inviteCode } = await params; // await params trước
    
    const profile = await currentProfile();

    if (!profile) {
        return redirect('/');
    }
    
    if (!inviteCode) {
        return redirect('/');
    }

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode, // dùng biến đã await
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`);
    }

    const server = await db.server.update({
        where: {
            inviteCode // dùng biến đã await
        },
        data: {
            members: {
                create: {
                    profileId: profile.id,
                }
            }
        }
    });

    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return null;
}
 
export default InviteCodePage;