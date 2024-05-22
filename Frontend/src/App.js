import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ queries, setQueries ] = useState([]);
  const [ listening, setListening ] = useState(false);

  useEffect( () => {
    if (!listening) {
      const events = new EventSource('https://eventbasedarchtecturebackend.onrender.com/events');

      events.onmessage = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const parsedData = JSON.parse(event.data);

        setQueries((queries) => queries.concat(parsedData));
      };

      setListening(true);
      // console.log(queries)
      // return () => {
      //   events.close();
      // }
    }
  }, [listening, queries]);

  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>Query</th>
        </tr>
      </thead>
      <tbody>
        {
          queries.map((query, i) =>
            <tr key={i}>
              <td>{query}</td>
            </tr>
          )
        }
      </tbody>
    </table>
  );
}

export default App;
