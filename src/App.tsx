import "./App.css";
import TextureCanvas from "./components/TextureCanvas";
import { useEffect, useState } from "react";
import { JsonData } from "./types";

function App() {
  console.log("App component rendered");
  const [jsonDataList, setJsonDataList] = useState<JsonData[]>([]);

  useEffect(() => {
    console.log("useEffect in App.tsx: fetching data");
    fetch("/sample.json")
      .then((response) => response.json())
      .then((data) => {
        console.log("useEffect in App.tsx: data fetched", { data });
        setJsonDataList([data]);
      })
      .then(() => {
        console.log("useEffect in App.tsx: setting renderRequested to true");
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="App">
      <TextureCanvas jsonDataList={jsonDataList} />
    </div>
  );
}

export default App;
