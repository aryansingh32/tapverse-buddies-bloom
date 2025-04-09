
import { useState, useEffect } from "react";
import { useGame } from "../contexts/GameContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";

export function OnboardingModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);
  const { aiName, showNewMessage } = useGame();
  
  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingCompleted = localStorage.getItem('tapverse-onboarding-completed');
    
    if (!onboardingCompleted) {
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);
  
  const handleComplete = () => {
    localStorage.setItem('tapverse-onboarding-completed', 'true');
    setIsVisible(false);
    // Show a welcome message
    setTimeout(showNewMessage, 1000);
  };
  
  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };
  
  const onboardingSteps = [
    {
      title: `Welcome to TapVerse!`,
      content: `I'm ${aiName}, your AI buddy. Together we'll tap, collect coins, and have fun in this cosmic adventure!`
    },
    {
      title: "Let's Get Tapping!",
      content: "Tap the coin to earn digital currency. Upgrade your tapping power, multipliers, and more in the shop!"
    },
    {
      title: "Your Journey Begins",
      content: "I'll be here with tips and encouragement. The more you tap, the more we'll discover together!"
    }
  ];
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="relative">
          {/* Header with gradient */}
          <div className="h-24 bg-gradient-to-r from-purple to-teal flex items-center justify-center">
            <h2 className="text-white text-2xl font-bold">TapVerse</h2>
            
            {/* Close button */}
            <button 
              onClick={handleComplete}
              className="absolute top-3 right-3 text-white/90 hover:text-white"
              aria-label="Close onboarding"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* AI buddy avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple to-blue-400 
                         border-4 border-white absolute -bottom-10 left-1/2 transform -translate-x-1/2
                         flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{aiName.charAt(0)}</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="pt-14 pb-6 px-6">
          <h3 className="text-xl font-bold text-center mb-2">
            {onboardingSteps[step].title}
          </h3>
          <p className="text-center text-gray-600 mb-6">
            {onboardingSteps[step].content}
          </p>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {onboardingSteps.map((_, i) => (
              <div 
                key={i}
                className={`w-2 h-2 rounded-full ${step === i ? 'bg-purple' : 'bg-gray-300'}`}
              />
            ))}
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between">
            <Button 
              variant="ghost" 
              onClick={handleComplete}
            >
              Skip
            </Button>
            <Button 
              onClick={handleNext}
              className="bg-purple hover:bg-purple/90"
            >
              {step < 2 ? 'Next' : 'Get Started'} <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
