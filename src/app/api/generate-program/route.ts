import { google } from "@ai-sdk/google";
import { NextRequest } from "next/server";
import { generateText } from "ai";
import PlanModel, { IPlan } from "@/models/Plan";

export async function POST(request: NextRequest) {
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
    full_name
  } = reqBody;

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

        Note: you will also give a **short video** tutorial of that exercise only for eg. if the exercise is "hanging leg raises" you will only give video of "hanging leg raises" instead of videos like "complete abs workout",. Note: only give valid youtbue tutorials that exist and you will ensure that you only give the tutorial of that exercise for example if the exercise is "dumbbell chest press" you wilil only give tutorial of "dumbbell chest press" only and not "dumbbell fly or barbell press". And you will give the embed link like "https://www.youtube.com/embed/BCufdom7xgY?si=orc_oLtX70Y7xxIh"  instead of original one.
        
        Return a JSON object with this EXACT structure:
        {
          "schedule": ["Monday", "Wednesday", "Friday"],
          "exercises": [
            {
              "day": "Monday",
              "routines": [
                {
                  "name": "Exercise Name",
                  "sets": 3,
                  "reps": 10,
                  youtube_link: https://www.youtube.com/embed/BCufdom7xgY?si=orc_oLtX70Y7xxIh
                }
              ]
            }
          ]
        }
        
        DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.`;

  const workoutPlan = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: workoutPrompt,
    temperature: 0.4,
  });

  let workoutPlanResult = JSON.parse(workoutPlan.text);
  workoutPlanResult = validateWorkoutPlan(workoutPlanResult);

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

  let dietPlanResult = JSON.parse(workoutPlan.text);
  dietPlanResult = validateWorkoutPlan(dietPlanResult);

  interface workoutPlanInterface extends Document {
    schedule: string[];
        exercises: {
            day: string;
            routines: {
                name: string;
                sets?: number;
                reps?: number;
                youtube_link: string,
                duration?: string;
                description?: string;
                exercises?: string[];
            }[];
        }[];
  }

  interface dietPlanInterface extends Document {
    dailyCalories: number;
        meals: {
            name: string;
            foods: string[];
        }[];
  }

  function validateWorkoutPlan(plan: workoutPlanInterface) {
    const validatedPlan = {
      schedule: plan.schedule,
      exercises: plan.exercises.map((exercise: any) => ({
        day: exercise.day,
        routines: exercise.routines.map((routine: any) => ({
          name: routine.name,
          sets:
            typeof routine.sets === "number"
              ? routine.sets
              : parseInt(routine.sets) || 1,
          reps:
            typeof routine.reps === "number"
              ? routine.reps
              : parseInt(routine.reps) || 10,
          youtube_link: routine.youtube_link
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
      meals: plan.meals.map((meal: any) => ({
        name: meal.name,
        foods: meal.foods,
      })),
    };
    return validatedPlan;
  }

  const newPlan = new PlanModel({
    userId: user_id,
    name: full_name,
    workoutPlan,
    dietPlan,
    isActive: true
  })
  await newPlan.save();
}
