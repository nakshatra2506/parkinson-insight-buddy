import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, CheckCircle, XCircle } from "lucide-react";

interface MemoryTestProps {
  onComplete: (data: any) => void;
}

interface TestResult {
  correct: boolean;
  responseTime: number;
  testType: string;
}

const MemoryTest = ({ onComplete }: MemoryTestProps) => {
  const [currentTest, setCurrentTest] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [showSequence, setShowSequence] = useState(false);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [targetSequence, setTargetSequence] = useState<number[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentWord, setCurrentWord] = useState("");
  const [wordList, setWordList] = useState<string[]>([]);
  const [recalledWords, setRecalledWords] = useState<string[]>([]);

  const tests = [
    {
      name: "Digit Span Test",
      description: "Remember and repeat number sequences",
      type: "sequence"
    },
    {
      name: "Word Recall Test", 
      description: "Remember a list of words",
      type: "words"
    },
    {
      name: "Pattern Recognition",
      description: "Identify repeated patterns",
      type: "pattern"
    }
  ];

  const words = ["apple", "chair", "ocean", "guitar", "mountain", "butterfly", "telescope", "pizza"];

  useEffect(() => {
    if (currentTest === 0) {
      generateSequence();
    } else if (currentTest === 1) {
      generateWordList();
    }
  }, [currentTest]);

  const generateSequence = () => {
    const length = Math.min(4 + Math.floor(results.length / 2), 8);
    const sequence = Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
    setTargetSequence(sequence);
    setUserSequence([]);
  };

  const generateWordList = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWordList(shuffled.slice(0, 5));
    setRecalledWords([]);
  };

  const startSequenceTest = () => {
    setIsTestActive(true);
    setShowSequence(true);
    setStartTime(new Date());
    
    setTimeout(() => {
      setShowSequence(false);
    }, targetSequence.length * 1000 + 1000);
  };

  const startWordTest = () => {
    setIsTestActive(true);
    setStartTime(new Date());
    let index = 0;
    
    const showNextWord = () => {
      if (index < wordList.length) {
        setCurrentWord(wordList[index]);
        index++;
        setTimeout(() => {
          setCurrentWord("");
          setTimeout(showNextWord, 500);
        }, 1500);
      } else {
        setTimeout(() => {
          setCurrentWord("Now recall the words you saw");
        }, 1000);
      }
    };
    
    showNextWord();
  };

  const handleSequenceInput = (digit: number) => {
    if (!isTestActive || showSequence) return;
    
    const newSequence = [...userSequence, digit];
    setUserSequence(newSequence);
    
    if (newSequence.length === targetSequence.length) {
      const correct = JSON.stringify(newSequence) === JSON.stringify(targetSequence);
      const responseTime = startTime ? Date.now() - startTime.getTime() : 0;
      
      setResults(prev => [...prev, {
        correct,
        responseTime,
        testType: tests[currentTest].name
      }]);
      
      setIsTestActive(false);
      
      setTimeout(() => {
        if (results.length < 2) {
          generateSequence();
        } else {
          nextTest();
        }
      }, 2000);
    }
  };

  const handleWordInput = (word: string) => {
    if (recalledWords.includes(word)) return;
    setRecalledWords(prev => [...prev, word]);
  };

  const finishWordTest = () => {
    const correct = recalledWords.length;
    const responseTime = startTime ? Date.now() - startTime.getTime() : 0;
    
    setResults(prev => [...prev, {
      correct: correct >= wordList.length * 0.6,
      responseTime,
      testType: tests[currentTest].name
    }]);
    
    setIsTestActive(false);
    nextTest();
  };

  const nextTest = () => {
    if (currentTest < tests.length - 1) {
      setCurrentTest(currentTest + 1);
    } else {
      // All tests complete
      const accuracy = results.filter(r => r.correct).length / results.length;
      const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
      
      onComplete({
        results,
        accuracy,
        averageResponseTime: avgResponseTime,
        totalTests: results.length
      });
    }
  };

  const skipTest = () => {
    nextTest();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-accent" />
              {tests[currentTest].name}
            </CardTitle>
            <Badge variant="secondary">
              Test {currentTest + 1} of {tests.length}
            </Badge>
          </div>
          <Progress value={(currentTest / tests.length) * 100} className="mt-2" />
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold mb-2">{tests[currentTest].name}</h3>
            <p className="text-muted-foreground">{tests[currentTest].description}</p>
          </div>

          {/* Sequence Test */}
          {currentTest === 0 && (
            <div className="space-y-6">
              {!isTestActive ? (
                <div className="text-center">
                  <p className="mb-4">You will see a sequence of numbers. Remember them and repeat in the same order.</p>
                  <Button onClick={startSequenceTest} className="bg-accent hover:bg-accent/90">
                    Start Sequence Test
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  {showSequence ? (
                    <div>
                      <p className="mb-4 text-sm text-muted-foreground">Remember this sequence:</p>
                      <div className="text-4xl font-mono space-x-2">
                        {targetSequence.map((digit, index) => (
                          <span key={index} className="inline-block w-12 h-12 bg-accent text-accent-foreground rounded-lg leading-12 text-center">
                            {digit}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-4 text-sm text-muted-foreground">Click the numbers in the same order:</p>
                      <div className="mb-4">
                        <div className="text-2xl font-mono space-x-1 mb-4">
                          {userSequence.map((digit, index) => (
                            <span key={index} className="inline-block w-8 h-8 bg-primary text-primary-foreground rounded leading-8 text-center text-sm">
                              {digit}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
                        {[1,2,3,4,5,6,7,8,9].map((digit) => (
                          <Button
                            key={digit}
                            variant="outline"
                            size="lg"
                            onClick={() => handleSequenceInput(digit)}
                            className="aspect-square"
                          >
                            {digit}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Word Test */}
          {currentTest === 1 && (
            <div className="space-y-6">
              {!isTestActive ? (
                <div className="text-center">
                  <p className="mb-4">You will see a series of words. Try to remember as many as possible.</p>
                  <Button onClick={startWordTest} className="bg-accent hover:bg-accent/90">
                    Start Word Test
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-4xl font-semibold mb-8 h-20 flex items-center justify-center">
                    {currentWord}
                  </div>
                  
                  {currentWord.includes("recall") && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Click the words you remember:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-2xl mx-auto">
                        {words.map((word) => (
                          <Button
                            key={word}
                            variant={recalledWords.includes(word) ? "default" : "outline"}
                            onClick={() => handleWordInput(word)}
                            className="text-sm"
                          >
                            {word}
                          </Button>
                        ))}
                      </div>
                      <Button onClick={finishWordTest} className="mt-4">
                        Finish Test
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Pattern Test */}
          {currentTest === 2 && (
            <div className="text-center">
              <p className="mb-4">Pattern recognition test coming soon...</p>
              <Button onClick={skipTest}>Skip to Results</Button>
            </div>
          )}

          {/* Results Display */}
          {results.length > 0 && (
            <div className="mt-8 pt-4 border-t">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Current Results
              </h4>
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{result.testType}</span>
                    <div className="flex items-center gap-2">
                      {result.correct ? (
                        <CheckCircle className="h-4 w-4 text-accent" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span className="text-muted-foreground">{result.responseTime}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryTest;