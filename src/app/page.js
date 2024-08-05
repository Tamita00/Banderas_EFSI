"use client";

import { useEffect, useState } from 'react';
import Image from "next/image";
import styles from "./page.module.css";

//Funcion seleccionar index random
function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');
        if (!res.ok) {
          throw new Error("Request invalid");
        }
        const json_data = await res.json();
        setCountries(json_data.data);
        
        // Selecciona un país aleatorio después de recibir los datos
        if (json_data.data.length > 0) {
          const randomCountry = getRandomElement(json_data.data);
          setCurrentCountry(randomCountry);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchCountries();
  }, []);

 
  return (
    <div>
      <h1>Juego de Banderas</h1>
      {currentCountry && (
        <div>
          <img src={currentCountry.flag} alt={currentCountry.country} />
          <p>{currentCountry.country}</p>
        </div>
      )}
    </div>
  );
}
