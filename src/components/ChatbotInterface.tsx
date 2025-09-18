import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Mic, MicOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  responseTime?: number;
}

interface ChatbotInterfaceProps {
  onComplete: (data: any) => void;
}

const ChatbotInterface = ({ onComplete }: ChatbotInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI health assistant. I'll ask you a few questions to assess your cognitive and motor functions. Let's start with some basic questions about how you've been feeling lately.",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const questions = [
    "How would you rate your overall mobility today on a scale of 1-10?",
    "Have you noticed any changes in your handwriting recently?",
    "Do you experience any tremors or shaking in your hands or fingers?",
    "How has your balance been lately? Any difficulty walking?",
    "Have you noticed changes in your voice or speech patterns?",
    "How would you describe your mood and energy levels recently?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const responseTime = startTime ? Date.now() - startTime.getTime() : 0;
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      responseTime
    };

    setMessages(prev => [...prev, newMessage]);
    setResponses(prev => [...prev, { question: currentQuestion, response: inputValue, responseTime }]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: questions[nextQuestion],
          sender: "bot",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setStartTime(new Date());
      } else {
        // Assessment complete
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Thank you for completing the assessment! I've gathered valuable information about your current condition. Let me analyze your responses...",
          sender: "bot",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        
        setTimeout(() => {
          onComplete({
            responses,
            totalTime: responses.reduce((sum, r) => sum + (r.responseTime || 0), 0),
            averageResponseTime: responses.length > 0 ? 
              responses.reduce((sum, r) => sum + (r.responseTime || 0), 0) / responses.length : 0
          });
        }, 2000);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real implementation, this would integrate with speech recognition
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI Health Assistant
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              {responses.length > 0 && (
                <Badge variant="outline">
                  Avg Response: {Math.round(responses.reduce((sum, r) => sum + (r.responseTime || 0), 0) / responses.length)}ms
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "bot" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.responseTime && (
                      <p className="text-xs opacity-70 mt-1">
                        Response time: {message.responseTime}ms
                      </p>
                    )}
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-accent/10">
                        <User className="h-4 w-4 text-accent" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response here..."
                className="flex-1"
                onFocus={() => setStartTime(new Date())}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={toggleListening}
                className={isListening ? "bg-accent text-accent-foreground" : ""}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotInterface;