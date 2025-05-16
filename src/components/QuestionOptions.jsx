import { useEffect, useState } from 'react';
import QuizQuestions from './QuizQuestions';

function QuestionOptions() {
  const [username, setUsername] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [error, setError] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  // If showQuiz is true, skip form and show only the quiz questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState('');
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [shuffledOptions, setShuffledOptions] = useState([]);
  // const [restart, setRestart] = useState(false)

  const handleNameChange = (event) => setUsername(event.target.value);
  const handleCategoryChange = (event) =>
    setSelectedCategory(event.target.value);
  const handleDifficultyChange = (event) => setDifficulty(event.target.value);
  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((idx) => idx + 1);
    } else {
      setShowQuiz(false); 
    }
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const apiUrl = `https://opentdb.com/api.php?amount=2&category=${selectedCategory}&difficulty=${difficulty}&type=multiple`;
      console.log("API_URL", apiUrl)
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setQuizQuestions(data.results);
        setShowQuiz(true); 
      } catch (error) {
        setError('Failed to fetch quiz questions.');
        console.error(error);
      }
    }
  };

  const handleRestart = () => {
    // I think it is because of the default
    // setUsername(username);
    // setSelectedCategory(selectedCategory);
    // setDifficulty(difficulty);
    setQuizQuestions([]);
    setShowQuiz(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setAnswerStatus('');
    setScore({ correct: 0, incorrect: 0 });
    setShuffledOptions([]);
 };


  useEffect(() => {
      fetch('https://opentdb.com/api_category.php')
        .then((response) => response.json())
        .then((data) => {
          setCategories(data.trivia_categories);
        })
        .catch((error) => console.error('Error fetching categories:', error));
    },[]);


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
  }, [showQuiz, quizQuestions, currentQuestionIndex]);

  // Show quiz questions
  if (showQuiz && quizQuestions.length > 0) {
    return (
      <QuizQuestions
      quizQuestions={quizQuestions}
      currentQuestionIndex={currentQuestionIndex}
      score={score}
      shuffledOptions={shuffledOptions}
      selectedAnswer={selectedAnswer}
      answerStatus={answerStatus}
      handleOptionSelect={handleOptionSelect}
      handleNext={handleNext}
      handleRestart={handleRestart}
    />
    ); 
  }

  // MARK: This is an example
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
            value={selectedCategory}
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
            value={difficulty}
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
