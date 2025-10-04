import { openai } from "@ai-sdk/openai";
import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import PlanModel from "@/models/Plan";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: NextRequest) {
  dbConnect();
  const reqBody = await request.json();
  const {
    age,
    weight,
    height,
    injuries,
    fitness_goal,
    workout_days,
    dietary_restrictions,
    fitness_level,
    food_preferences,
    user_id,
    full_name,
  } = reqBody;

  console.log("Age:", age);
  console.log("Weight:", weight);
  console.log("Height:", height);
  console.log("Injuries:", injuries);
  console.log("Fitness Goal:", fitness_goal);
  console.log("Workout Days:", workout_days);
  console.log("Dietary Restrictions:", dietary_restrictions);
  console.log("Fitness Level:", fitness_level);
  console.log("Food Preferences:", food_preferences);
  console.log("User ID:", user_id);
  console.log("Full Name:", full_name);

  const workoutPrompt = `You are an experienced fitness coach creating a personalized workout plan based on:
        Age: ${age}
        Height: ${height}
        Weight: ${weight}
        Injuries or limitations: ${injuries}
        Available days for workout: ${workout_days}
        Fitness goal: ${fitness_goal}
        Fitness level: ${fitness_level}
        
        As a professional coach:
        - Consider muscle group splits to avoid overtraining the same muscles on consecutive days
        - Design exercises that match the fitness level and account for any injuries
        - Structure the workouts to specifically target the user's fitness goal
        
        CRITICAL SCHEMA INSTRUCTIONS:
        - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
        - "sets" and "reps" MUST ALWAYS be NUMBERS, never strings
        - For example: "sets": 3, "reps": 10
        - Do NOT use text like "reps": "As many as possible" or "reps": "To failure"
        - Instead use specific numbers like "reps": 12 or "reps": 15
        - For cardio, use "sets": 1, "reps": 1 or another appropriate number
        - NEVER include strings for numerical fields
        - NEVER add extra fields not shown in the example below

        Note: you will also give a **short video** tutorial of that exercise only for eg. if the exercise is "hanging leg raises" you will only give video of "hanging leg raises" instead of videos like "complete abs workout",. Note: only give valid youtbue tutorials that exist and you will ensure that you only give the tutorial of that exercise for example if the exercise is "dumbbell chest press" you wilil only give tutorial of "dumbbell chest press" only and not "dumbbell fly or barbell press". And you will give the embed link like "https://www.youtube.com/embed/4Y2ZdHCOXok?si=621TxB8eXZ-DoJaX"  instead of original one.

        Note: Also provide a description of how to perform that exercise.
        
        Return a JSON object with this EXACT structure:
       {
  "schedule": ["Monday", "Wednesday", "Friday"],
  "exercises": [
    {
      "day": "Monday",
      "routines": [
        {
          "name": "Push-ups",
          "sets": 3,
          "reps": 10,
          "description": "Bodyweight chest exercise",
          "steps": [
            "Start in plank position hands shoulder-width",
            "Lower body until chest near ground",
            "Push back up to starting position"
          ],
          "muscles_targeted": ["Chest", "Shoulders", "Triceps"],
          "difficulty": "Beginner",
          "youtube_link": "https://www.youtube.com/embed/4Y2ZdHCOXok?si=621TxB8eXZ-DoJaX"
        },
        {
          "name": "Squats",
          "sets": 4,
          "reps": 8,
          "description": "Lower body compound exercise",
          "steps": [
            "Stand feet shoulder-width apart",
            "Lower hips back and down",
            "Drive through heels to stand up"
          ],
          "muscles_targeted": ["Quads", "Glutes", "Hamstrings"],
          "difficulty": "Beginner",
          "youtube_link": "https://www.youtube.com/embed/4Y2ZdHCOXok?si=621TxB8eXZ-DoJaX"
        }
      ]
    }
  ]
}
        
        DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.`;

  const workoutPlan = await generateText({
    model: openai("gpt-5"),
    prompt: workoutPrompt,
    temperature: 0.4,
  });

  function cleanJSON(text: string) {
    return text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
  }

  let workoutPlanResult = JSON.parse(cleanJSON(workoutPlan.text));
  workoutPlanResult = validateWorkoutPlan(workoutPlanResult);

  console.log("Workout Plan: ", workoutPlanResult);

  const dietPrompt = `You are an experienced nutrition coach creating a personalized diet plan based on:
        Age: ${age}
        Height: ${height}
        Weight: ${weight}
        Fitness goal: ${fitness_goal}
        Dietary restrictions: ${dietary_restrictions}
        Food Preferences: ${food_preferences}
        
        As a professional nutrition coach:
        - Calculate appropriate daily calorie intake based on the person's stats and goals
        - Create a balanced meal plan with proper macronutrient distribution
        - Include a variety of nutrient-dense foods while respecting dietary restrictions
        - Consider meal timing around workouts for optimal performance and recovery
        
        CRITICAL SCHEMA INSTRUCTIONS:
        - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
        - "dailyCalories" MUST be a NUMBER, not a string
        - DO NOT add fields like "supplements", "macros", "notes", or ANYTHING else
        - ONLY include the EXACT fields shown in the example below
        - Each meal should include ONLY a "name" and "foods" array

        Return a JSON object with this EXACT structure and no other fields:
        {
          "dailyCalories": 2000,
          "meals": [
            {
              "name": "Breakfast",
              "foods": ["Oatmeal with berries", "Greek yogurt", "Black coffee"]
            },
            {
              "name": "Lunch",
              "foods": ["Grilled chicken salad", "Whole grain bread", "Water"]
            }
          ]
        }
        
        DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.`;

  const dietPlan = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: dietPrompt,
    temperature: 0.4,
  });

  let dietPlanResult = JSON.parse(cleanJSON(dietPlan.text));
  dietPlanResult = validateDietPlan(dietPlanResult);

  console.log("Diet Plan: ", dietPlanResult);

  // Routine inside each day's exercise
  interface Routine {
    name: string;
    sets: number | string; // AI might send as string
    reps: number | string; // AI might send as string
    youtube_link: string;
    description: string;
    steps: string[];
    muscles_targeted: string[];
    difficulty: string;
  }

  // Exercise for a specific day
  interface Exercise {
    day: string;
    routines: Routine[];
  }

  // Whole workout plan
  interface WorkoutPlan {
    schedule: string[];
    exercises: Exercise[];
  }

  interface dietPlanInterface extends Document {
    dailyCalories: number;
    meals: {
      name: string;
      foods: string[];
    }[];
  }

  function validateWorkoutPlan(plan: WorkoutPlan): WorkoutPlan {
    const validatedPlan: WorkoutPlan = {
      schedule: plan.schedule || [],
      exercises: (plan.exercises || []).map((exercise: Exercise) => ({
        day: exercise.day || "Unknown Day",
        routines: (exercise.routines || []).map((routine: Routine) => ({
          name: routine.name || "Unnamed Exercise",
          sets:
            typeof routine.sets === "number"
              ? routine.sets
              : parseInt(routine.sets as string) || 1,
          reps:
            typeof routine.reps === "number"
              ? routine.reps
              : parseInt(routine.reps as string) || 10,
          description: routine.description || "",
          steps: Array.isArray(routine.steps)
            ? routine.steps
            : ["No steps provided"],
          difficulty: routine.difficulty || "Beginner",
          muscles_targeted: Array.isArray(routine.muscles_targeted)
            ? routine.muscles_targeted
            : ["Not specified"],
          youtube_link: routine.youtube_link || "",
        })),
      })),
    };
    return validatedPlan;
  }

  // validate diet plan to ensure it strictly follows schema
  function validateDietPlan(plan: dietPlanInterface) {
    // only keep the fields we want
    const validatedPlan = {
      dailyCalories: plan.dailyCalories,
      meals: plan.meals.map((meal) => ({
        name: meal.name,
        foods: meal.foods,
      })),
    };
    return validatedPlan;
  }

  try {
    const newPlan = new PlanModel({
      userId: user_id,
      name: fitness_goal,
      workoutPlan: workoutPlanResult,
      dietPlan: dietPlanResult,
      isActive: true,
    });
    await newPlan.save();
    console.log("Plan created successfully");
    return NextResponse.json(
      { message: "Plan created successfuly" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error Creating plan");
    return NextResponse.json(
      { message: "Error creating plan" },
      { status: 500 }
    );
  }
}
