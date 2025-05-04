import { useState } from "react";

function QuestionForm() {
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [type, setType] = useState("");

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    }
    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
    }
    const handleTypeChange = (event) => {
        setType(event.target.value);
    }



}
