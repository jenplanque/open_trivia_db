import QuestionOptions from './QuestionOptions';

function Results({ questions, username, handleQuizFinish }) {
  const correctAnswers = questions.filter(
    (question) => question.userAnswer === question.correct_answer
  ).length;
  const totalQuestions = questions.length;
  const score = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  return (
    <div>
      <h2>Results</h2>
      <p>
        {username}, you answered {correctAnswers} out of {totalQuestions}{' '}
        questions correctly.
      </p>
      <p>Your score: {score}%</p>
      <button onClick={handleQuizFinish}>Play Again</button>
    </div>
  );
}

export default Results;
