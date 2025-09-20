import React, { useState } from "react";
import { Button } from "./ui/button";

interface EquipmentSelectorProps {
  selectedEquipment: string[];
  setSelectedEquipment: React.Dispatch<React.SetStateAction<string[]>>;
}

const EquipmentSelector = ({
  selectedEquipment,
  setSelectedEquipment,
}: EquipmentSelectorProps) => {
  const handleClick = (equipment: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipment)
        ? prev.filter((e) => e !== equipment)
        : [...prev, equipment]
    );
  };

  const isSelected = (equipment: string) =>
    selectedEquipment.includes(equipment);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <Button
        className={`border-primary/50 hover:text-white hover:bg-primary/10 flex flex-col items-center justify-center h-auto ${
          isSelected("body-weight")
            ? "border-5 border-teal-300 bg-primary/10 text-primary scale-105 shadow-lg"
            : ""
        }`}
        variant={"outline"}
        onClick={() => handleClick("body-weight")}
      >
        <img
          src="/muscle.png"
          alt="body weight"
          className="w-20 h-20 object-contain"
        />
        <p className="text-lg font-medium">Body Weight</p>
      </Button>
      <Button
        className={`border-primary/50 hover:text-white hover:bg-primary/10 flex flex-col items-center justify-center h-auto ${
          isSelected("dumbbell")
            ? "border-5 border-teal-300 bg-primary/10 text-primary"
            : ""
        }`}
        variant={"outline"}
        onClick={() => handleClick("dumbbell")}
      >
        <img
          src="/dumbbell.png"
          alt="dubbell"
          className="w-20 h-20 object-contain"
        />
        <p className="text-lg font-medium">Dumbbell</p>
      </Button>

      <Button
        className={`border-primary/50 hover:text-white hover:bg-primary/10 flex flex-col items-center justify-center h-auto ${
          isSelected("resistance-band")
            ? "border-5 border-teal-300 bg-primary/10 text-primary"
            : ""
        }`}
        variant={"outline"}
        onClick={() => handleClick("resistance-band")}
      >
        <img
          src="/resistance-band.png"
          alt="resistance-band"
          className="w-20 h-20 object-contain"
        />
        <p className="text-lg font-medium">Resistance Band</p>
      </Button>

      <Button
        className={`border-primary/50 hover:text-white hover:bg-primary/10 flex flex-col items-center justify-center h-auto ${isSelected("barbell") ?
      "border-5 border-teal-300 bg-primary/10 text-primary" : ""
      }`}
        variant={"outline"}
        onClick={() => handleClick("barbell")}
      >
        <img
          src="/bar.png"
          alt="barbell"
          className="w-20 h-20 object-contain"
        />
        <p className="text-lg font-medium">Barbell</p>
      </Button>

      <Button
        className={`border-primary/50 hover:text-white hover:bg-primary/10 flex flex-col items-center justify-center h-auto ${isSelected("pull-up-bar") ?
      "border-5 border-teal-300 bg-primary/10 text-primary" : ""
      }`}
        variant={"outline"}
        onClick={() => handleClick("pull-up-bar")}
      >
        <img
          src="/pull-up.png"
          alt="pull-up-bar"
          className="w-20 h-20 object-contain"
        />
        <p className="text-lg font-medium">Pull-up-bar</p>
      </Button>

      <Button
        className={`border-primary/50 hover:text-white hover:bg-primary/10 flex flex-col items-center justify-center h-auto ${isSelected("bench") ?
      "border-5 border-teal-300 bg-primary/10 text-primary" : ""
      }`}
        variant={"outline"}
        onClick={() => handleClick("bench")}
      >
        <img
          src="/bench.png"
          alt="bench"
          className="w-20 h-20 object-contain"
        />
        <p className="text-lg font-medium">Bench</p>
      </Button>

      <Button
        className={`border-primary/50 hover:text-white hover:bg-primary/10 flex flex-col items-center justify-center h-auto ${isSelected("plate") ?
      "border-5 border-teal-300 bg-primary/10 text-primary" : ""
      }`}
        variant={"outline"}
        onClick={() => handleClick("plate")}
      >
        <img
          src="/plate.png"
          alt="plate"
          className="w-20 h-20 object-contain"
        />
        <p className="text-lg font-medium">Plate</p>
      </Button>

      <Button
        className={`border-primary/50 hover:text-white hover:bg-primary/10 flex flex-col items-center justify-center h-auto ${isSelected("kettlebell") ?
      "border-5 border-teal-300 bg-primary/10 text-primary" : ""
      }`}
        variant={"outline"}
        onClick={() => handleClick("kettlebell")}
      >
        <img
          src="/kettlebell.png"
          alt="kettlebell"
          className="w-20 h-20 object-contain"
        />
        <p className="text-lg font-medium">Kettlebell</p>
      </Button>
      <Button
        className={`border-primary/50 hover:text-white hover:bg-primary/10 flex flex-col items-center justify-center h-auto ${isSelected("complete-gym") ?
      "border-5 border-teal-300 bg-primary/10 text-primary" : ""
      }`}
        variant={"outline"}
        onClick={() => handleClick("complete-gym")}
      >
        <img src="/gym.png" alt="gym" className="w-20 h-20 object-contain" />
        <p className="text-lg font-medium">Complete GYM</p>
      </Button>
      <Button
        className={`border-primary/50 hover:text-white hover:bg-primary/10 flex flex-col items-center justify-center h-auto ${isSelected("cable-machine") ?
      "border-5 border-teal-300 bg-primary/10 text-primary" : ""
      }`}
        variant={"outline"}
        onClick={() => handleClick("cable-machine")}
      >
        <img
          src="/cable-machine.png"
          alt="cable-machine"
          className="w-20 h-20 object-contain"
        />
        <p className="text-lg font-medium">Cable Machine</p>
      </Button>
    </div>
  );
};

export default EquipmentSelector;
