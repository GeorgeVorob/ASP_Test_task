import React, { useEffect, useState } from 'react';
import './App.css';

export type weatherType = {
  date: string,
  temperatureC: number,
  temperatureF: number,
  summary: string
}

function App() {
  const [data, setData] = useState<weatherType[]>([]);

  useEffect(() => {
    fetch("https://localhost:7085/weatherforecast").then(res => {
      console.log("recieved res: ", res);
      return (res.json() as any) as weatherType[];
    }).then(_data => {
      console.log("recieved data: ", _data);
      setData(_data);
    })
  }, []);

  return (
    <div className="App">
        <p>
          data:
        </p>
        {data?.map((el, index) => {
          return (<p key={index}>{el.date}  {el.summary}  ({el.temperatureC})</p>);
        })}
    </div>
  );
}

export default App;
