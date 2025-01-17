'use client'

import { use, Suspense } from 'react';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function CountryInfo({ params }) {
  const countryCode = use(params);

  // loading state
  const [isLoading, setIsLoading] = useState(true);

  // State init
  const [countryData, setCountryData] = useState({
    country: '',
    flag: '',
    borders: [],
    population: [],
  });

  // Fetch country data cuando countryCode is available
  useEffect(() => {
    if (countryCode?.countryCode) {
      setIsLoading(true); // loading state
      fetch(`http://localhost:3001/api/countries/${countryCode.countryCode}`)
        .then((response) => response.json())
        .then((data) => {
          setCountryData(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching country data:', error);
          setIsLoading(false);
        });
    }
  }, [countryCode]);

  // show loading message
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!countryData || !Array.isArray(countryData.population) || countryData.population.length === 0) {
    return <p>No data available for this country.</p>;
  }

  // population data
  const populationData = countryData.population;
  const chartData = {
    labels: populationData.map((item) => item.year),
    datasets: [
      {
        label: 'Population Over Time',
        data: populationData.map((item) => item.value),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Título principal */}
      <h1 className="text-4xl font-semibold text-center text-blue-600 mb-4">{countryData.country}</h1>
      
      {/* Bandera */}
      <div className="flex justify-center mb-6">
        <img
          src={countryData.flag}
          alt={`Flag of ${countryData.country}`}
          width={150}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Border Countries */}
      <section className="my-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Border Countries</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {countryData.borders.map((border) => (
            <li key={border.countryCode} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <a
                href={`/country/${border.countryCode}`}
                className="text-lg text-blue-500 hover:text-blue-700"
              >
                {border.commonName}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Gráfico de Población */}
      <section className="my-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">Population Data</h3>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Line data={chartData} />
        </div>
      </section>
    </div>
  );
}
