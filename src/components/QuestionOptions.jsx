import React, { useEffect, useState } from 'react';

function QuestionOptions () {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [username, setUsername] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.trivia_categories);
      })
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);
  
    const handleCategoryChange = (event) => {
      setSelectedCategory(event.target.value);
    };

    const handleDifficultyChange = (event) => {
      setDifficulty(event.target.value);
    };
  
    const handleNameChange = (event) => {
      setUsername(event.target.value);
    };

    const validateForm = () => {
      if (selectedCategory === '' || difficulty === '' || username.trim() === '') {
        setError('Name, category and difficulty level required');
        return false;
      }
      setError('');
      return true;
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (validateForm()) {
        const apiUrl = `https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=${difficulty}`;
        console.log('Fetching:', apiUrl);
    
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          // Do something with the data, e.g., pass it to a parent component or set state
          console.log('Questions:', data);
        } catch (err) {
          setError('Failed to fetch questions.');
          console.error(err);
        }
      }
    };

    return (
      <div>
      <h2>Custom Trivia Options</h2>
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
          <option key={category.id} value={category.id}>
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
        <button type="submit">Start Guessing</button>
      </form>
      </div>
    );
  };
  

export default QuestionOptions;
