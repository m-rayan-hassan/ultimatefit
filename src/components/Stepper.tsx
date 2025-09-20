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
      <div className="relative flex items-center justify-between w-full px-8 py-2 border-b">
        {steps.map((step, index) => {
          return (
            <div key={step.name} className="flex flex-col items-center">
              <div
                className={`
    w-7 h-7 rounded-full mb-1.5 flex justify-center font-bold border-3 p-4 items-center
    ${
      currentStep === steps.length || currentStep > index + 1
        ? "bg-green-600 text-white"
        : currentStep === index + 1
        ? "bg-teal-500 text-white"
        : "border-primary text-primary"
    }
  `}
              >
                {currentStep > index + 1 || currentStep === steps.length
                  ? "✓"
                  : index + 1}
              </div>
              <div className="font-semibold">{step.name}</div>
            </div>
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
