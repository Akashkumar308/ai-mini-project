
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User as UserIcon, 
  Loader2, 
  AlertTriangle,
  TrendingUp,
  Calculator,
  RefreshCw
} from 'lucide-react';
import { getAiAnalysis, AiAnalysisResult } from '../services/geminiService';
import { Bill, Product, StockLog, User } from '../types';

interface AiAssistantProps {
  products: Product[];
  bills: Bill[];
  stockHistory: StockLog[];
  user: User;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ products, bills, stockHistory, user }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const triggerAnalysis = async (userQuestion: string = "") => {
    setIsLoading(true);
    try {
      const currentBillContext = bills.length > 0 ? bills[0] : {};
      const result = await getAiAnalysis(userQuestion, currentBillContext, products, bills, stockHistory, user);
      setAnalysis(result);
      if (userQuestion) {
        setChatHistory(prev => [...prev, { role: 'bot', text: result.chatbotResponse }]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setChatHistory(prev => [...prev, { role: 'user', text: query }]);
    const currentQuery = query;
    setQuery('');
    triggerAnalysis(currentQuery);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-160px)] animate-fadeIn">
      <div className="lg:col-span-2 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
        <header className="sticky top-0 bg-white z-10 pb-4 flex justify-between items-center border-b border-slate-100">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-600" />
              AI Insights for {user.companyName}
            </h2>
            <p className="text-slate-500">Intelligent business analysis and company auditing</p>
          </div>
          <button 
            onClick={() => triggerAnalysis()}
            disabled={isLoading}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw className={`w-5 h-5 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </header>

        {!analysis && !isLoading && (
          <div className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl border border-dashed border-slate-200 text-center p-8">
            <div className="bg-indigo-50 p-6 rounded-3xl mb-4">
              <Sparkles className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Audit Business Performance</h3>
            <p className="text-slate-500 max-w-sm mb-6">Analyze your stock, sales trends, and tax compliance for {user.companyName} in {user.companyLocation}.</p>
            <button 
              onClick={() => triggerAnalysis()}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
            >
              Run Full Analysis
            </button>
          </div>
        )}

        {isLoading && !analysis && (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Running smart diagnostics...</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-6 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center gap-3 text-indigo-600">
                  <Calculator className="w-5 h-5" />
                  <h4 className="font-bold">Billing & Tax Compliance</h4>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs font-black text-slate-400 uppercase mb-2">Validation Report</p>
                    <p className="text-sm text-slate-700 leading-relaxed font-bold">{analysis.billingValidation}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <p className="text-xs font-black text-emerald-600 uppercase mb-2">Tax Guidance</p>
                    <p className="text-sm text-emerald-800 leading-relaxed font-bold">{analysis.gstGuidance}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center gap-3 text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                  <h4 className="font-bold">Stock & Restocking</h4>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-red-50 rounded-xl">
                    <p className="text-xs font-black text-red-600 uppercase mb-2">Inventory Alerts</p>
                    <p className="text-sm text-red-800 leading-relaxed font-bold">{analysis.lowStockAlerts}</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl">
                    <p className="text-xs font-black text-amber-600 uppercase mb-2">Restocking Suggestion</p>
                    <p className="text-sm text-amber-800 leading-relaxed font-bold">{analysis.restockingRecommendations}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-2 space-y-4">
                <div className="flex items-center gap-3 text-violet-600">
                  <TrendingUp className="w-5 h-5" />
                  <h4 className="font-bold">Sales Analysis & Revenue Forecast</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
                    <p className="text-xs font-black text-violet-600 uppercase mb-2">Historical Insights</p>
                    <p className="text-sm text-violet-900 leading-relaxed font-bold">{analysis.salesAnalysis}</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <p className="text-xs font-black text-indigo-600 uppercase mb-2">Future Predictions</p>
                    <p className="text-sm text-indigo-900 leading-relaxed font-bold">{analysis.salesPrediction}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 flex flex-col overflow-hidden h-full">
        <div className="p-6 border-b border-slate-100 bg-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">Smart Assistant</h3>
              <p className="text-xs text-indigo-100">Help for {user.companyName}</p>
            </div>
          </div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-sm shadow-emerald-400" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 custom-scrollbar">
          {chatHistory.length === 0 && (
            <div className="text-center py-10">
              <p className="text-slate-400 text-sm font-bold">Ask about logins, stock deletion, or invoice history.</p>
            </div>
          )}
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white border border-slate-200 text-slate-600'
                }`}>
                  {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed font-bold ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] flex gap-3 flex-row items-center">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex gap-1.5 p-4 rounded-2xl bg-white border border-slate-200 rounded-tl-none">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything..."
              className="w-full pl-4 pr-12 py-3 bg-white border-2 border-slate-100 rounded-2xl text-sm text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
            <button 
              type="submit"
              disabled={!query.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-indigo-100"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AiAssistant;
