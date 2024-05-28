import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [queries, setQueries] = useState([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening) {
      const events = new EventSource('https://event-based-architecture-backend.onrender.com/events');
  
      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        console.log('Received data:', parsedData);
        
        // Check if received data is an array or a single object
        if (Array.isArray(parsedData)) {
          // If it's an array, replace the entire state with the new array
          setQueries(parsedData);
        } else {
          if (parsedData.table === 'questionnaire') {
            // If it's a single object
              setQueries((prevQueries) => {
                // Check if the ID already exists in the queries array
                const queryFound = prevQueries.find((query) => query.id === parseInt(parsedData.id));
                const index = queryFound ? queryFound.id : -1;
                console.log(queries);
                console.log(prevQueries);
                console.log(parsedData);
                if (index !== -1) {
                  // If the ID exists, update the specific object
                  return prevQueries.map(query =>
                    query.id === parseInt(parsedData.id) ? parsedData : query
                  );
                } else {
                  // If it doesn't exist, add the new query
                  console.log('else');
                  if (prevQueries.length < 3) {
                    // If there are less than 3 queries, add to the list
                    console.log('else and if');
                    return [...prevQueries, parsedData];
                  } else {
                    // If there are 3 queries, replace the first one and shift the rest
                    console.log('else and else');
                    return [parsedData, ...prevQueries.slice(1)];
                  }
                  // return [...prevQueries, parsedData];
                }
             });
          }
        }
      };
  
      setListening(true);
    }
  }, [queries,listening]);
  
  // console.log(queries);
  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          {/* <th>Table</th> */}
        </tr>
      </thead>
      <tbody>
        {
          queries?.map((queryObj, i) => (
            <tr key={i}>
              <td>{queryObj?.id}</td>
              <td>{queryObj?.name}</td>
              <td>{queryObj?.description}</td>
              {/* <td>{queryObj?.table}</td> */}
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}

export default App;
