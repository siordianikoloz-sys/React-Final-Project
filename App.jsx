import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./assets/components/UserContext";
import Home from "./assets/components/UserForm";
import Question from "./assets/components/Question";
import Results from "./assets/components/Results";
import Header from "./assets/components/Header";
import './App.css';

const questions = [
  {
    question: "What's your favorite color?",
    options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
  },
];

const keywords = {
  Fire: "fire",
  Water: "water",
  Earth: "earth",
  Air: "air",
};

const elements = {
  "Red 🔴": "Fire",
  "Blue 🔵": "Water",
  "Green 🟢": "Earth",
  "Yellow 🟡": "Air",
};

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userName, setUserName] = useState("");
  const [element, setElement] = useState("");
  const [artwork, setArtwork] = useState(null);

  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function handleUserFormSubmit(name) {
    setUserName(name);
  }

  function determineElement(answers) {
    const counts = {};
    answers.forEach(function(answer) {
      const element = elements[answer];
      counts[element] = (counts[element] || 0) + 1;
    });
    return Object.keys(counts).reduce(function(a, b) {
      return counts[a] > counts[b] ? a : b;
    });
  }

  async function fetchArtwork(keyword) {
    try {
      const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${keyword}`);
      const data = await response.json();
      if (data.objectIDs && data.objectIDs.length > 0) {
        const objectRes = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${data.objectIDs[0]}`);
        const objectData = await objectRes.json();
        setArtwork(objectData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(function () {
    if (currentQuestionIndex === questions.length && questions.length > 0) {
      const selectedElement = determineElement(answers);
      setElement(selectedElement);
      fetchArtwork(keywords[selectedElement]);
    }
  }, [currentQuestionIndex]);

  return (
    <UserProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home onSubmit={handleUserFormSubmit} />} />
        <Route
          path="/quiz"
          element={
            currentQuestionIndex < questions.length ? (
              <Question 
                question={questions[currentQuestionIndex].question} 
                options={questions[currentQuestionIndex].options} 
                onAnswer={handleAnswer} 
              />
            ) : (
              <Results element={element} artwork={artwork} />
            )
          }
        />
      </Routes>
    </UserProvider>
  );
}

export default App;
