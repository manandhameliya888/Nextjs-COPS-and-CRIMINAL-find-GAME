"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Car, Bike } from "lucide-react";

const vehicles = [
  { id: 1, name: "Tesla Model 3", type: "car" },
  { id: 2, name: "Chevrolet Bolt", type: "car" },
  { id: 3, name: "Zero SR/F", type: "bike" },
  { id: 4, name: "Energica Eva", type: "bike" },
];

export default function SelectVehicle() {
  const [availableVehicles, setAvailableVehicles] = useState(vehicles);
  const router = useRouter();
  // const currentPlayer = localStorage.getItem("currentPlayer");
  const currentPlayer = typeof window !== "undefined" ? localStorage.getItem("currentPlayer") : null;

  useEffect(() => {
    const gameSession = JSON.parse(localStorage.getItem("gameSession") || "{}");
    const selectedVehicles = gameSession.selectedVehicles || [];
    setAvailableVehicles(vehicles.filter(vehicle => 
      !selectedVehicles.find((sv: any) => sv.vehicleId === vehicle.id)
    ));

    // Check if this is the last player and handle game completion
    const checkGameCompletion = () => {
      const session = JSON.parse(localStorage.getItem("gameSession") || "{}");
      const selectedVehicles = session.selectedVehicles || [];
      
      if (selectedVehicles.length === session.players.length - 1) {
        // This is the last player, prepare for game completion
        const criminalCity = Math.floor(Math.random() * 5) + 1;
        const selectedCities = session.selectedCities || [];
        const winner = selectedCities.find((city: any) => city.cityId === criminalCity);
        
        const updatedSession = {
          ...session,
          criminalCity,
          winner: winner || {
            playerName: selectedCities[0]?.playerName,
            cityId: selectedCities[0]?.cityId
          }
        };
        
        localStorage.setItem("gameSession", JSON.stringify(updatedSession));
      }
    };

    checkGameCompletion();
  }, []);

  const handleSelectVehicle = (vehicleId: number) => {
    const gameSession = JSON.parse(localStorage.getItem("gameSession") || "{}");
    const selectedVehicles = gameSession.selectedVehicles || [];
    
    const updatedSelection = [
      ...selectedVehicles,
      { 
        vehicleId,
        playerName: currentPlayer,
      }
    ];

    const updatedSession = {
      ...gameSession,
      selectedVehicles: updatedSelection,
    };

    // If this is the last player to select a vehicle, determine the winner
    if (updatedSelection.length === gameSession.players.length) {
      const criminalCity = Math.floor(Math.random() * 5) + 1;
      const selectedCities = gameSession.selectedCities || [];
      const winner = selectedCities.find((city: any) => city.cityId === criminalCity) || {
        playerName: selectedCities[0]?.playerName,
        cityId: selectedCities[0]?.cityId
      };
      
      updatedSession.criminalCity = criminalCity;
      updatedSession.winner = winner;
    }

    localStorage.setItem("gameSession", JSON.stringify(updatedSession));
    localStorage.setItem("playerVehicle", JSON.stringify({ vehicleId, playerName: currentPlayer }));
    
    router.push("/results");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Select Your Vehicle</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {availableVehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
                <div className="flex justify-center mb-4">
                  {vehicle.type === "car" ? (
                    <Car className="w-16 h-16" />
                  ) : (
                    <Bike className="w-16 h-16" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">{vehicle.name}</h3>
                <Button
                  onClick={() => handleSelectVehicle(vehicle.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Select
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}