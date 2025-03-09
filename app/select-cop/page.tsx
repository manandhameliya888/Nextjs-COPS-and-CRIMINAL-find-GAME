"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const cops = [
  {
    id: 1,
    name: "Detective Smith",
    image: "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    name: "Inspector Johnson",
    image: "https://images.unsplash.com/photo-1588611911587-7f321d293126?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    name: "Chief Anderson",
    image: "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=800&h=600&fit=crop",
  },
];

export default function SelectCop() {
  const [availableCops, setAvailableCops] = useState(cops);
  const router = useRouter();
  // const currentPlayer = localStorage.getItem("currentPlayer");
  const currentPlayer = typeof window !== "undefined" ? localStorage.getItem("currentPlayer") : null;

  useEffect(() => {
    const gameSession = JSON.parse(localStorage.getItem("gameSession") || "{}");
    const selectedCops = gameSession.selectedCops || [];
    setAvailableCops(cops.filter(cop => !selectedCops.find((sc: any) => sc.copId === cop.id)));
  }, []);

  const handleSelectCop = (copId: number) => {
    const gameSession = JSON.parse(localStorage.getItem("gameSession") || "{}");
    const selectedCops = gameSession.selectedCops || [];
    
    const updatedSelection = [
      ...selectedCops,
      { 
        copId,
        playerName: currentPlayer,
      }
    ];

    const updatedSession = {
      ...gameSession,
      selectedCops: updatedSelection,
    };

    localStorage.setItem("gameSession", JSON.stringify(updatedSession));
    localStorage.setItem("playerCop", JSON.stringify({ copId, playerName: currentPlayer }));
    
    router.push("/select-city");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Select Your Cop</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {availableCops.map((cop) => (
              <div key={cop.id} className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={cop.image}
                    alt={cop.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{cop.name}</h3>
                  <Button
                    onClick={() => handleSelectCop(cop.id)}
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