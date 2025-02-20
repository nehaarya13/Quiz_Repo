import React, { useState, useEffect } from "react";
import { questions } from "./data/questions";
import "./components/nxtpgs.css";

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [timer, setTimer] = useState(30);
  const [reviewMode, setReviewMode] = useState(false);

  // Timer Effect
  useEffect(() => {
    if (timer > 0 && !showScore) {
      const interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      handleSubmit();
    }
  }, [timer, showScore]);

  // Handle Option Selection
  const handleOptionClick = (option) => {
    if (answers[currentQuestion] === null) {
      setSelectedOption(option);
    }
  };

  // Next Question Logic
  const handleNext = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = { selected: selectedOption, isCorrect };
    setAnswers(updatedAnswers);

    setSelectedOption(null);
    setReviewMode(false);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  // Previous Question Logic
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1]?.selected || null);
      setReviewMode(true);
    }
  };

  // Submit Quiz
  const handleSubmit = () => {
    setShowScore(true);
  };

  // Restart Quiz
  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowScore(false);
    setTimer(30);
    setAnswers(Array(questions.length).fill(null));
    setReviewMode(false);
  };

  return (
    <div className="quiz-container">
      {showScore ? (
        <div className="score-section">
          <h2>Quiz Completed!</h2>
          <p>Your Score: {score} / {questions.length}</p>
          <button className="btn" onClick={handleRestart}>Restart Quiz</button>
        </div>
      ) : (
        <>
          <p className="timer">Time Left: {timer}s</p>
          <h2>Question {currentQuestion + 1}/{questions.length}</h2>
          <p className="question">{questions[currentQuestion].question}</p>

          <div className="options">
            {questions[currentQuestion].options.map((option, index) => {
              const isSelected = selectedOption === option || answers[currentQuestion]?.selected === option;
              const isCorrect = option === questions[currentQuestion].correctAnswer;
              const isIncorrect = isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  className={`option-button 
                    ${reviewMode ? (isCorrect ? "correct" : isIncorrect ? "incorrect" : "") : ""}
                    ${isSelected ? "selected" : ""}`}
                  onClick={() => handleOptionClick(option)}
                  disabled={answers[currentQuestion] !== null}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div>
            {currentQuestion > 0 && (
              <button className="btn" onClick={handlePrevious}>Previous</button>
            )}
            {reviewMode ? (
              <button className="btn" onClick={handleNext}>Next</button>
            ) : (
              <button className="btn" onClick={handleNext} disabled={selectedOption === null}>
                {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
