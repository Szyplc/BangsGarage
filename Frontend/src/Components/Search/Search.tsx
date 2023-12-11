/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import "./Search.css";

interface Profile {
  name: string;
  age: number;
}

interface Filter {
  name: string;
  filter: (filter: Filter) => void;
  selected: boolean;
}

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Funkcja obsługująca wyszukiwanie
  const handleSearch = () => {
    // Logika wyszukiwania profilu na podstawie searchQuery
    console.log("Szukaj: ", searchQuery);
  };



  // Dane profili - przykładowe dane
  const profiles: Profile[] = [
    { name: "Profil 1", age: 25 },
    { name: "Profil 2", age: 30 },
    { name: "Profil 3", age: 27 },
    { name: "Profil 1", age: 25 },
    { name: "Profil 2", age: 30 },
    { name: "Profil 3", age: 27 },
    { name: "Profil 1", age: 25 },
    { name: "Profil 2", age: 30 },
    { name: "Profil 3", age: 27 },
    { name: "Profil 1", age: 25 },
    { name: "Profil 2", age: 30 },
    { name: "Profil 3", age: 27 },
    { name: "Profil 1", age: 25 },
    { name: "Profil 2", age: 30 },
    { name: "Profil 3", age: 27 },
    // Dodaj więcej profili...
  ];

  const [filters] = useState<Filter[]>([
    { name: "Filter 1", filter: function() { this.selected = !this.selected; console.log(this.selected)}, selected: false },
    { name: "Filter 2", filter: () => { console.log("filtruje 2") }, selected: false },
    { name: "Filter 3", filter: () => { console.log("filtruje 3") }, selected: false },
    { name: "Filter 4", filter: () => { console.log("filtruje 4") }, selected: false },
    { name: "Filter 5", filter: () => { console.log("filtruje 5") }, selected: false },
    { name: "Filter 3", filter: () => { console.log("filtruje 3") }, selected: false },
    { name: "Filter 4", filter: () => { console.log("filtruje 4") }, selected: false },
    { name: "Filter 5", filter: () => { console.log("filtruje 5") }, selected: false },
    // Dodaj więcej filtrów...
  ])

  return (
    <div className="profile-search-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Szukaj..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Szukaj</button>
      </div>

      <div className="filter-buttons-container">
        <div className="filter-buttons">
          {filters.map((filter, index) => (
            <button style={filter.selected ? {backgroundColor: "#00ff00"} : {}} key={index} >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      <div className="profile-list">
        {profiles.map((profile, index) => (
          <div key={index} className="profile-card">
            <p>{profile.name}</p>
            <p>Wiek: {profile.age}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
