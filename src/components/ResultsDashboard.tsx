import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Activity, 
  Brain, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart
} from "lucide-react";

interface ResultsDashboardProps {
  data: {
    chatbot: any;
    memory: any;
    facial: any;
  };
  onRestart: () => void;
}

const ResultsDashboard = ({ data, onRestart }: ResultsDashboardProps) => {
  const calculateOverallScore = () => {
    let totalScore = 0;
    let assessmentsCompleted = 0;

    if (data.chatbot) {
      const chatbotScore = data.chatbot.averageResponseTime < 3000 ? 85 : 70;
      totalScore += chatbotScore;
      assessmentsCompleted++;
    }

    if (data.memory) {
      const memoryScore = data.memory.accuracy * 100;
      totalScore += memoryScore;
      assessmentsCompleted++;
    }

    if (data.facial) {
      const facialScore = data.facial.averageConfidence * 100;
      totalScore += facialScore;
      assessmentsCompleted++;
    }

    return assessmentsCompleted > 0 ? Math.round(totalScore / assessmentsCompleted) : 0;
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Low", color: "bg-accent", icon: CheckCircle };
    if (score >= 60) return { level: "Moderate", color: "bg-warning", icon: AlertTriangle };
    return { level: "High", color: "bg-destructive", icon: TrendingDown };
  };

  const overallScore = calculateOverallScore();
  const riskAssessment = getRiskLevel(overallScore);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Overview Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Assessment Results Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{overallScore}%</div>
              <p className="text-muted-foreground">Overall Score</p>
              <Progress value={overallScore} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${riskAssessment.color} text-white`}>
                <riskAssessment.icon className="h-4 w-4" />
                {riskAssessment.level} Risk
              </div>
              <p className="text-muted-foreground mt-2">Risk Assessment</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                {Object.values(data).filter(Boolean).length}/3
              </div>
              <p className="text-muted-foreground">Tests Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Chatbot Results */}
        {data.chatbot && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Conversational Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Response Time</span>
                <Badge variant={data.chatbot.averageResponseTime < 3000 ? "default" : "secondary"}>
                  {Math.round(data.chatbot.averageResponseTime)}ms
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Questions Answered</span>
                <span className="font-medium">{data.chatbot.responses?.length || 0}</span>
              </div>

              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {data.chatbot.averageResponseTime < 3000 ? (
                    <CheckCircle className="h-4 w-4 text-accent" />
                  ) : (
                    <Clock className="h-4 w-4 text-warning" />
                  )}
                  <span className="text-sm">
                    {data.chatbot.averageResponseTime < 3000 ? "Normal response patterns" : "Slower response detected"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Memory Test Results */}
        {data.memory && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-accent" />
                Memory Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Accuracy</span>
                <Badge variant={data.memory.accuracy > 0.7 ? "default" : "secondary"}>
                  {Math.round(data.memory.accuracy * 100)}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Tests Completed</span>
                <span className="font-medium">{data.memory.totalTests}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Response Time</span>
                <span className="font-medium">{Math.round(data.memory.averageResponseTime)}ms</span>
              </div>

              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {data.memory.accuracy > 0.7 ? (
                    <CheckCircle className="h-4 w-4 text-accent" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  )}
                  <span className="text-sm">
                    {data.memory.accuracy > 0.7 ? "Good cognitive performance" : "Memory concerns detected"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Facial Recognition Results */}
        {data.facial && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-warning" />
                Facial Expression Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Detection Confidence</span>
                <Badge variant={data.facial.averageConfidence > 0.8 ? "default" : "secondary"}>
                  {Math.round(data.facial.averageConfidence * 100)}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Facial Mobility</span>
                <Badge variant={data.facial.detectedSymptoms?.facialMobility === "normal" ? "default" : "destructive"}>
                  {data.facial.detectedSymptoms?.facialMobility || "N/A"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Expression Range</span>
                <Badge variant={data.facial.detectedSymptoms?.expressiveRange === "good" ? "default" : "secondary"}>
                  {data.facial.detectedSymptoms?.expressiveRange || "N/A"}
                </Badge>
              </div>

              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {data.facial.detectedSymptoms?.facialMobility === "normal" ? (
                    <CheckCircle className="h-4 w-4 text-accent" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  )}
                  <span className="text-sm">
                    {data.facial.detectedSymptoms?.facialMobility === "normal" 
                      ? "Normal facial expressions" 
                      : "Reduced facial mobility detected"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {overallScore >= 80 ? (
              <div className="flex items-start gap-3 p-4 bg-accent/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <h4 className="font-medium text-accent">Positive Results</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your assessment results show normal patterns. Continue with regular health monitoring 
                    and maintain a healthy lifestyle.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <h4 className="font-medium text-warning">Further Evaluation Recommended</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Some assessment results suggest further evaluation may be beneficial. 
                    Please consult with a healthcare professional for a comprehensive evaluation.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <h5 className="font-medium">Next Steps:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Schedule a follow-up assessment in 3-6 months</li>
                  <li>• Share results with your healthcare provider</li>
                  <li>• Monitor symptoms and any changes</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium">Lifestyle Recommendations:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Regular physical exercise</li>
                  <li>• Maintain cognitive activities</li>
                  <li>• Follow up with medical professionals</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onRestart}>
          Take Assessment Again
        </Button>
        <Button onClick={() => window.print()}>
          Print Results
        </Button>
      </div>

      {/* Medical Disclaimer */}
      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Medical Disclaimer:</strong> This assessment is for informational purposes only and 
            should not be considered a medical diagnosis. Always consult with qualified healthcare 
            professionals for proper medical evaluation and treatment decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDashboard;