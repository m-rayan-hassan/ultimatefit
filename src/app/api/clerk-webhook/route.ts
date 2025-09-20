import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  dbConnect();
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error("Please add a webhook secret in .env");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Error occured - No Svix headers");
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook", error);
    return new NextResponse("Error occured", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    try {
      const { id, first_name, last_name, image_url, email_addresses } =
        evt.data;
      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      const newUser = new UserModel({
        email,
        name,
        image: image_url,
        clerkId: id,
      });
      await newUser.save();

      console.log("User created successfully");
      return new NextResponse("User created!", { status: 200 });
    } catch (error) {
      console.log("Error creating user: ", error);
      return new NextResponse("Error creating user", { status: 500 });
    }
  }
}
