"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import CornerElements from "@/components/CornerElements";
import NoFitnessPlan from "@/components/NoFitnessPlan";
import ProfileHeader from "@/components/ProfileHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppleIcon, CalendarIcon, DumbbellIcon } from "lucide-react";

interface Meals {
  name: string;
  foods: string[];
}
interface Exercises {
  day: string;
  routines: {
    name: string;
    sets?: number;
    reps?: number;
    youtube_link: string;
    duration?: string;
    description?: string;
    steps: string[];
    muscles_targeted: string[];
    difficulty: string;
  }[];
}
interface WorkoutPlan {
  schedule: string[];
  exercises: Exercises[];
}
interface DietPlan {
  dailyCalories: number;
  meals: Meals[];
}
interface Plan {
  _id: string;
  userId: string;
  name: string;
  workoutPlan: WorkoutPlan;
  dietPlan: DietPlan;
  isActive: boolean;
}

const ProfilePage = () => {
  const { user } = useUser();
  const [allPlans, setAllPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);

  useEffect(() => {
    if (!user) return;

    // 1️⃣ Load from localStorage
    const savedPlans = localStorage.getItem("userPlans");
    if (savedPlans) {
      try {
        const parsedPlans = JSON.parse(savedPlans);
        setAllPlans(parsedPlans);
      } catch (error) {
        console.error("Error parsing local storage data:", error);
      }
    }

    // 2️⃣ Fetch from API and update localStorage
    const fetchPlans = async () => {
      try {
        const res = await axios.post("/api/get-user-plan", { userId: user.id });
        if (res.data?.plans) {
          setAllPlans(res.data.plans);
          localStorage.setItem("userPlans", JSON.stringify(res.data.plans));
        }
      } catch (error) {
        console.error("Error fetching user plans:", error);
      }
    };

    fetchPlans();
  }, [user]);

  const activePlan = allPlans.find((plan) => plan.isActive);
  const currentPlan = selectedPlanId
    ? allPlans.find((plan) => plan._id === selectedPlanId)
    : activePlan;

  return (
    <section className="relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4">
      <ProfileHeader user={user} />

      {allPlans && allPlans?.length > 0 ? (
        <div className="space-y-8">
          {/* PLAN SELECTOR */}
          <div className="relative backdrop-blur-sm border border-border p-6">
            <CornerElements />
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight">
                <span className="text-primary">Your</span>{" "}
                <span className="text-foreground">Fitness Plans</span>
              </h2>
              <div className="font-mono text-xs text-muted-foreground">
                TOTAL: {allPlans.length}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {allPlans.map((plan) => (
                <Button
                  key={plan._id}
                  onClick={() => setSelectedPlanId(plan._id)}
                  className={`text-foreground border hover:text-white ${
                    selectedPlanId === plan._id
                      ? "bg-primary/20 text-primary border-primary"
                      : "bg-transparent border-border hover:border-primary/50"
                  }`}
                >
                  {plan.name}
                  {plan.isActive && (
                    <span className="ml-2 bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* PLAN DETAILS */}

          {currentPlan && (
            <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
              <CornerElements />

              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <h3 className="text-lg font-bold">
                  PLAN: <span className="text-primary">{currentPlan.name}</span>
                </h3>
              </div>

              <Tabs defaultValue="workout" className="w-full">
                <TabsList className="mb-6 w-full grid grid-cols-2 bg-cyber-terminal-bg border">
                  <TabsTrigger
                    value="workout"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <DumbbellIcon className="mr-2 size-4" />
                    Workout Plan
                  </TabsTrigger>

                  <TabsTrigger
                    value="diet"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <AppleIcon className="mr-2 h-4 w-4" />
                    Diet Plan
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="workout">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <span className="font-mono text-sm text-muted-foreground">
                        SCHEDULE: {currentPlan.workoutPlan.schedule.join(", ")}
                      </span>
                    </div>

                    <Accordion type="multiple" className="space-y-4">
                      {currentPlan.workoutPlan.exercises.map(
                        (exerciseDay: Exercises, index: number) => (
                          <AccordionItem
                            key={index}
                            value={exerciseDay.day}
                            className="border rounded-lg overflow-hidden"
                          >
                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/10 font-mono">
                              <div className="flex justify-between w-full items-center">
                                <span className="text-primary">
                                  {exerciseDay.day}
                                </span>
                                <div className="text-xs text-muted-foreground">
                                  {exerciseDay.routines.length} EXERCISES
                                </div>
                              </div>
                            </AccordionTrigger>

                            <AccordionContent className="pb-6 px-4">
                              <div className="space-y-4 mt-3">
                                {exerciseDay.routines.map(
                                  (routine, routineIndex) => (
                                    <div
                                      key={routineIndex}
                                      className="border border-border rounded-lg p-4 bg-background/50 hover:bg-background/70 transition-colors duration-200"
                                    >
                                      {/* Header Section */}
                                      <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-bold text-lg text-foreground">
                                              {routine.name}
                                            </h4>
                                            <span
                                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                routine.difficulty ===
                                                "Beginner"
                                                  ? "bg-green-500/20 text-green-500"
                                                  : routine.difficulty ===
                                                    "Intermediate"
                                                  ? "bg-yellow-500/20 text-yellow-500"
                                                  : "bg-red-500/20 text-red-500"
                                              }`}
                                            >
                                              {routine.difficulty}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                                              {routine.sets} SETS
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium">
                                              {routine.reps} REPS
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Description */}
                                      <p className="text-sm text-muted-foreground mb-4">
                                        {routine.description}
                                      </p>

                                      {/* Content Grid */}
                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* YouTube Video Section */}
                                        {routine.youtube_link && (
                                          <div className="space-y-3">
                                            <h5 className="font-semibold text-foreground flex items-center gap-2">
                                              <svg
                                                className="w-4 h-4 text-red-500"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                              </svg>
                                              Video Demonstration
                                            </h5>
                                            <div className="aspect-video rounded-lg overflow-hidden border border-border">
                                              <iframe
                                                src={routine.youtube_link}
                                                className="w-full h-full"
                                                title={`${routine.name} exercise video`}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                              />
                                            </div>
                                          </div>
                                        )}

                                        {/* Instructions Section */}
                                        <div className="space-y-4">
                                          {/* Step-by-Step Instructions */}
                                          <div className="space-y-3">
                                            <h5 className="font-semibold text-foreground flex items-center gap-2">
                                              <svg
                                                className="w-4 h-4 text-blue-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M19 9l-7 7-7-7"
                                                />
                                              </svg>
                                              Step-by-Step Instructions
                                            </h5>
                                            <div className="space-y-2">
                                              {routine.steps.map(
                                                (step, index) => (
                                                  <div
                                                    key={index}
                                                    className="flex items-start gap-3 p-2 rounded-lg bg-muted/30"
                                                  >
                                                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold">
                                                      {index + 1}
                                                    </div>
                                                    <p className="text-sm text-foreground flex-1">
                                                      {step}
                                                    </p>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>

                                          {/* Muscles Targeted */}
                                          <div className="space-y-2">
                                            <h5 className="font-semibold text-foreground flex items-center gap-2">
                                              <svg
                                                className="w-4 h-4 text-green-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                                />
                                              </svg>
                                              Muscles Targeted
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                              {routine.muscles_targeted.map(
                                                (muscle, index) => (
                                                  <span
                                                    key={index}
                                                    className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-medium"
                                                  >
                                                    {muscle}
                                                  </span>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      )}
                    </Accordion>
                  </div>
                </TabsContent>

                <TabsContent value="diet">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono text-sm text-muted-foreground">
                        DAILY CALORIE TARGET
                      </span>
                      <div className="font-mono text-xl text-primary">
                        {currentPlan.dietPlan.dailyCalories} KCAL
                      </div>
                    </div>

                    <div className="h-px w-full bg-border my-4"></div>

                    <div className="space-y-4">
                      {currentPlan.dietPlan.meals.map(
                        (meal: Meals, index: number) => (
                          <div
                            key={index}
                            className="border border-border rounded-lg overflow-hidden p-4"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                              <h4 className="font-mono text-primary">
                                {meal.name}
                              </h4>
                            </div>
                            <ul className="space-y-2">
                              {meal.foods.map((food, foodIndex: number) => (
                                <li
                                  key={foodIndex}
                                  className="flex items-center gap-2 text-sm text-muted-foreground"
                                >
                                  <span className="text-xs text-primary font-mono">
                                    {String(foodIndex + 1).padStart(2, "0")}
                                  </span>
                                  {food}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      ) : (
        <NoFitnessPlan />
      )}
    </section>
  );
};

export default ProfilePage;
