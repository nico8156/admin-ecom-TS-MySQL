import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    { params } : { params: { storeid: string}}
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
        if(!params.storeid){
            return new NextResponse("Store ID is required" , {status: 400})
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

        const size = await prismadb.size.create({
            
            data: {
                name,
                value,
                storeid: params.storeid
            }
        });


        return NextResponse.json(size);
        
    } catch (error) {
        console.log('[SIZES_POST]', error)
        return new NextResponse("internal error", {status: 500});
    }
}

export async function GET(
    req: Request,
    { params } : { params: { storeid: string}}
) {
    try {

        if(!params.storeid){
            return new NextResponse("Store ID is required" , {status: 400})
        }

        const sizes = await prismadb.size.findMany({
            
            where: {
                storeid: params.storeid,
            }
        });


        return NextResponse.json(sizes);
        
    } catch (error) {
        console.log('[SIZES_POST]', error)
        return new NextResponse("internal error", {status: 500});
    }
}
