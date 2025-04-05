
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, AlertCircle, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

// Quiz question types
type AnswerOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type QuizQuestion = {
  id: number;
  question: string;
  type: "single" | "multiple";
  options: AnswerOption[];
  explanation?: string;
};

// Mock quiz data
const generateQuiz = (contentId: number): QuizQuestion[] => {
  const baseQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "Câu hỏi về kiến thức cơ bản trong chương này?",
      type: "single",
      options: [
        { id: "a", text: "Đáp án A - đúng", isCorrect: true },
        { id: "b", text: "Đáp án B", isCorrect: false },
        { id: "c", text: "Đáp án C", isCorrect: false },
        { id: "d", text: "Đáp án D", isCorrect: false },
      ],
      explanation: "Đáp án A là đúng vì nó phản ánh đúng nguyên lý cơ bản được trình bày trong bài học."
    },
    {
      id: 2,
      question: "Đâu là những ứng dụng của công nghệ này trong thực tế?",
      type: "multiple",
      options: [
        { id: "a", text: "Ứng dụng trong phát triển phần mềm", isCorrect: true },
        { id: "b", text: "Ứng dụng trong y tế", isCorrect: true },
        { id: "c", text: "Ứng dụng trong nấu ăn", isCorrect: false },
        { id: "d", text: "Ứng dụng trong phân tích dữ liệu", isCorrect: true },
      ],
      explanation: "Công nghệ này được áp dụng rộng rãi trong phát triển phần mềm, y tế và phân tích dữ liệu."
    },
    {
      id: 3,
      question: "Đâu là phát biểu đúng về chủ đề này?",
      type: "single",
      options: [
        { id: "a", text: "Phát biểu A", isCorrect: false },
        { id: "b", text: "Phát biểu B", isCorrect: false },
        { id: "c", text: "Phát biểu C - đúng", isCorrect: true },
        { id: "d", text: "Phát biểu D", isCorrect: false },
      ],
      explanation: "Phát biểu C mô tả chính xác khái niệm như đã trình bày trong bài học."
    },
    {
      id: 4,
      question: "Hãy chọn các bước đúng trong quy trình:",
      type: "multiple",
      options: [
        { id: "a", text: "Bước 1", isCorrect: true },
        { id: "b", text: "Bước 2", isCorrect: true },
        { id: "c", text: "Bước 3", isCorrect: false },
        { id: "d", text: "Bước 4", isCorrect: true },
      ],
      explanation: "Quy trình đúng bao gồm Bước 1, Bước 2 và Bước 4."
    },
    {
      id: 5,
      question: "Câu hỏi cuối cùng về ứng dụng của kiến thức?",
      type: "single",
      options: [
        { id: "a", text: "Đáp án A", isCorrect: false },
        { id: "b", text: "Đáp án B - đúng", isCorrect: true },
        { id: "c", text: "Đáp án C", isCorrect: false },
        { id: "d", text: "Đáp án D", isCorrect: false },
      ],
      explanation: "Đáp án B là chính xác vì nó thể hiện đúng cách ứng dụng kiến thức vào tình huống thực tế."
    }
  ];
  
  // Add some variety based on contentId
  return baseQuestions.map(q => ({
    ...q,
    question: `${q.question} (Câu ${q.id} của bài kiểm tra ${contentId})`,
    id: q.id + contentId * 10 // Make IDs unique across quizzes
  }));
};

interface QuizContentProps {
  isFinalExam?: boolean;
  onComplete: (score: number) => void;
  courseId: number;
}

