import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageSquare, Eye, Activity } from "lucide-react";
import ChatbotInterface from "@/components/ChatbotInterface";
import MemoryTest from "@/components/MemoryTest";
import FacialRecognition from "@/components/FacialRecognition";
import ResultsDashboard from "@/components/ResultsDashboard";

type ActiveSection = "home" | "chatbot" | "memory" | "facial" | "results";

const Index = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>("home");
  const [assessmentData, setAssessmentData] = useState({
    chatbot: null,
    memory: null,
    facial: null
  });

  const handleSectionComplete = (section: string, data: any) => {
    setAssessmentData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  if (activeSection !== "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              onClick={() => setActiveSection("home")}
            >
              ← Back to Home
            </Button>
            <h1 className="text-2xl font-semibold">
              {activeSection === "chatbot" && "AI Health Assistant"}
              {activeSection === "memory" && "Memory Assessment"}
              {activeSection === "facial" && "Facial Expression Analysis"}
              {activeSection === "results" && "Assessment Results"}
            </h1>
          </div>
          
          {activeSection === "chatbot" && (
            <ChatbotInterface 
              onComplete={(data) => {
                handleSectionComplete("chatbot", data);
                setActiveSection("results");
              }}
            />
          )}
          {activeSection === "memory" && (
            <MemoryTest 
              onComplete={(data) => {
                handleSectionComplete("memory", data);
                setActiveSection("results");
              }}
            />
          )}
          {activeSection === "facial" && (
            <FacialRecognition 
              onComplete={(data) => {
                handleSectionComplete("facial", data);
                setActiveSection("results");
              }}
            />
          )}
          {activeSection === "results" && (
            <ResultsDashboard 
              data={assessmentData}
              onRestart={() => setActiveSection("home")}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <Brain className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Parkinson's Early Detection
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Advanced AI-powered assessment tools for early detection of Parkinson's disease through 
            conversational analysis, cognitive testing, and facial expression recognition.
          </p>
          <Badge variant="secondary" className="mb-8">
            Clinically Informed • AI-Powered • Privacy First
          </Badge>
        </div>

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="group hover:shadow-medium transition-all duration-300 cursor-pointer border-primary/20" 
                onClick={() => setActiveSection("chatbot")}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI Health Assistant</CardTitle>
              </div>
              <CardDescription>
                Interactive conversation analysis to assess speech patterns, response times, and communication clarity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">10-15 minutes</span>
                <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Start Assessment
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-medium transition-all duration-300 cursor-pointer border-accent/20" 
                onClick={() => setActiveSection("memory")}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <Brain className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Memory Assessment</CardTitle>
              </div>
              <CardDescription>
                Cognitive tests designed to evaluate memory, attention, and executive function capabilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">5-10 minutes</span>
                <Button variant="ghost" size="sm" className="group-hover:bg-accent group-hover:text-accent-foreground">
                  Start Test
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-medium transition-all duration-300 cursor-pointer border-warning/20" 
                onClick={() => setActiveSection("facial")}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-warning/10 rounded-lg group-hover:bg-warning/20 transition-colors">
                  <Eye className="h-6 w-6 text-warning" />
                </div>
                <CardTitle>Facial Analysis</CardTitle>
              </div>
              <CardDescription>
                Advanced facial expression recognition to detect subtle motor symptoms and emotional responses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">3-5 minutes</span>
                <Button variant="ghost" size="sm" className="group-hover:bg-warning group-hover:text-warning-foreground">
                  Start Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complete Assessment CTA */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <Activity className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Complete Assessment Package</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              For the most comprehensive analysis, complete all three assessments. Our AI will provide 
              detailed insights and recommendations based on the combined results.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-medium"
              onClick={() => setActiveSection("results")}
            >
              View Results Dashboard
            </Button>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="text-center mt-12 p-6 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> This tool is designed for screening purposes only and should not replace 
            professional medical diagnosis. Please consult with a healthcare provider for proper evaluation and treatment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;