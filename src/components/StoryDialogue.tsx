
import { useState, useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { MessageSquare, Bot, User, Book } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryDialogueProps {
  speaker: 'player' | 'buddy' | 'narrator';
  text: string;
  isRead: boolean;
  onRead: () => void;
}

export function StoryDialogue({ speaker, text, isRead, onRead }: StoryDialogueProps) {
  const { aiName } = useGame();
  const [displayed, setDisplayed] = useState(isRead);
  const [typewriterText, setTypewriterText] = useState(isRead ? text : "");
  const [textIndex, setTextIndex] = useState(0);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (!displayed) {
      setDisplayed(true);
      onRead();
      
      // Typewriter effect
      if (textIndex < text.length) {
        timeout = setTimeout(() => {
          setTypewriterText(prev => prev + text[textIndex]);
          setTextIndex(textIndex + 1);
        }, 30);
      }
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [displayed, text, textIndex, onRead]);
  
  const getSpeakerName = () => {
    switch (speaker) {
      case 'player':
        return 'You';
      case 'buddy':
        return aiName;
      case 'narrator':
        return 'Narrator';
      default:
        return '';
    }
  };
  
  const getSpeakerIcon = () => {
    switch (speaker) {
      case 'player':
        return <User className="h-4 w-4 text-white" />;
      case 'buddy':
        return <Bot className="h-4 w-4 text-white" />;
      case 'narrator':
        return <Book className="h-4 w-4 text-white" />;
      default:
        return <MessageSquare className="h-4 w-4 text-white" />;
    }
  };
  
  const getContainerClass = () => {
    switch (speaker) {
      case 'player':
        return 'bg-gray-50 border border-gray-200';
      case 'buddy':
        return 'bg-purple/5 border border-purple/20';
      case 'narrator':
        return 'bg-gradient-to-r from-gold/5 to-pink/5 border border-gold/20 italic';
      default:
        return 'bg-gray-50';
    }
  };
  
  const getSpeakerBadgeClass = () => {
    switch (speaker) {
      case 'player':
        return 'bg-blue-500';
      case 'buddy':
        return 'bg-gradient-to-r from-purple to-teal';
      case 'narrator':
        return 'bg-gradient-to-r from-gold to-pink';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className={cn("p-4 rounded-lg animate-fade-in", getContainerClass())}>
      <div className="flex items-center mb-2">
        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center mr-2", getSpeakerBadgeClass())}>
          {getSpeakerIcon()}
        </div>
        <span className="font-medium text-sm">{getSpeakerName()}</span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">
        {typewriterText}
        {textIndex < text.length && <span className="animate-pulse">|</span>}
      </p>
    </div>
  );
}
