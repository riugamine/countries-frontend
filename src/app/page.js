import Link from 'next/link';

export default async function Home() {
  // Fetching data from the backend
  const response = await fetch('http://localhost:3001/api/countries');
  const countries = await response.json();

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Countries List</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {countries.map((country) => (
          <div
            key={country.countryCode}
            className="flex items-center p-4 bg-white shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={`https://flagcdn.com/w320/${country.countryCode.toLowerCase()}.png`}
              alt={`Flag of ${country.name}`}
              className="w-12 h-8 mr-4 rounded"
            />
            <Link href={`/country/${country.countryCode}`} className="text-xl text-blue-600 hover:text-blue-800">
              {country.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
