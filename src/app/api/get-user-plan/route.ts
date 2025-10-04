import dbConnect from "@/lib/dbConnect";
import PlanModel from "@/models/Plan";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    dbConnect();
    const {userId} = await request.json();
    const plans = await PlanModel.find({userId: userId}).sort({createdAt: -1});

    if (!plans) {
        console.log("no Plans");
        
        return NextResponse.json({message: "User has not plans"}, {status: 200});
    }
    
    return NextResponse.json({plans}, {status: 200});
}