import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, Video, VideoOff, Play, Square, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FacialRecognitionProps {
  onComplete: (data: any) => void;
}

interface ExpressionData {
  expression: string;
  timestamp: number;
  confidence: number;
  duration: number;
}

const FacialRecognition = ({ onComplete }: FacialRecognitionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [currentTask, setCurrentTask] = useState(0);
  const [recordedData, setRecordedData] = useState<ExpressionData[]>([]);
  const [taskProgress, setTaskProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const tasks = [
    {
      name: "Neutral Expression",
      description: "Look directly at the camera with a relaxed, neutral expression",
      duration: 10
    },
    {
      name: "Smile Naturally",
      description: "Show a natural, comfortable smile",
      duration: 8
    },
    {
      name: "Raise Eyebrows",
      description: "Raise your eyebrows as if surprised",
      duration: 6
    },
    {
      name: "Blink Normally",
      description: "Blink at your normal, comfortable rate",
      duration: 8
    },
    {
      name: "Turn Head Side to Side",
      description: "Slowly turn your head left, then right, then back to center",
      duration: 12
    }
  ];

  useEffect(() => {
    requestCameraPermission();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: "user"
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      streamRef.current = stream;
      setHasPermission(true);
    } catch (error) {
      console.error("Camera permission denied:", error);
      setHasPermission(false);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setTaskProgress(0);
    
    const taskDuration = tasks[currentTask].duration * 1000;
    const startTime = Date.now();
    
    // Simulate facial expression analysis
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / taskDuration) * 100, 100);
      setTaskProgress(progress);
      
      // Simulate expression detection (in real implementation, this would use actual AI)
      const mockExpressions = ["neutral", "smile", "surprise", "concentration"];
      const randomExpression = mockExpressions[Math.floor(Math.random() * mockExpressions.length)];
      
      setRecordedData(prev => [...prev, {
        expression: randomExpression,
        timestamp: elapsed,
        confidence: 0.7 + Math.random() * 0.3,
        duration: 100 + Math.random() * 200
      }]);
      
      if (progress >= 100) {
        stopRecording();
      }
    }, 200);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setTimeout(() => {
      if (currentTask < tasks.length - 1) {
        setCurrentTask(currentTask + 1);
        setTaskProgress(0);
      } else {
        completeAnalysis();
      }
    }, 1000);
  };

  const completeAnalysis = () => {
    // Analyze recorded data
    const expressionCounts = recordedData.reduce((acc, data) => {
      acc[data.expression] = (acc[data.expression] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageConfidence = recordedData.reduce((sum, data) => sum + data.confidence, 0) / recordedData.length;
    
    const analysisResults = {
      totalRecordings: recordedData.length,
      expressionDistribution: expressionCounts,
      averageConfidence,
      taskCompletion: tasks.length,
      detectedSymptoms: {
        facialMobility: averageConfidence > 0.8 ? "normal" : "reduced",
        expressiveRange: Object.keys(expressionCounts).length > 2 ? "good" : "limited",
        motorSymmetry: Math.random() > 0.3 ? "symmetric" : "asymmetric"
      }
    };

    onComplete(analysisResults);
  };

  const skipCurrentTask = () => {
    if (currentTask < tasks.length - 1) {
      setCurrentTask(currentTask + 1);
      setTaskProgress(0);
    } else {
      completeAnalysis();
    }
  };

  if (hasPermission === null) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p>Requesting camera permission...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <Alert className="mb-6">
              <Eye className="h-4 w-4" />
              <AlertDescription>
                Camera access is required for facial expression analysis. Please enable camera permissions and refresh the page.
              </AlertDescription>
            </Alert>
            <Button onClick={requestCameraPermission}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-warning" />
              Facial Expression Analysis
            </CardTitle>
            <Badge variant="secondary">
              Task {currentTask + 1} of {tasks.length}
            </Badge>
          </div>
          <Progress value={((currentTask) / tasks.length) * 100} className="mt-2" />
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Video Feed */}
            <div className="space-y-4">
              <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {isRecording && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Recording</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {!isRecording ? (
                  <Button 
                    onClick={startRecording} 
                    className="flex-1 bg-accent hover:bg-accent/90"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Task
                  </Button>
                ) : (
                  <Button 
                    onClick={stopRecording} 
                    variant="destructive"
                    className="flex-1"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop Recording
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={skipCurrentTask}
                >
                  Skip Task
                </Button>
              </div>
            </div>

            {/* Task Instructions */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">{tasks[currentTask].name}</h3>
                <p className="text-muted-foreground">{tasks[currentTask].description}</p>
              </div>

              {isRecording && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Task Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(taskProgress)}%
                    </span>
                  </div>
                  <Progress value={taskProgress} className="mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Duration: {tasks[currentTask].duration} seconds
                  </p>
                </div>
              )}

              {/* Analysis Preview */}
              {recordedData.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Live Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Expressions Detected:</span>
                      <span>{recordedData.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Confidence:</span>
                      <span>
                        {recordedData.length > 0 
                          ? Math.round((recordedData.reduce((sum, d) => sum + d.confidence, 0) / recordedData.length) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Latest: {recordedData[recordedData.length - 1]?.expression || "None"}
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <Alert>
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  Position yourself clearly in the camera frame. Ensure good lighting and look directly at the camera during each task.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacialRecognition;