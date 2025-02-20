import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/quizzz.css";

const questions = [
  {
    question: "What is the tallest mountain in the world?",
    options: ["K2", "Mount Everest", "Kangchenjunga", "Makalu"],
    correctAnswer: "Mount Everest",
  },
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswer: "Paris",
  },
  {
    question: "Which is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctAnswer: "Pacific",
  },
];

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answers, setAnswers] = useState([]); // Store answers

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion("Not Attempted"); // Auto-move when time ends
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleNextQuestion = (answer) => {
    setAnswers((prevAnswers) => [...prevAnswers, answer]); // Save answer

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(""); // Reset selection
      setTimeLeft(15); // Reset timer
      setShowResult(false);
    } else {
      setShowResult(true); // Show final result
      setTimeout(() => {
        navigate("/result", { state: { answers } }); // Navigate with answers
      }, 2000);
    }
  };

  return (
    <div className="quiz-container">
      <h2 className="question-title">Question {currentQuestionIndex + 1}/{questions.length}</h2>
      <p className="timer">Time left: {timeLeft}s</p>
      <p className="question-text">{questions[currentQuestionIndex].question}</p>

      <div className="options-container">
        {questions[currentQuestionIndex].options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedAnswer(option);
              handleNextQuestion(option);
            }}
            className={`option-button ${selectedAnswer === option ? "selected" : ""}`}
            disabled={selectedAnswer !== ""}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
