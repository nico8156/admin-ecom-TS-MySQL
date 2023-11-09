import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    { params } : { params: { billboardid: string}}
) {
    try {

        if(!params.billboardid){
            return new NextResponse("Billboard ID is required", {status: 400})
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardid,
            }
        });

        return NextResponse.json(billboard);
        
    } catch (error) {
        console.log('[BILLBOARD_GET]', error)
        return new NextResponse("internal error", {status: 500});
    }
}

export async function PATCH(
    req: Request,
    { params } : { params: { storeid: string, billboardid: string}}
) {
    try {

        const { userId } = auth();
        const body = await req.json();
        

        const { label, imageUrl } = body;


        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!label){
            return new NextResponse("Label is required" , {status: 400})
        }

        if(!imageUrl){
            return new NextResponse("Image URL is required" , {status: 400})
        }

        if(!params.billboardid){
            return new NextResponse("Billboard ID is required", {status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeid,
                userId
            }
        });

        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status: 403})
        }

        const billboard = await prismadb.billboard.updateMany({
            
            where: {
                id: params.billboardid
            },
            data: {
                label,
                imageUrl
            }
        });

        return NextResponse.json(billboard);
        
    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error)
        return new NextResponse("internal error", {status: 500});
    }
}

export async function DELETE(
    req: Request,
    { params } : { params: { storeId: string, billboardid: string}}
) {
    try {

        const { userId } = auth();

        if(!params.billboardid){
            return new NextResponse("Billboard ID is required", {status: 400})
        }
        
        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401})
            
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeid,
                userId
            }
        });

        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status: 403})
        }


        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardid,
            }
        });

        return NextResponse.json(billboard);
        
    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error)
        return new NextResponse("internal error", {status: 500});
    }
}