import { useState } from "react";

function App() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleBuild = async () => {
    console.log("BUTTON CLICKED");
    console.log("IDEA VALUE:", idea);

    if (!idea.trim()) {
      alert("Please enter a valid business idea.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);

      setResponse("Success! Your idea was submitted.");
    } catch (error) {
      console.error("ERROR:", error);
      setResponse("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #2563eb, #1e3a8a)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "10px",
          width: "400px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Describe Your Business Idea
        </h2>

        <input
          value={idea}
          onChange={(e) => {
            console.log("Typing:", e.target.value);
            setIdea(e.target.value);
          }}
          placeholder="e.g., AI-powered fitness app"
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            color: "#000000",
            backgroundColor: "#f4f4f4",
          }}
        />

        <button
          onClick={handleBuild}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: loading ? "#999" : "#000",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {loading ? "Building..." : "Build It Now"}
        </button>

        {response && (
          <p style={{ marginTop: "20px", fontWeight: "bold" }}>
            {response}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;