import { useEffect, useState } from 'react';

function QuestionOptions() {
  const [username, setUsername] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [error, setError] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetch('https://opentdb.com/api_category.php')
        .then((response) => response.json())
        .then((data) => {
          setCategories(data.trivia_categories);
        })
        .catch((error) => console.error('Error fetching categories:', error));
    }, 600);

    return () => clearTimeout(handler);
  }, []);

  const handleNameChange = (event) => setUsername(event.target.value);
  const handleCategoryChange = (event) =>
    setSelectedCategory(event.target.value);
  const handleDifficultyChange = (event) => setDifficulty(event.target.value);

  const validateForm = () => {
    if (
      selectedCategory === '' ||
      difficulty === '' ||
      username.trim() === ''
    ) {
      setError('Name, category and difficulty level required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const apiUrl = `https://opentdb.com/api.php?amount=2&category=${selectedCategory}&difficulty=${difficulty}&type=multiple`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setQuizQuestions(data.results);
        setShowQuiz(true); // Show quiz and hide form
      } catch (error) {
        setError('Failed to fetch quiz questions.');
        console.error(error);
      }
    }
  };

  // If showQuiz is true, skip form and show only the quiz questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState('');
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    if (showQuiz && quizQuestions.length > 0) {
      const currentQ = quizQuestions[currentQuestionIndex];
      if (currentQ) {
        const options = [
          ...currentQ.incorrect_answers,
          currentQ.correct_answer,
        ];
        // Shuffle options
        setShuffledOptions(options.sort(() => Math.random() - 0.5));
        setSelectedAnswer('');
        setAnswerStatus('');
      }
    }
    // eslint-disable-next-line
  }, [showQuiz, quizQuestions, currentQuestionIndex]);

  const handleOptionSelect = (option) => {
    if (selectedAnswer) return; // Prevent changing answer after selection
    setSelectedAnswer(option);
    const isCorrect =
      option === quizQuestions[currentQuestionIndex].correct_answer;
    setAnswerStatus(isCorrect ? 'CORRECT' : 'INCORRECT');
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((idx) => idx + 1);
    } else {
      setShowQuiz(false); // Optionally, you can show a summary here
    }
  };

  if (showQuiz && quizQuestions.length > 0) {
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
      </div>
    );
  }

  // Otherwise, show the trivia quiz setup form
  return (
    <div>
      <h2>Customize Trivia Options</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Name: </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={username}
            placeholder="Enter your name"
            onChange={handleNameChange}
          />
        </div>
        <br />
        <div>
          <label htmlFor="category">Category: </label>
          <select
            id="category"
            name="category"
            onChange={handleCategoryChange}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="difficulty">Difficulty: </label>
          <select
            id="difficulty"
            name="difficulty"
            onChange={handleDifficultyChange}
          >
            <option value="">Select difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <br />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Generate Quiz</button>
      </form>
    </div>
  );
}

export default QuestionOptions;
