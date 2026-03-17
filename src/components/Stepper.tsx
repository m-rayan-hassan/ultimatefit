"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import MuscleSelector from "./MuscleSelector";
import EquipmentSelector from "./EquipmentSelector";
import Exercises from "./Exercises";

interface Step {
  name: string;
  Component: React.FC;
}

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectdEquipment, setSelectedEquipment] = useState<string[]>([]);

  const steps: Step[] = [
    {
      name: "Select Muscles",
      Component: () => (
        <MuscleSelector
          selectedMuscles={selectedMuscles}
          setSelectedMuscles={setSelectedMuscles}
        />
      ),
    },
    {
      name: "Select Equipment",
      Component: () => (
        <EquipmentSelector
          selectedEquipment={selectdEquipment}
          setSelectedEquipment={setSelectedEquipment}
        />
      ),
    },
    {
      name: "Generate Exercises",
      Component: () => (
        <Exercises
          selectedMuscles={selectedMuscles}
          selectedEquipment={selectdEquipment}
        />
      ),
    },
  ];

  const ActiveComponent = steps[currentStep - 1].Component;

  const handleNext = () => {
    if (currentStep !== steps.length) {
      setCurrentStep(currentStep + 1);
    }
    if (currentStep === steps.length) {
      setCurrentStep(1);
      setSelectedMuscles([]);
      setSelectedEquipment([]);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
    if (currentStep === 2) {
      setSelectedMuscles([]);
    }
    if (currentStep === 3) {
      setSelectedEquipment([]);
    }
  };

  console.log("Selected Muscles: ", selectedMuscles);
  console.log("Selected Equipment: ", selectdEquipment);

  return (
    <>
      <div className="flex items-center w-full px-12 py-8 border-b">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index + 1 || currentStep === steps.length;
          const isCurrent = currentStep === index + 1 && currentStep !== steps.length;
          
          return (
            <React.Fragment key={step.name}>
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`
                    w-10 h-10 rounded-full flex justify-center font-bold items-center transition-all duration-300 bg-background
                    ${
                      isCompleted
                        ? "bg-primary text-primary-foreground border-2 border-primary shadow-[0_0_10px_rgba(0,245,212,0.5)]"
                        : isCurrent
                        ? "text-primary shadow-[0_0_15px_rgba(0,245,212,0.4)] border-2 border-primary scale-110"
                        : "border-2 border-border text-muted-foreground"
                    }
                  `}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>
                <div className={`absolute top-12 whitespace-nowrap text-sm font-semibold transition-colors duration-300 ${isCurrent ? 'text-primary' : isCompleted ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.name}
                </div>
              </div>
              {index < steps.length - 1 && (
                 <div className="flex-1 h-1 bg-border mx-4 relative overflow-hidden rounded-full">
                    <div 
                      className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-in-out" 
                      style={{ width: currentStep > index + 1 ? '100%' : '0%' }}
                    ></div>
                 </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="p-5">
        <ActiveComponent />
      </div>

      <div className="flex w-full justify-between p-3 border-t">
        <Button
          disabled={currentStep === 1 || currentStep === steps.length}
          onClick={handlePrev}
          variant={"outline"}
          className="border-primary/50 rounded-3xl px-5 text-primary hover:text-white hover:bg-primary/10"
        >
          Back
        </Button>
        <Button
          className="bg-primary rounded-3xl px-5 text-primary-foreground hover:bg-primary/90"
          onClick={handleNext}
          disabled={
            (currentStep === 1 && selectedMuscles.length === 0) ||
            (currentStep === 2 && selectdEquipment.length === 0)
              ? true
              : false
          }
        >
          {currentStep === steps.length ? "Reset" : "Next"}
        </Button>
      </div>
    </>
  );
};

export default Stepper;
