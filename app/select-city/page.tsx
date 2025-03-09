"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const cities = [
  {
    id: 1,
    name: "New York",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    name: "Tokyo",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    name: "London",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    name: "Paris",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop",
  },
  {
    id: 5,
    name: "Dubai",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
  },
];

export default function SelectCity() {
  const router = useRouter();
  // const currentPlayer = localStorage.getItem("currentPlayer");
  const currentPlayer = typeof window !== "undefined" ? localStorage.getItem("currentPlayer") : null;

  const handleSelectCity = (cityId: number) => {
    const gameSession = JSON.parse(localStorage.getItem("gameSession") || "{}");
    const selectedCities = gameSession.selectedCities || [];
    
    const updatedSelection = [
      ...selectedCities,
      { 
        cityId,
        playerName: currentPlayer,
      }
    ];

    const updatedSession = {
      ...gameSession,
      selectedCities: updatedSelection,
    };

    localStorage.setItem("gameSession", JSON.stringify(updatedSession));
    localStorage.setItem("playerCity", JSON.stringify({ cityId, playerName: currentPlayer }));
    
    router.push("/select-vehicle");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Select Your City</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {cities.map((city) => (
              <div key={city.id} className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
                <div className="relative h-40">
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{city.name}</h3>
                  <Button
                    onClick={() => handleSelectCity(city.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}