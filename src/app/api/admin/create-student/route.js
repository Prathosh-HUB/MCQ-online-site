import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request){

    const body=await request.json();

    const hash=await bcrypt.hash(body.password,10);

    const user=await prisma.user.create({

        data:{

            name:body.name,

            email:body.email,

            password:hash,

            role:"STUDENT"

        }

    });

    return NextResponse.json(user);

}