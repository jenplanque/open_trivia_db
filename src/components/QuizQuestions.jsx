import React from 'react'

const QuizQuestions = ({ quizQuestions, currentQuestionIndex, score, shuffledOptions, selectedAnswer, answerStatus, handleOptionSelect, handleNext, handleRestart }) => {
  const currentQ = quizQuestions[currentQuestionIndex];

    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <strong>
            Score: {score.correct} correct / {score.incorrect} incorrect
          </strong>
        </div>
        <h3>
          Question {currentQuestionIndex + 1} of {quizQuestions.length}
        </h3>
        <div
          dangerouslySetInnerHTML={{ __html: currentQ.question }}
          style={{ marginBottom: '1rem' }}
        />
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {shuffledOptions.map((option, idx) => {
            const isCorrect =
              option === quizQuestions[currentQuestionIndex].correct_answer;
            let style = {
              cursor: selectedAnswer ? 'default' : 'pointer',
              padding: '0.5rem',
              border: '1px solid #ccc',
              marginBottom: '0.5rem',
              borderRadius: '4px',
              background:
                selectedAnswer && isCorrect && answerStatus === 'INCORRECT'
                  ? '#d4edda'
                  : selectedAnswer === option
                  ? answerStatus === 'CORRECT'
                    ? '#d4edda'
                    : '#f8d7da'
                  : '#fff',
              fontWeight:
                selectedAnswer && isCorrect && answerStatus === 'INCORRECT'
                  ? 'bold'
                  : selectedAnswer === option
                  ? 'bold'
                  : 'normal',
            };
            return (
              <li
                key={idx}
                style={style}
                onClick={() => handleOptionSelect(option)}
                dangerouslySetInnerHTML={{ __html: option }}
              />
            );
          })}
        </ul>
        {answerStatus && (
          <div
            style={{
              color: answerStatus === 'CORRECT' ? 'green' : 'red',
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}
          >
            {answerStatus}
          </div>
        )}
        {selectedAnswer && (
          <button onClick={handleNext}>
            {currentQuestionIndex < quizQuestions.length - 1
              ? 'Continue'
              : 'Finish'}
          </button>
        )}
        <button onClick={handleRestart}>Restart</button>
      </div>
    );
}

export default QuizQuestions