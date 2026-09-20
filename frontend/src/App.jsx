import { useEffect, useState } from "react";
import api from "./services/api";


function App() {

  const [backendStatus, setBackendStatus] = useState("Checking...");


  useEffect(() => {

    const checkBackend = async () => {

      try {

        const response = await api.get("/health");

        if (response.data.status === "ok") {
          setBackendStatus("Connected");
        }

      } catch (error) {

        console.error(error);

        setBackendStatus("Disconnected");

      }

    };


    checkBackend();

  }, []);


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="text-center">

        <h1 className="text-5xl font-bold mb-4">
          AI Interview Agent
        </h1>

        <p className="text-gray-600 mb-4">
          Practice intelligent and adaptive AI-powered interviews.
        </p>

        <p className="mb-8">
          Backend Status: {backendStatus}
        </p>

        <button className="bg-black text-white px-6 py-3 rounded-lg">
          Start Interview
        </button>

      </div>

    </div>

  );

}


export default App;