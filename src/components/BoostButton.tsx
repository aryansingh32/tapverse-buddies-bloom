
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { useToast } from "@/hooks/use-toast";
import { LucideIcon } from "lucide-react";

interface BoostButtonProps {
  icon: LucideIcon;
  label: string;
  type: 'power' | 'double' | 'auto';
  duration: number; // Duration in seconds
}

export function BoostButton({ icon: Icon, label, type, duration }: BoostButtonProps) {
  const { gameState, applyBoost } = useGame();
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Check if boost is active and update timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      
      // Notify user that boost has expired
      toast({
        title: `${label} Expired`,
        description: "Your boost has ended. Activate it again!",
        variant: "default",
      });
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft, label, toast]);

  const handleBoostClick = () => {
    if (isActive) return;
    
    // Simulate watching an ad
    toast({
      title: "Ad Starting",
      description: "Watching ad to activate your boost...",
    });
    
    // Simulate ad completion after 2 seconds
    setTimeout(() => {
      // Apply the boost effect
      applyBoost(type, duration);
      setIsActive(true);
      setTimeLeft(duration);
      
      toast({
        title: `${label} Activated!`,
        description: `${label} will be active for ${duration} seconds!`,
        variant: "default",
      });
    }, 2000);
  };

  return (
    <Button 
      variant="outline" 
      className={`flex flex-col items-center justify-center h-16 ${
        isActive ? 
          type === 'power' ? 'bg-purple/10 border-purple' : 
          type === 'double' ? 'bg-gold/10 border-gold' : 
          'bg-teal/10 border-teal' : 
          'border-purple/20 hover:bg-purple/5'
      }`}
      onClick={handleBoostClick}
    >
      <Icon className={`h-5 w-5 ${
        type === 'power' ? 'text-purple' : 
        type === 'double' ? 'text-gold' : 
        'text-teal'
      } mb-1`} />
      <span className="text-xs">{isActive ? `${timeLeft}s` : label}</span>
    </Button>
  );
}
