"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Exercise {
  name: string;
  primary_equipment: string[];
  steps: string[];
  notes?: string;
  difficulty: string;
  youtube: string;
}

interface Muscle {
  muscle: string;
  exercises: Exercise[];
}

interface Props {
  selectedMuscles: string[];
  selectedEquipment: string[];
}

const Exercises: React.FC<Props> = ({ selectedMuscles, selectedEquipment }) => {
  const [generatedExercises, setGeneratedExercises] = useState<Muscle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.post("/api/generate-exercises", {
          muscles: selectedMuscles,
          equipment: selectedEquipment,
        });
        setIsLoading(false);
        console.log(response.data.exercises);
        const rawResponse = response.data.exercises
          .replace(/```json|```/g, "")
          .trim();
        setGeneratedExercises(JSON.parse(rawResponse));
      } catch (error) {
        console.error("Error fetching exercises", error);
      } 
    };

    fetchExercises();
  }, [selectedMuscles, selectedEquipment]);

  return (
  <div className="flex flex-col gap-6 h-[430px] relative">
  {/* Cyber grid background */}
  <div className="absolute inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-30 pointer-events-none"></div>
  
  {isLoading ? (
    <div className="flex flex-col gap-6 relative z-10">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-7 bg-deep-teal rounded w-1/3 mb-4 glow-primary"></div>
          <div className="space-y-4">
            <div className="h-5 bg-deep-teal rounded w-2/3 glow-soft"></div>
            <div className="h-4 bg-deep-teal rounded w-full glow-soft"></div>
            <div className="h-4 bg-deep-teal rounded w-5/6 glow-soft"></div>
            <div className="h-4 bg-deep-teal rounded w-4/5 glow-soft"></div>
            <div className="h-4 bg-deep-teal rounded w-1/4 mt-2 glow-soft"></div>
            <div className="h-32 bg-deep-teal rounded-xl mt-2 glow-primary"></div>
          </div>
        </div>
      ))}
      
      {/* Animated loading indicator */}
      <div className="flex items-center justify-center mt-4">
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-neon-teal rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
        <span className="ml-3 text-neon-teal font-medium">AI is generating your workout...</span>
      </div>
    </div>
  ) : (
    <div className="overflow-y-auto pr-2 relative z-10 cyber-scrollbar">
      {generatedExercises.map((muscle, i) => (
        <div key={i} className="mb-8 last:mb-0">
          <h2 className="font-bold text-2xl mb-4 text-neon-teal glow-strong border-b border-cyber-line pb-2">
            {muscle.muscle.toUpperCase()}
          </h2>
          <div className="grid gap-6">
            {muscle.exercises.map((exercise, j) => (
              <div key={j} className="bg-card rounded-xl border border-cyber-line p-5 glow-soft hover:glow-primary transition-all duration-300 hover:border-neon-teal/50">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-semibold text-lg text-cyber-text-bright">{exercise.name}</p>
                  <span className="px-3 py-1 bg-deep-teal text-neon-teal rounded-full text-xs font-medium border border-cyber-line glow-soft">
                    {exercise.difficulty}
                  </span>
                </div>
                
                <h3 className="font-medium text-cyber-text-muted mb-2 text-sm uppercase tracking-wider">Steps:</h3>
                <ul className="list-disc ml-6 mb-4 space-y-2">
                  {exercise.steps.map((step, k) => (
                    <li key={k} className="text-cyber-text-dim">{step}</li>
                  ))}
                </ul>
                
                {exercise.notes && (
                  <div className="bg-deep-teal/30 border-l-4 border-emerald p-3 mb-4 rounded-r glow-soft">
                    <p className="text-sm text-cyber-text-muted">
                      <span className="font-medium text-emerald">Notes:</span> {exercise.notes}
                    </p>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-cyber-line">
                  <p className="font-semibold text-cyber-text-bright mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-aqua-blue" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    Video Tutorial
                  </p>
                  <p className="text-cyber-text-dim text-sm mb-3">Follow along with this tutorial:</p>
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-cyber-line glow-primary">
                    <iframe 
                      className="w-full h-full" 
                      src={exercise.youtube} 
                      title="YouTube video player" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )}
</div>
  );
};

export default Exercises;
