import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    { params } : { params: { colorId: string}}
) {
    try {

        if(!params.colorId){
            return new NextResponse("Size ID is required", {status: 400})
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,
            }
        });

        return NextResponse.json(color);
        
    } catch (error) {
        console.log('[COLOR_GET]', error)
        return new NextResponse("internal error", {status: 500});
    }
}

export async function PATCH(
    req: Request,
    { params } : { params: { storeid: string, colorId: string}}
) {
    try {

        const { userId } = auth();
        const body = await req.json();
        

        const { name, value } = body;


        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!name){
            return new NextResponse("Name is required" , {status: 400})
        }

        if(!value){
            return new NextResponse("Value is required" , {status: 400})
        }

        if(!params.colorId){
            return new NextResponse("Size ID is required", {status: 400})
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

        const color = await prismadb.color.updateMany({
            
            where: {
                id: params.colorId
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color);
        
    } catch (error) {
        console.log('[SIZE_PATCH]', error)
        return new NextResponse("internal error", {status: 500});
    }
}

export async function DELETE(
    req: Request,
    { params } : { params: { storeid: string, colorId: string}}
) {
    try {

        const { userId } = auth();

        if(!params.colorId){
            return new NextResponse("Color ID is required", {status: 400})
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


        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,
            }
        });

        return NextResponse.json(color);
        
    } catch (error) {
        console.log('[COLOR_DELETE]', error)
        return new NextResponse("internal error", {status: 500});
    }
}