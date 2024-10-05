import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data using async/await
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );
        const result = await response.json();
        setData(result);
        setFilteredData(result); // Set filtered data initially to the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Search function
  const handleSearch = () => {
    const filtered = data.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Sort by market cap
  const sortByMarketCap = () => {
    const sorted = [...filteredData].sort(
      (a, b) => b.market_cap - a.market_cap
    );
    setFilteredData(sorted);
  };

  // Sort by percentage change
  const sortByPercentageChange = () => {
    const sorted = [...filteredData].sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    );
    setFilteredData(sorted);
  };

  return (
    <div className="App">
      <div className="btn-containter">
        {/* Search Input */}
        <input
          id="myInput"
          type="text"
          placeholder="Search By Name and Symbol"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn" onClick={handleSearch}>
          Search
        </button>

        {/* Sort Buttons */}
        <button className="btn" onClick={sortByMarketCap}>
          Sort by Market Cap
        </button>
        <button className="btn" onClick={sortByPercentageChange}>
          Sort by Percentage Change
        </button>
      </div>
      {/* Table */}
      <table>
        <tbody>
          {filteredData.map((coin) => (
            <tr key={coin.id}>
              <td style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={coin.image}
                  alt={coin.name}
                  width="30"
                  style={{ marginRight: "10px" }}
                />
                {coin.name}
              </td>
              {/* <td>{coin.id}</td> */}
              <td>{coin.symbol.toUpperCase()}</td>
              <td>${coin.current_price}</td>
              <td>
                <span
                  style={{
                    color:
                      coin.market_cap_change_percentage_24h < 0
                        ? "red"
                        : "green",
                  }}
                >
                  {coin.market_cap_change_percentage_24h.toFixed(2)}%
                </span>
              </td>
              <td>Mkt Cap : ${coin.market_cap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