const QuizContent = ({ isFinalExam = false, onComplete, courseId }: QuizContentProps) => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string[]}>({}); // Stores answers for each question
  const [isSubmitted, setIsSubmitted] = useState(false); // Whether the current question is submitted
  const [score, setScore] = useState(0); // Quiz score
  const [quizCompleted, setQuizCompleted] = useState(false); // Whether the entire quiz is completed
  
  useEffect(() => {
    // Generate quiz based on quizId or use a special exam quiz if it's the final exam
    const quizData = isFinalExam 
      ? generateQuiz(9999) // Special ID for final exam
      : generateQuiz(parseInt(quizId || "0"));
    
    setQuizQuestions(quizData);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  }, [quizId, isFinalExam]);
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  const handleSingleSelection = (value: string) => {
    if (isSubmitted) return;
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: [value]
    });
  };
  
  const handleMultipleSelection = (value: string, checked: boolean) => {
    if (isSubmitted) return;
    
    const currentSelections = selectedAnswers[currentQuestion.id] || [];
    
    if (checked) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion.id]: [...currentSelections, value]
      });
    } else {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion.id]: currentSelections.filter(v => v !== value)
      });
    }
  };
  
  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;
    
    const userAnswers = selectedAnswers[currentQuestion.id] || [];
    
    if (userAnswers.length === 0) {
      toast({
        title: "Vui lòng chọn đáp án",
        description: "Bạn cần chọn ít nhất một đáp án trước khi nộp bài",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitted(true);
    
    // Check if answer is correct
    const correctOptions = currentQuestion.options
      .filter(opt => opt.isCorrect)
      .map(opt => opt.id);
    
    // For single answer questions, there's only one correct answer
    // For multiple answer questions, all correct answers must be selected and no incorrect ones
    let isCorrect = false;
    
    if (currentQuestion.type === "single") {
      isCorrect = userAnswers[0] === correctOptions[0];
    } else {
      const allCorrectSelected = correctOptions.every(id => userAnswers.includes(id));
      const noIncorrectSelected = userAnswers.every(id => correctOptions.includes(id));
      isCorrect = allCorrectSelected && noIncorrectSelected;
    }
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setIsSubmitted(false);
    } else {
      // Quiz completed
      const finalScore = score + (isSubmitted && isCurrentAnswerCorrect() ? 1 : 0);
      const percentage = Math.round((finalScore / quizQuestions.length) * 100);
      
      setQuizCompleted(true);
      
      toast({
        title: "Hoàn thành bài kiểm tra",
        description: `Điểm của bạn: ${finalScore}/${quizQuestions.length} (${percentage}%)`
      });
      
      onComplete(percentage);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
      // Restore the submitted state for this question
      setIsSubmitted(!!selectedAnswers[quizQuestions[currentQuestionIndex - 1].id]);
    }
  };
  
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };
  
  const isCurrentAnswerCorrect = () => {
    if (!currentQuestion) return false;
    
    const userAnswers = selectedAnswers[currentQuestion.id] || [];
    const correctOptions = currentQuestion.options
      .filter(opt => opt.isCorrect)
      .map(opt => opt.id);
    
    if (currentQuestion.type === "single") {
      return userAnswers[0] === correctOptions[0];
    } else {
      const allCorrectSelected = correctOptions.every(id => userAnswers.includes(id));
      const noIncorrectSelected = userAnswers.every(id => correctOptions.includes(id));
      return allCorrectSelected && noIncorrectSelected;
    }
  };
  
  const handleFinishQuiz = () => {
    navigate(`/courses/${courseId}`);
  };
  
  if (!currentQuestion && !quizCompleted) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-epu-primary"></div>
      </div>
    );
  }
  
  if (quizCompleted) {
    const finalScore = score;
    const percentage = Math.round((finalScore / quizQuestions.length) * 100);
    const passed = percentage >= 60; // 60% to pass
    
    return (
      <Card className="p-8 max-w-2xl mx-auto">
        <div className="text-center space-y-6">
          <div className={`w-24 h-24 rounded-full ${passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'} flex items-center justify-center mx-auto`}>
            {passed ? (
              <CheckCircle size={48} className="text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle size={48} className="text-red-600 dark:text-red-400" />
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {passed ? 'Chúc mừng!' : 'Cố gắng hơn!'}
            </h2>
            <p className="text-muted-foreground">
              {passed 
                ? 'Bạn đã hoàn thành bài kiểm tra thành công!' 
                : 'Bạn chưa đạt đủ điểm để vượt qua bài kiểm tra này.'}
            </p>
          </div>
          
          <div className="py-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Điểm của bạn</span>
              <span className="font-medium">{percentage}%</span>
            </div>
            <Progress 
              value={percentage} 
              className={`h-3 ${
                percentage >= 80 ? 'bg-green-600' : 
                percentage >= 60 ? 'bg-yellow-600' : 
                'bg-red-600'
              }`} 
            />
            <div className="mt-2 text-center text-sm text-muted-foreground">
              {finalScore}/{quizQuestions.length} câu trả lời đúng
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleRestartQuiz} variant="outline" className="gap-2">
              <RotateCcw size={16} /> Làm lại bài kiểm tra
            </Button>
            <Button onClick={handleFinishQuiz} className="gap-2">
              Quay lại khóa học <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Câu hỏi {currentQuestionIndex + 1}/{quizQuestions.length}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tiến độ</span>
          <Progress value={(currentQuestionIndex / quizQuestions.length) * 100} className="w-24 h-2" />
        </div>
      </div>
      
      <Card className="p-6">
        <CardContent className="p-0">
          <div className="space-y-6">
            <h3 className="text-xl font-bold">{currentQuestion.question}</h3>
            
            {currentQuestion.type === "single" ? (
              <RadioGroup 
                value={selectedAnswers[currentQuestion.id]?.[0] || ""} 
                onValueChange={handleSingleSelection}
                className="space-y-3"
              >
                {currentQuestion.options.map(option => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-2 p-3 rounded-md border ${
                      isSubmitted && selectedAnswers[currentQuestion.id]?.includes(option.id) && !option.isCorrect
                        ? 'border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-700'
                        : isSubmitted && option.isCorrect
                        ? 'border-green-300 bg-green-50 dark:bg-green-900/10 dark:border-green-700'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <RadioGroupItem 
                      value={option.id} 
                      id={`option-${option.id}`} 
                      disabled={isSubmitted}
                    />
                    <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                      {option.text}
                    </Label>
                    {isSubmitted && option.isCorrect && (
                      <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                    )}
                    {isSubmitted && selectedAnswers[currentQuestion.id]?.includes(option.id) && !option.isCorrect && (
                      <AlertCircle size={18} className="text-red-600 dark:text-red-400" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-3">
                {currentQuestion.options.map(option => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-2 p-3 rounded-md border ${
                      isSubmitted && selectedAnswers[currentQuestion.id]?.includes(option.id) && !option.isCorrect
                        ? 'border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-700'
                        : isSubmitted && option.isCorrect && selectedAnswers[currentQuestion.id]?.includes(option.id)
                        ? 'border-green-300 bg-green-50 dark:bg-green-900/10 dark:border-green-700'
                        : isSubmitted && option.isCorrect && !selectedAnswers[currentQuestion.id]?.includes(option.id)
                        ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-700'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Checkbox 
                      id={`option-${option.id}`}
                      checked={selectedAnswers[currentQuestion.id]?.includes(option.id) || false}
                      onCheckedChange={(checked) => 
                        handleMultipleSelection(option.id, checked as boolean)
                      }
                      disabled={isSubmitted}
                    />
                    <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                      {option.text}
                    </Label>
                    {isSubmitted && option.isCorrect && (
                      <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                    )}
                    {isSubmitted && selectedAnswers[currentQuestion.id]?.includes(option.id) && !option.isCorrect && (
                      <AlertCircle size={18} className="text-red-600 dark:text-red-400" />
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Show explanation after submission */}
            {isSubmitted && currentQuestion.explanation && (
              <div className={`p-4 rounded-md ${
                isCurrentAnswerCorrect() 
                  ? 'bg-green-50 border border-green-200 dark:bg-green-900/10 dark:border-green-800'
                  : 'bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-800'
              }`}>
                <p className="text-sm">
                  <span className="font-medium">Giải thích: </span>
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          className="gap-2"
        >
          <ChevronLeft size={16} /> Trước
        </Button>
        
        {!isSubmitted ? (
          <Button onClick={handleSubmitAnswer}>
            Kiểm tra đáp án
          </Button>
        ) : (
          <Button onClick={handleNextQuestion}>
            {currentQuestionIndex < quizQuestions.length - 1 ? (
              <>Câu tiếp theo <ChevronRight size={16} /></>
            ) : (
              <>Hoàn thành <CheckCircle size={16} className="ml-1" /></>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizContent;
