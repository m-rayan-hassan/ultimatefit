import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { muscles, equipment } = reqBody;

    const prompt = `You are an expert, certified fitness trainer and strength coach.  
Task: Given a list of target muscles and available equipment, return up to **three (3)** safe, effective exercise recommendations **per muscle**. Prioritize exercises that use the user's supplied equipment. If the selected equipment cannot reasonably target a requested muscle, propose practical substitutions and explain how to adapt the movement safely.

Important rules:
1. Output **only a valid JSON array** (no surrounding prose).  
2. Each array element must represent one muscle object with these keys:
   - "muscle": string (name exactly as given)
   - "exercises": array of up to 3 exercise objects. Each exercise object must include:
     - "name": string  
     - "primary_equipment": array of strings (equipment used, chosen from the user's list if possible; otherwise list chosen substitute(s))  
     - "steps": array of short step strings (3–6 steps, concise, actionable)  
     - "notes": optional short string (modifications, safety tips, tempo cues)  
     - "difficulty": one of "beginner" | "intermediate" | "advanced"  
     - "youtube": a **short video** tutorial of that exercise only for eg. if the exercise is "hanging leg raises" you will only give video of "hanging leg raises" instead of videos like "complete abs workout",. Note: only give valid youtbue tutorials that exist and you will ensure that you only give the tutorial of that exercise for example if the exercise is "dumbbell chest press" you wilil only give tutorial of "dumbbell chest press" only and not "dumbbell fly or barbell press". And you will give the embed link like "https://www.youtube.com/embed/4Y2ZdHCOXok?si=621TxB8eXZ-DoJaX"  instead of original one.
3. Use the user's equipment first. If a muscle cannot be trained well with the provided equipment, give **one safe substitution** (e.g., "use dumbbell + bench for single-arm rows") and explain in one sentence why it’s appropriate.  
4. Max 3 exercises per muscle. Do not list more.  
5. Keep each "steps" item short (one sentence each). Avoid long essays.  
6. Avoid inventing non-existent equipment; suggest common, safe alternatives (dumbbell, kettlebell, resistance band, bodyweight, bench).  
7. If an exercise requires a variation for left/right sides (e.g., single-arm), indicate it in "notes".  

Input:
- Muscles: ${muscles}
- Equipment: ${equipment}

Example output schema (actual values must follow this structure):  

[
  {
    "muscle": "chest",
    "exercises": [
      {
        "name": "Dumbbell Bench Press",
        "primary_equipment": ["dumbbell","bench"],
        "steps": ["Lie on bench holding dumbbells at chest","Press dumbbells up until arms extended","Lower under control to chest level"],
        "notes": "Use spotter if heavy; use neutral wrist if shoulder pain",
        "difficulty": "intermediate",
        "youtube": "https://www.youtube.com/embed/4Y2ZdHCOXok?si=621TxB8eXZ-DoJaX"
      }
    ]
  }
]
`;

    const result = await generateText({
      model: openai("gpt-4"),
      prompt,
    });

    return NextResponse.json(
      {
        exercises: result.text,
        message: "Exercises suggested successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Could not suggest exercises",
        details: String(error),
      },
      {
        status: 500,
      }
    );
  }
}
