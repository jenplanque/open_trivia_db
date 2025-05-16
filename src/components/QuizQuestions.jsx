import React from 'react';
import './QuizQuestions.css';

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const QuizQuestions = ({
  quizQuestions,
  currentQuestionIndex,
  score,
  shuffledOptions,
  selectedAnswer,
  answerStatus,
  handleOptionSelect,
  handleNext,
  handleRestart,
  username, // <-- add this line
}) => {
  const currentQ = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
  const quizComplete = isLastQuestion && !!answerStatus;

  const percentCorrect = quizQuestions.length
    ? Math.round((score.correct / quizQuestions.length) * 100)
    : 0;

  if (quizComplete) {
    return (
      <div className="quiz-container">
        <div className="quiz-score">
          Final Score: {score.correct} correct / {score.incorrect} incorrect
        </div>
        <div className="quiz-percentage">
          Percentage Correct: {percentCorrect}%
        </div>
        <button
          onClick={handleRestart}
          className="quiz-button"
        >
          Restart
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>Welcome, {capitalizeFirst(username)}!</h2>
      <div className="quiz-score">
        Score: {score.correct} correct / {score.incorrect} incorrect
      </div>
      <h3>
        Question {currentQuestionIndex + 1} of {quizQuestions.length}
      </h3>
      <div
        className="quiz-question"
        dangerouslySetInnerHTML={{ __html: currentQ.question }}
      />
      <ul className="quiz-options">
        {shuffledOptions.map((option, idx) => {
          const isCorrect =
            option === quizQuestions[currentQuestionIndex].correct_answer;
          let className = 'quiz-option';

          if (selectedAnswer) {
            if (isCorrect && answerStatus === 'INCORRECT') {
              className += ' correct';
            } else if (selectedAnswer === option) {
              className +=
                answerStatus === 'CORRECT' ? ' correct' : ' incorrect';
            }
          }

          return (
            <li
              key={idx}
              className={className}
              onClick={() => handleOptionSelect(option)}
              dangerouslySetInnerHTML={{ __html: option }}
            />
          );
        })}
      </ul>
      {answerStatus && (
        <div className={`quiz-feedback ${answerStatus.toLowerCase()}`}>
          {answerStatus}
        </div>
      )}
      {selectedAnswer && !isLastQuestion && (
        <button
          onClick={handleNext}
          className="quiz-button"
        >
          Continue
        </button>
      )}
    </div>
  );
};

export default QuizQuestions;
