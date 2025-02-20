import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./nxtpgs.css";
import { questions } from "../data/questions"; // Import questions from a separate file

const NextPages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State to track current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    location.state?.currentQuestionIndex || 0
  );
  
  // State for selected answer, result, and timer
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answers, setAnswers] = useState([]);  // To store all answers (correct, incorrect, not attempted)

  // Timer Effect
  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit(true); // If time runs out, mark as "Not Attempted"
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Reset state when moving to the next question
  useEffect(() => {
    setTimeLeft(15);
    setShowResult(false);
    setSelectedAnswer("");
  }, [currentQuestionIndex]);

  // Function to handle answer selection
  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  // Function to handle submission of an answer
  const handleSubmit = (isTimeOut = false) => {
    setShowResult(true);
    
    // Store answer: correct, incorrect, or not attempted
    setAnswers((prev) => [
      ...prev,
      {
        question: questions[currentQuestionIndex].question,
        selectedAnswer: isTimeOut ? "Not Attempted" : selectedAnswer,
        correctAnswer: questions[currentQuestionIndex].correctAnswer,
      },
    ]);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        navigate("/result", { state: { answers } });
      }
    }, 2000);
  };

  // Function to go back to the previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      navigate("/");
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h2 className="question-title">Question {currentQuestionIndex + 1}/{questions.length}</h2>
      <p className="timer">Time left: {timeLeft}s</p>
      <p className="question-text">{currentQuestion.question}</p>

      <div className="options-container">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`option-button ${selectedAnswer === option ? "selected" : ""}`}
            disabled={showResult}
          >
            {option}
          </button>
        ))}
      </div>

      {!showResult && (
        <button 
          onClick={() => handleSubmit(false)} 
          disabled={!selectedAnswer} 
          className="submit-button"
        >
          Submit
        </button>
      )}

      {showResult && (
        <p className={`result-message ${selectedAnswer === currentQuestion.correctAnswer ? "correct" : "incorrect"}`}>
          {selectedAnswer === currentQuestion.correctAnswer 
            ? "Correct!" 
            : selectedAnswer === "Not Attempted" 
            ? "Not Attempted!" 
            : "Incorrect!"}
        </p>
      )}

      {currentQuestionIndex > 0 && (
        <button onClick={handlePrevious} className="previous-button">
          Previous
        </button>
      )}
    </div>
  );
};

export default NextPages;
