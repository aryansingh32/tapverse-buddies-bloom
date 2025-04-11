
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Award, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QuestCardProps {
  title: string;
  description: string;
  progress: number;
  requirement: number;
  rewardCoins: number;
  rewardXp: number;
  completed: boolean;
  claimed: boolean;
  onClaim: () => void;
}

export function QuestCard({
  title,
  description,
  progress,
  requirement,
  rewardCoins,
  rewardXp,
  completed,
  claimed,
  onClaim
}: QuestCardProps) {
  const progressPercentage = Math.min(Math.floor((progress / requirement) * 100), 100);
  
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-2">
          <div className="mt-1">
            {claimed ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : completed ? (
              <CheckCircle2 className="h-5 w-5 text-purple" />
            ) : (
              <Circle className="h-5 w-5 text-gray-300" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-800">{title}</h4>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-3 space-y-2">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Progress</span>
          <span>{progress}/{requirement}</span>
        </div>
        
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="flex items-center text-xs bg-gold/10 text-amber-700 px-2 py-0.5 rounded-full">
            <Sparkles className="h-3 w-3 mr-1" />{rewardCoins}
          </div>
          <div className="flex items-center text-xs bg-purple/10 text-purple px-2 py-0.5 rounded-full">
            <Award className="h-3 w-3 mr-1" />{rewardXp} XP
          </div>
        </div>
        
        {completed && !claimed && (
          <Button 
            size="sm" 
            onClick={onClaim}
            className="text-xs py-0 h-7 bg-gradient-to-r from-purple to-teal hover:opacity-90 text-white"
          >
            Claim
          </Button>
        )}
        
        {claimed && (
          <span className="text-xs text-green-500 font-medium">Claimed</span>
        )}
      </div>
    </div>
  );
}
