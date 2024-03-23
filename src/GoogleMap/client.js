import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [data, setData] = useState("");

  const handleSubmit = () => {
    // Replace with your server IP and port
    const url = "http://127.0.0.1:8080";
    const body = { data };

    // Send data to server using Axios
    axios.post(url, body)
      .then((response) => {
        console.log("Response from server:", response.data);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

  return (
    <div>
      <input type="text" value={data} onChange={(e) => setData(e.target.value)} />
      <button onClick={handleSubmit}>שלח נתונים</button>
    </div>
  );
};

export default App;