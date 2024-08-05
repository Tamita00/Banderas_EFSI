"use client";

import { useEffect, useState } from 'react';
import styles from "./page.module.css";

// Función para seleccionar un elemento aleatorio
function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export default function Home() {
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [usedCountries, setUsedCountries] = useState([]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');
        if (!res.ok) {
          throw new Error("Request invalid");
        }
        const json_data = await res.json();
        setCountries(json_data.data);
      } catch (error) {
        console.error(error.message);
        setError("Failed to fetch countries");
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    // Filtrar países usados y seleccionar un país aleatorio
    const availableCountries = countries.filter(c => !usedCountries.some(uc => uc.country === c.country));
    if (availableCountries.length > 0) {
      const randomCountry = getRandomElement(availableCountries);
      setCurrentCountry(randomCountry);
    } else {
      setCurrentCountry(null);
    }
  }, [countries, usedCountries]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedInput = userInput.trim().toLowerCase();

    if (currentCountry) {
      const currentCountryName = currentCountry.country ? currentCountry.country.toLowerCase() : '';

      if (trimmedInput === currentCountryName) {
        setScore(prevScore => prevScore + 10); // Incrementar la puntuación
      } else {
        setScore(prevScore => Math.max(prevScore - 1, 0)); // Decrementar la puntuación, sin permitir valores negativos
      }

      // Añadir el país actual a la lista de países usados
      setUsedCountries(prevUsedCountries => [...prevUsedCountries, currentCountry]);

      // Limpiar el campo de entrada
      setUserInput("");

      // Actualizar el país actual para la próxima ronda
      updateCurrentCountry();
    }
  };

  const updateCurrentCountry = () => {
    const availableCountries = countries.filter(c => !usedCountries.some(uc => uc.country === c.country));
    if (availableCountries.length > 0) {
      const randomCountry = getRandomElement(availableCountries);
      setCurrentCountry(randomCountry);
    } else {
      setCurrentCountry(null);
    }
  };

  useEffect(() => {
    if (score >= 100 || !currentCountry) {
      setCurrentCountry(null);
    }
  }, [score]);

  return (
    <div className={styles.main}>
      <div className={styles.gameContainer}>
        <h1 className={styles.gameTitle}>Juego de Banderas</h1>
        {error && <p className={styles.error}>{error}</p>}
        {currentCountry ? (
          <div>
            <img src={currentCountry.flag} alt={currentCountry.country} className={styles.flagImage} />
            <p>¿De qué país es esta bandera?</p><br></br>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                value={userInput} 
                onChange={(e) => setUserInput(e.target.value)} 
                placeholder="Escribe el nombre del país"
                className={styles.inputField}
              />
              <button type="submit" className={styles.submitButton}>Enviar</button>
            </form><br></br>
            <p className={styles.score}>Puntuación: {score}</p>
          </div>
        ) : (
          <p className={styles.gameOver}>¡Juego terminado! Tu puntuación final es: {score}</p>
        )}
      </div>
    </div>
  );
}
