
import { useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { AiBuddy } from "@/components/AiBuddy";
import { ResourceDisplay } from "@/components/ResourceDisplay";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  Planet, 
  Lock, 
  Globe, 
  Rocket,
  MessageSquare
} from "lucide-react";
import { StoryDialogue } from "@/components/StoryDialogue";

const Story = () => {
  const { gameState, chapters, readDialogue } = useGame();
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [showDialogue, setShowDialogue] = useState(false);
  
  useEffect(() => {
    document.title = "Story Mode - TapVerse";
  }, []);
  
  const handleChapterClick = (chapterId: number) => {
    setSelectedChapter(chapterId);
  };
  
  const handleStartReading = () => {
    setShowDialogue(true);
  };
  
  const handleCloseDialogue = () => {
    setShowDialogue(false);
  };
  
  const selectedChapterData = chapters.find(chapter => chapter.id === selectedChapter);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-light-gray py-10 px-4 pb-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center gradient-text mb-2">Story Mode</h1>
        <p className="text-center text-gray-600 mb-6">Explore the TapVerse</p>
        
        <ResourceDisplay />
        
        {showDialogue && selectedChapterData ? (
          <div className="mt-6 bg-white rounded-xl p-4 shadow-md border border-purple/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{selectedChapterData.title}</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCloseDialogue}
                className="text-xs"
              >
                Back to Chapters
              </Button>
            </div>
            
            <div className="space-y-4">
              {selectedChapterData.dialogues.map((dialogue) => (
                <StoryDialogue
                  key={dialogue.id}
                  speaker={dialogue.speaker}
                  text={dialogue.text}
                  isRead={dialogue.read}
                  onRead={() => readDialogue(selectedChapterData.id, dialogue.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-purple/20 to-teal/20 p-4 rounded-xl mt-6 mb-6 shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-3 shadow-inner">
                  <Planet className="h-6 w-6 text-purple" />
                </div>
                <div>
                  <h2 className="font-bold">Cosmic Journey</h2>
                  <p className="text-xs text-gray-700">Explore planets and collect cosmic coins!</p>
                </div>
              </div>
            </div>
            
            {selectedChapter ? (
              <div className="mt-6 bg-white rounded-xl p-4 shadow-md border border-purple/10">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-bold">{selectedChapterData?.title}</h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedChapter(null)}
                    className="text-xs"
                  >
                    Back to All
                  </Button>
                </div>
                
                <div className="bg-gradient-to-r from-purple/5 to-teal/5 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <Globe className="h-5 w-5 text-purple mr-2" />
                    <h3 className="font-medium">Planet: {selectedChapterData?.planet}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{selectedChapterData?.description}</p>
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button 
                    onClick={handleStartReading}
                    className="px-6 py-2 bg-gradient-to-r from-purple to-teal hover:opacity-90 text-white"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start Reading
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mt-6">
                <h2 className="font-bold text-lg">Chapters</h2>
                
                {chapters.map((chapter) => {
                  const isUnlocked = gameState.unlockedChapters.includes(chapter.id);
                  
                  return (
                    <div 
                      key={chapter.id}
                      className={`bg-white rounded-lg p-4 border flex items-center justify-between
                        ${isUnlocked ? 'border-purple/20 cursor-pointer hover:bg-purple/5' : 'border-gray-200 opacity-70'}`}
                      onClick={() => isUnlocked && handleChapterClick(chapter.id)}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 
                          ${isUnlocked ? 'bg-gradient-to-r from-purple to-teal' : 'bg-gray-200'}`}
                        >
                          {isUnlocked ? (
                            <Planet className="h-5 w-5 text-white" />
                          ) : (
                            <Lock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{chapter.title}</h3>
                          <p className="text-xs text-gray-500">
                            {isUnlocked ? `Planet: ${chapter.planet}` : `Unlocks at level ${chapter.unlockLevel}`}
                          </p>
                        </div>
                      </div>
                      
                      {isUnlocked && <ChevronRight className="h-5 w-5 text-gray-400" />}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
        
        {!selectedChapter && !showDialogue && (
          <div className="mt-6 bg-gradient-to-r from-gold/10 to-pink/10 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              Keep leveling up to unlock more chapters!
            </p>
          </div>
        )}
      </div>
      
      <AiBuddy />
    </div>
  );
};

export default Story;
