
import { Award, Lock } from "lucide-react";

interface BadgeCardProps {
  name: string;
  description: string;
  unlocked: boolean;
}

export function BadgeCard({ name, description, unlocked }: BadgeCardProps) {
  return (
    <div className={`flex items-center p-3 rounded-lg border ${
      unlocked ? 'bg-gradient-to-r from-purple/5 to-teal/5 border-purple/20' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
        unlocked ? 'bg-gradient-to-r from-purple to-teal' : 'bg-gray-200'
      }`}>
        {unlocked ? (
          <Award className="h-6 w-6 text-white" />
        ) : (
          <Lock className="h-5 w-5 text-gray-400" />
        )}
      </div>
      <div>
        <h3 className={`font-medium ${unlocked ? 'text-gray-800' : 'text-gray-500'}`}>{name}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}
