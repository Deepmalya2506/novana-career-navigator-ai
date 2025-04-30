
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Circle, CheckCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';

interface SkillItemProps {
  skill: string;
  topics: string[];
  isCompleted: boolean;
  onToggleSkill: (skill: string, completed: boolean) => void;
  onToggleTopic: (skill: string, topic: string, completed: boolean) => void;
  completedTopics: Record<string, boolean>;
  onClick: (skill: string) => void;
}

const SkillItem: React.FC<SkillItemProps> = ({
  skill,
  topics,
  isCompleted,
  onToggleSkill,
  onToggleTopic,
  completedTopics,
  onClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const allTopicsCompleted = topics.length > 0 && 
    topics.every(topic => completedTopics[topic] === true);
  
  const handleToggleSkill = () => {
    const newState = !isCompleted;
    onToggleSkill(skill, newState);
    
    toast({
      title: newState ? "Skill marked as mastered" : "Skill marked as not mastered",
      description: `${skill} has been updated.`,
    });
  };
  
  const handleToggleTopic = (topic: string) => {
    const newState = !(completedTopics[topic] === true);
    onToggleTopic(skill, topic, newState);
    
    toast({
      title: newState ? "Topic completed" : "Topic marked as incomplete",
      description: `${topic} has been updated.`,
    });
  };
  
  return (
    <div className="mb-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center hover:bg-white/5 p-2 rounded-md transition-colors">
          <Checkbox 
            checked={isCompleted || allTopicsCompleted} 
            onCheckedChange={handleToggleSkill}
            className="mr-3"
          />
          
          <CollapsibleTrigger className="flex-1 cursor-pointer flex items-center justify-between">
            <span>{skill}</span>
            <ArrowRight size={16} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </CollapsibleTrigger>
          
          <div 
            onClick={() => onClick(skill)}
            className="ml-2 p-1 cursor-pointer hover:bg-primary/20 rounded transition-colors"
          >
            <ArrowRight size={16} />
          </div>
        </div>
        
        <CollapsibleContent>
          <div className="pl-10 pt-1 pb-2">
            <p className="text-sm text-white/70 mb-2">Related topics:</p>
            <ul className="space-y-2">
              {topics.map((topic, index) => (
                <li 
                  key={index} 
                  className="flex items-center hover:bg-white/5 p-1 rounded-md transition-colors"
                  onClick={() => handleToggleTopic(topic)}
                >
                  {completedTopics[topic] ? 
                    <CheckCircle size={16} className="mr-2 text-green-500" /> : 
                    <Circle size={16} className="mr-2 text-white/50" />}
                  <span className="cursor-pointer text-sm">{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default SkillItem;
