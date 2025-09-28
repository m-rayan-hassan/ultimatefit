import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const {
    age,
    weight,
    height,
    fitness_goal,
    workout_days,
    dietary_restrictions,
    fitness_level,
    food_preferences,
  } = reqBody;
  console.log("Age: ", age);
  console.log("weight: ", weight);
  console.log("Height: ", height);
  console.log("fitness goal: ", fitness_goal);
  console.log("Workout days: ", workout_days);
  console.log("Dietary Restrictions: ", dietary_restrictions);
  console.log("Fitness level: ", fitness_level);
  console.log("Food Preferences: ", food_preferences);
}
