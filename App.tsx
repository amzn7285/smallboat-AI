import React, { useState } from 'react';
import { AppState } from './types';
import { generateBrandStrategy, getMarketInsights, generateLogo } from './services/geminiService';
import LiveConsultant from './components/LiveConsultant';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

const dummyChartData = [
  { name: 'Month 1', growth: 100 },
  { name: 'Month 2', growth: 250 },
  { name: 'Month 3', growth: 400 },
  { name: 'Month 4', growth: 800 },
  { name: 'Month 5', growth: 1200 },
  { name: 'Month 6', growth: 2500 },
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'intro',
    insights: [],
    loading: false
  });

  const [idea, setIdea] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const handleStartAnalysis = async () => {
    console.log("BUTTON CLICKED");
    console.log("IDEA VALUE:", idea);

    if (!idea.trim()) {
      alert("Please enter a valid business idea.");
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true }));

      console.log("Calling generateBrandStrategy...");
      const brand = await generateBrandStrategy(idea);

      console.log("Brand received:", brand);

      console.log("Calling getMarketInsights...");
      const insights = await getMarketInsights(brand.name, idea);

      console.log("Insights received:", insights);

      setState({
        step: 'analyze',
        brand,
        insights,
        loading: false
      });

    } catch (err) {
      console.error("ANALYSIS ERROR:", err);
      alert("Error occurred. Check console.");
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleGenerateLogo = async () => {
    if (!state.brand) return;

    try {
      setState(prev => ({ ...prev, loading: true }));

      console.log("Calling generateLogo...");
      const url = await generateLogo(state.brand.logoPrompt);

      setLogoUrl(url);
      setState(prev => ({ ...prev, step: 'design', loading: false }));

    } catch (err) {
      console.error("LOGO ERROR:", err);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-7xl mx-auto px-6 pt-12">

        {state.step === 'intro' && (
          <div className="text-center py-20">
            <h1 className="text-6xl font-black mb-6">
              Architect Your <br />
              <span className="text-indigo-400">Next Billion Dollar</span> Brand.
            </h1>

            <div className="max-w-2xl mx-auto p-2 rounded-2xl flex items-center border">
              <input 
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe your business idea"
                className="flex-1 px-6 py-4 outline-none text-lg"
              />
              <button 
                onClick={handleStartAnalysis}
                disabled={state.loading}
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl disabled:opacity-50"
              >
                {state.loading ? 'Architecting...' : 'Build It Now'}
              </button>
            </div>
          </div>
        )}

        {state.step === 'analyze' && state.brand && (
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">{state.brand.name}</h2>
            <p className="italic">{state.brand.tagline}</p>

            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dummyChartData}>
                <Area type="monotone" dataKey="growth" stroke="#6366f1" fill="#818cf8" />
              </AreaChart>
            </ResponsiveContainer>

            <button 
              onClick={handleGenerateLogo}
              disabled={state.loading}
              className="px-6 py-3 bg-black text-white rounded-xl"
            >
              {state.loading ? 'Designing...' : 'Generate Logo'}
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;