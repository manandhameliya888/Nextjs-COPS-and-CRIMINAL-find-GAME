"use client";

import { useEffect, useState } from "react";
import { Trophy, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Results() {
  const [gameResults, setGameResults] = useState<any>(null);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("gameSession") || "{}");
    setGameResults(session);
    setCurrentPlayer(localStorage.getItem("currentPlayer"));
  }, []);

  const handlePlayAgain = () => {
    localStorage.removeItem("gameSession");
    localStorage.removeItem("currentPlayer");
    localStorage.removeItem("playerCop");
    localStorage.removeItem("playerCity");
    localStorage.removeItem("playerVehicle");
    router.push("/");
  };

  if (!gameResults || !gameResults.winner) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Waiting for all players to complete their selections...</h1>
          <p>Please wait while other players finish their turns.</p>
        </div>
      </div>
    );
  }

  const cities = [
    "New York", "Tokyo", "London", "Paris", "Dubai"
  ];

  const isWinner = currentPlayer === gameResults.winner.playerName;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-lg p-8">
          <div className="text-center mb-8">
            {isWinner ? (
              <>
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h1 className="text-4xl font-bold mb-4">Congratulations!</h1>
                <p className="text-xl">COP has found the criminal!</p>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h1 className="text-4xl font-bold mb-4">Better luck next time!</h1>
                <p className="text-xl">The criminal wasn't in your city.</p>
              </>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Game Results</h2>
            <p className="mb-2">
              The criminal was found in: <span className="font-bold">{cities[gameResults.criminalCity - 1]}</span>
            </p>
            <p className="mb-4">
              Winner: <span className="font-bold">{gameResults.winner.playerName}</span>
            </p>
          </div>

          <Button
            onClick={handlePlayAgain}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
}