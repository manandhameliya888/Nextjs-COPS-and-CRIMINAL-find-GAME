"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Car, Bike, Loader2 } from "lucide-react";

export default function Home() {
  const [playerName, setPlayerName] = useState("");
  const [gameSession, setGameSession] = useState<any>(null);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [joinTimeLeft, setJoinTimeLeft] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const checkSession = () => {
      const currentSession = localStorage.getItem("gameSession");
      if (currentSession) {
        const session = JSON.parse(currentSession);
        const now = new Date().getTime();
        const sessionStart = new Date(session.startTime).getTime();
        const timeElapsed = (now - sessionStart) / 1000; // seconds

        if (timeElapsed < 300) { // 5 minutes in seconds
          setGameSession(session);
        } else {
          localStorage.removeItem("gameSession");
          initializeNewSession();
        }
      } else {
        initializeNewSession();
      }
    };

    checkSession();
    const intervalId = setInterval(checkSession, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const updateTimers = () => {
      if (gameSession) {
        const now = new Date().getTime();
        
        // Next game timer
        const nextGame = new Date(gameSession.nextGameStart).getTime();
        const totalSeconds = Math.max(0, Math.floor((nextGame - now) / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);

        // Join window timer
        const sessionStart = new Date(gameSession.startTime).getTime();
        const joinWindowSeconds = Math.max(0, 60 - Math.floor((now - sessionStart) / 1000));
        
        if (joinWindowSeconds > 0) {
          const joinMinutes = Math.floor(joinWindowSeconds / 60);
          const joinSeconds = joinWindowSeconds % 60;
          setJoinTimeLeft(
            joinMinutes > 0
              ? `${joinMinutes}:${joinSeconds.toString().padStart(2, '0')}`
              : `${joinSeconds} seconds`
          );
        } else {
          setJoinTimeLeft("Join window closed");
        }

        // Auto-refresh when session expires
        if (totalSeconds === 0) {
          initializeNewSession();
        }
      }
    };

    updateTimers();
    const timerInterval = setInterval(updateTimers, 1000);
    return () => clearInterval(timerInterval);
  }, [gameSession]);

  const initializeNewSession = () => {
    const newSession = {
      startTime: new Date().toISOString(),
      players: [],
      nextGameStart: new Date(Date.now() + 5 * 60000).toISOString(), // 5 minutes
      minPlayers: 1,
      maxPlayers: 3
    };
    localStorage.setItem("gameSession", JSON.stringify(newSession));
    setGameSession(newSession);
  };

  const handleJoinGame = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    setJoining(true);
    setError("");

    try {
      const currentSession = JSON.parse(localStorage.getItem("gameSession") || "{}");
      const now = new Date().getTime();
      const sessionStart = new Date(currentSession.startTime).getTime();
      const timeElapsed = (now - sessionStart) / 1000; // seconds

      if (currentSession.players.length >= currentSession.maxPlayers) {
        setError("Game session is full. Please wait for the next game.");
        setJoining(false);
        return;
      }

      if (timeElapsed > 60) { // 60 seconds join window
        setError("Cannot join after the first minute. Please wait for the next game.");
        setJoining(false);
        return;
      }

      // Check for duplicate names
      if (currentSession.players.some((p: any) => p.name === playerName)) {
        setError("This name is already taken. Please choose another name.");
        setJoining(false);
        return;
      }

      const updatedPlayers = [...currentSession.players, { name: playerName, id: Date.now() }];
      const updatedSession = { ...currentSession, players: updatedPlayers };
      localStorage.setItem("gameSession", JSON.stringify(updatedSession));
      localStorage.setItem("currentPlayer", playerName);
      setGameSession(updatedSession);

      await new Promise(resolve => setTimeout(resolve, 500));
      router.push("/select-cop");
    } catch (err) {
      setError("Failed to join the game. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Cops & Robbers</h1>
            <div className="flex justify-center space-x-4 mb-6">
              <Shield className="w-8 h-8" />
              <Car className="w-8 h-8" />
              <Bike className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-lg mb-1">Next game starts in:</p>
                <p className="text-3xl font-mono">{timeLeft}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-blue-300">Time to join current session:</p>
                <p className="text-lg font-medium">{joinTimeLeft}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-white/20 border-white/30 text-white placeholder-white/50"
              disabled={joining}
            />
            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 p-2 rounded">{error}</p>
            )}
            <Button
              onClick={handleJoinGame}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
              disabled={joining}
            >
              {joining ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                "Join Game"
              )}
            </Button>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Current Players:</h2>
            <div className="bg-white/5 rounded-lg p-4">
              {gameSession?.players.length === 0 ? (
                <p className="text-gray-400">No players have joined yet</p>
              ) : (
                <ul className="space-y-2">
                  {gameSession?.players.map((player: any) => (
                    <li key={player.id} className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span>{player.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}