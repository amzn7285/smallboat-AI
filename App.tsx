import React, { useState } from 'react';
import { AppState, BrandIdentity, MarketInsight } from './types';
import { generateBrandStrategy, getMarketInsights, generateLogo } from './services/geminiService';
import LiveConsultant from './components/LiveConsultant';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

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
    if (!idea) return;
    setState(prev => ({ ...prev, loading: true }));
    try {
      const brand = await generateBrandStrategy(idea);
      const insights = await getMarketInsights(brand.name, idea);
      setState({ step: 'analyze', brand, insights, loading: false });
    } catch (err) {
      console.error(err);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleGenerateLogo = async () => {
    if (!state.brand) return;
    setState(prev => ({ ...prev, loading: true }));
    const url = await generateLogo(state.brand.logoPrompt);
    setLogoUrl(url);
    setState(prev => ({ ...prev, step: 'design', loading: false }));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold">S</div>
          <span className="text-xl font-bold tracking-tight">SMALLBOAT AI</span>
        </div>
        <div className="flex gap-6 text-sm font-medium text-gray-400">
          <button className="hover:text-white transition">Features</button>
          <button className="hover:text-white transition">Showcase</button>
          <button className="px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-full border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition">
            Sell Your Brand
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        {state.step === 'intro' && (
          <div className="text-center py-20">
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              Architect Your <br />
              <span className="gradient-text">Next Billion Dollar</span> Brand.
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
              SMALLBOAT AI combines Gemini's reasoning with real-time market data to build, design, and validate your business ideas in seconds.
            </p>

            <div className="max-w-2xl mx-auto glass p-2 rounded-2xl flex items-center">
              <input 
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe your business idea (e.g., A sustainable coffee brand for Gen Z)"
                className="flex-1 bg-transparent px-6 py-4 outline-none text-lg"
              />
              <button 
                onClick={handleStartAnalysis}
                disabled={state.loading}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold transition-all disabled:opacity-50"
              >
                {state.loading ? 'Architecting...' : 'Build It Now'}
              </button>
            </div>
          </div>
        )}

        {state.step === 'analyze' && state.brand && (
          <div className="space-y-12 animate-in fade-in duration-700">
             <div className="grid md:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-3xl space-y-4">
                  <h2 className="text-sm font-mono text-indigo-400 uppercase tracking-widest">Brand Strategy</h2>
                  <h3 className="text-4xl font-bold">{state.brand.name}</h3>
                  <p className="text-xl italic text-gray-400">"{state.brand.tagline}"</p>
                  <p className="text-gray-300 leading-relaxed">{state.brand.mission}</p>
                  
                  <div className="pt-6 border-t border-white/10">
                    <h4 className="text-sm font-bold mb-4">Target Audience</h4>
                    <p className="text-gray-400">{state.brand.targetAudience}</p>
                  </div>
                </div>

                <div className="glass p-8 rounded-3xl flex flex-col justify-between">
                   <div>
                      <h2 className="text-sm font-mono text-indigo-400 uppercase tracking-widest mb-4">Growth Projection</h2>
                      <div className="h-48 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={dummyChartData}>
                            <defs>
                              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="growth" stroke="#818cf8" fillOpacity={1} fill="url(#colorGrowth)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                   </div>
                   <div className="grid grid-cols-3 gap-4 mt-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-400">12x</div>
                        <div className="text-xs text-gray-500 uppercase">Est. ROI</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-400">3.4M</div>
                        <div className="text-xs text-gray-500 uppercase">Market Size</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-400">High</div>
                        <div className="text-xs text-gray-500 uppercase">Market Fit</div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 glass p-8 rounded-3xl">
                   <h2 className="text-2xl font-bold mb-6">Market Insights & Grounding</h2>
                   <div className="space-y-6">
                      {state.insights.map((insight, i) => (
                        <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col md:flex-row gap-4 items-start md:items-center">
                          <div className="flex-1">
                            <h4 className="font-bold text-indigo-300">{insight.competitor}</h4>
                            <p className="text-sm text-gray-400">Strength: {insight.strength}</p>
                            <p className="text-sm text-gray-400">Weakness: {insight.weakness}</p>
                          </div>
                          <div className="px-4 py-2 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/30">
                            Opportunity: {insight.opportunity}
                          </div>
                          {insight.sourceUrl && (
                            <a href={insight.sourceUrl} target="_blank" className="text-xs text-indigo-400 hover:underline">Source</a>
                          )}
                        </div>
                      ))}
                   </div>
                </div>

                <div className="glass p-8 rounded-3xl flex flex-col items-center justify-center text-center">
                   <h2 className="text-xl font-bold mb-2">Next Step: Identity</h2>
                   <p className="text-gray-400 text-sm mb-6">Generate your visual DNA and starting assets.</p>
                   <button 
                     onClick={handleGenerateLogo}
                     disabled={state.loading}
                     className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-indigo-100 transition disabled:opacity-50"
                   >
                     {state.loading ? 'Designing...' : 'Generate Visuals'}
                   </button>
                </div>
             </div>
          </div>
        )}

        {state.step === 'design' && state.brand && (
           <div className="animate-in slide-in-from-bottom-10 duration-700">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                 <div className="glass p-12 rounded-[3rem] border-2 border-indigo-500/50 flex items-center justify-center min-h-[400px]">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Generated Brand Logo" className="max-w-[300px] w-full shadow-2xl rounded-2xl" />
                    ) : (
                      <div className="text-gray-500 animate-pulse">Visualizing...</div>
                    )}
                 </div>
                 
                 <div className="space-y-8">
                    <h2 className="text-5xl font-black">{state.brand.name} Identity</h2>
                    
                    <div className="grid grid-cols-2 gap-8">
                       <div>
                          <h4 className="text-xs font-mono text-gray-500 uppercase mb-3">Palette</h4>
                          <div className="flex gap-2">
                            {state.brand.colors.map(c => (
                              <div key={c} className="w-10 h-10 rounded-full border border-white/20" style={{ backgroundColor: c }} title={c} />
                            ))}
                          </div>
                       </div>
                       <div>
                          <h4 className="text-xs font-mono text-gray-500 uppercase mb-3">Typography</h4>
                          <div className="space-y-1">
                             {state.brand.fonts.map(f => (
                               <p key={f} className="text-sm font-medium">{f}</p>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="p-6 bg-indigo-600/10 rounded-2xl border border-indigo-500/30">
                       <h4 className="font-bold mb-2 text-indigo-300">Brand Voice</h4>
                       <p className="text-sm text-gray-400 italic">"The voice of {state.brand.name} is confident, visionary, and customer-centric, focusing on {state.brand.mission.slice(0, 50)}..."</p>
                    </div>

                    <button 
                      onClick={() => setState(prev => ({ ...prev, step: 'live' }))}
                      className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xl rounded-2xl shadow-xl hover:shadow-indigo-500/20 transition-all transform hover:-translate-y-1"
                    >
                      Consult with your AI Strategist
                    </button>
                 </div>
              </div>
           </div>
        )}

        {state.step === 'live' && state.brand && (
          <div className="animate-in zoom-in duration-500">
             <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-2">Voice Consultation</h1>
                <p className="text-gray-400">Refine {state.brand.name}'s business model with your dedicated architect.</p>
             </div>
             <LiveConsultant brandName={state.brand.name} />
             
             <div className="mt-12 text-center">
                <button 
                  onClick={() => setState(prev => ({ ...prev, step: 'analyze' }))}
                  className="text-gray-500 hover:text-white transition"
                >
                  ← Return to Strategy Board
                </button>
             </div>
          </div>
        )}
      </main>

      {/* Floating Action Button for Contact/Sales */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="flex items-center gap-2 px-6 py-4 bg-white text-black rounded-full font-bold shadow-2xl hover:bg-gray-200 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Sell this Strategy
        </button>
      </div>
    </div>
  );
};

export default App;
