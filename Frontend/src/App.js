import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [queries, setQueries] = useState([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening) {
      const events = new EventSource('http://localhost:3000/events');

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        console.log('Received data:', parsedData);

        setQueries((queries) => {
          // Check if the ID already exists in the queries array
          const index = queries.findIndex(query => query.id === parsedData.id);
          if (index !== -1) {
            // If it exists, update the existing query
            const updatedQueries = [...queries];
            updatedQueries[index] = parsedData;
            return updatedQueries;
          } else {
            // If it doesn't exist, add the new query
            return queries.concat(parsedData);
          }
        });
      };

      setListening(true);
    }
  }, [listening, queries]);

  // Filter queries to include only entries related to the questionnaire table
  const questionnaireQueries = queries.filter(query => query.table === 'questionnaire');

  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Table</th>
        </tr>
      </thead>
      <tbody>
        {
          questionnaireQueries.map((queryObj, i) => (
            <tr key={i}>
              <td>{queryObj.id}</td>
              <td>{queryObj.name}</td>
              <td>{queryObj.description}</td>
              <td>{queryObj.table}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}

export default App;
