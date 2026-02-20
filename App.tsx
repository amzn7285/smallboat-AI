import { useState } from "react";

function App() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const API_KEY = "AIzaSyCf8x9LQIjgJ7AoFEbfHepNAR-E6h40xXE";

  const handleBuild = async () => {
    console.log("BUTTON CLICKED");
    console.log("IDEA VALUE:", idea);

    if (!idea.trim()) {
      alert("Please enter a valid business idea.");
      return;
    }

    try {
      setLoading(true);
      setResponse("");

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Create a structured business plan for this idea:

${idea}

Include:
- Problem
- Solution
- Target Market
- Revenue Model
- Competitive Advantage`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      console.log("GEMINI RESPONSE:", data);

      if (!res.ok) {
        setResponse(JSON.stringify(data, null, 2));
        return;
      }

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response generated.";

      setResponse(text);
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
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "12px",
          width: "650px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          AI Business Plan Generator
        </h2>

        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g., AI-powered fitness app"
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            color: "#000",
            backgroundColor: "#fff",
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
          {loading ? "Generating..." : "Generate Business Plan"}
        </button>

        {response && (
          <pre
            style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#f4f4f4",
              borderRadius: "8px",
              overflowX: "auto",
              fontSize: "14px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {response}
          </pre>
        )}
      </div>
    </div>
  );
}

export default App;