
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, GamepadIcon, Bot, CalendarCheck, Gift, UserRound } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { gameState } = useGame();
  
  const navItems = [
    { path: "/", icon: <Home className="h-6 w-6" />, label: "Tap" },
    { path: "/arcade", icon: <GamepadIcon className="h-6 w-6" />, label: "Arcade" },
    { path: "/buddy", icon: <Bot className="h-6 w-6" />, label: "Buddy" },
    { path: "/quests", icon: <CalendarCheck className="h-6 w-6" />, label: "Quests" },
    { path: "/shop", icon: <Gift className="h-6 w-6" />, label: "Shop" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white bg-opacity-70 backdrop-blur-lg border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                isActive(item.path)
                  ? "text-purple"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              aria-label={item.label}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Navigation */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-70 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold gradient-text">TapVerse</h1>
            </div>
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive(item.path)
                      ? "bg-purple bg-opacity-10 text-purple"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile button - replacing hamburger menu */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-center">
        <button
          onClick={() => navigate('/profile')}
          className="flex flex-col items-center"
          aria-label="Profile"
        >
          <Avatar className="h-10 w-10 border-2 border-purple/30 bg-white shadow-md hover:shadow-lg transition-all">
            <AvatarFallback className="bg-gradient-to-br from-purple to-teal/50 text-white">
              {gameState?.aiName?.substring(0, 1) || 'T'}
            </AvatarFallback>
          </Avatar>
          <div className="text-xs mt-1 font-medium text-gray-700">
            Hey, {gameState?.aiName || 'Player'}
          </div>
        </button>
      </div>
    </>
  );
}
