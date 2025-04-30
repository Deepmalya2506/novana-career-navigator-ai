
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TopicViewerProps {
  topics: string[];
  currentTopicIndex: number;
  analysisResult: string;
  onNextTopic: () => void;
  onPrevTopic: () => void;
}

const TopicViewer: React.FC<TopicViewerProps> = ({
  topics,
  currentTopicIndex,
  analysisResult,
  onNextTopic,
  onPrevTopic
}) => {
  const getCurrentTopicContent = () => {
    if (!analysisResult || topics.length === 0) return '';
    
    const currentTopic = topics[currentTopicIndex];
    const lines = analysisResult.split('\n');
    
    // Find the index of the current topic
    const topicIndex = lines.findIndex(line => 
      line.trim().replace('TOPIC:', '').trim() === currentTopic
    );
    
    if (topicIndex === -1) return '';
    
    // Find the index of the next topic (if any)
    const nextTopicIndex = lines.findIndex((line, index) => 
      index > topicIndex && line.trim().startsWith('TOPIC:')
    );
    
    // Extract content between current topic and next topic (or end of text)
    const endIndex = nextTopicIndex !== -1 ? nextTopicIndex : lines.length;
    const topicContent = lines.slice(topicIndex + 1, endIndex)
      .filter(line => line.trim() !== '')
      .join('\n');
    
    return topicContent;
  };

  const formatTopicContent = (content: string) => {
    if (!content) return '';

    // Split content by sections
    const sections = [
      { title: "CORE CONCEPTS", content: extractSection(content, "CORE CONCEPTS", "DETAILED EXPLANATION") },
      { title: "DETAILED EXPLANATION", content: extractSection(content, "DETAILED EXPLANATION", "EXAMPLES") },
      { title: "EXAMPLES", content: extractSection(content, "EXAMPLES", "SOLVED PROBLEMS") },
      { title: "SOLVED PROBLEMS", content: extractSection(content, "SOLVED PROBLEMS", "PRACTICE EXERCISES") },
      { title: "PRACTICE EXERCISES", content: extractSection(content, "PRACTICE EXERCISES", "KEY TAKEAWAYS") },
      { title: "KEY TAKEAWAYS", content: extractSection(content, "KEY TAKEAWAYS", null) }
    ];

    // Format content with proper styling
    return (
      <div className="space-y-6">
        {sections.map((section, index) => (
          section.content && (
            <div key={index} className="mt-6">
              <h3 className="text-xl font-bold mb-3">{section.title}</h3>
              <div className="whitespace-pre-wrap">{section.content}</div>
            </div>
          )
        ))}
      </div>
    );
  };

  const extractSection = (content: string, sectionName: string, nextSectionName: string | null) => {
    // Find the section
    const sectionStart = content.indexOf(sectionName + ":");
    if (sectionStart === -1) return '';
    
    let sectionEnd;
    if (nextSectionName) {
      sectionEnd = content.indexOf(nextSectionName + ":", sectionStart);
      if (sectionEnd === -1) sectionEnd = content.length;
    } else {
      sectionEnd = content.length;
    }
    
    // Extract and format the section content
    return content.substring(sectionStart + sectionName.length + 1, sectionEnd).trim();
  };

  if (topics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-white/70">
          Upload your study material in the "Upload & Analyze" tab to start learning
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <Button 
              onClick={onPrevTopic}
              disabled={currentTopicIndex === 0}
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-lg font-medium">
              Topic {currentTopicIndex + 1} of {topics.length}
            </span>
            <Button 
              onClick={onNextTopic}
              disabled={currentTopicIndex === topics.length - 1}
              variant="outline"
            >
              Next
            </Button>
          </div>
          
          <h3 className="text-xl font-bold mb-4">{topics[currentTopicIndex]}</h3>
          <div className="prose prose-invert max-w-none overflow-auto max-h-[70vh]">
            {formatTopicContent(getCurrentTopicContent())}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopicViewer;
