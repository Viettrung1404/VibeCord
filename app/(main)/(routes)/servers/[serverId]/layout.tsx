import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import ServerSidebar from "@/components/server/server-sidebar";
const ServerIdLayout = async ({ 
    children, 
    params,
}: { 
    children: React.ReactNode;
    params: Promise<{ serverId: string }>;
}) => {
    const profile = await currentProfile();
    if (!profile) {
       return redirect('/login');
    }
    
    const server = await db.server.findUnique({
        where: {
            id: (await params).serverId,
            members: {
                some: { 
                    profileId: profile.id
                }
            }
        }
    });

    if (!server) {
        redirect('/');
    }
    return ( 
        <div className="h-full">
            <div 
                className="hidden md:flex h-full w-60 z-20 flex-col inset-y-0 fixed">
                <ServerSidebar serverId={ (await params).serverId} />
            </div>
            <main className="h-full md:pl-60">
                { children }    
            </main>
        </div>
     );
}
 
export default ServerIdLayout;