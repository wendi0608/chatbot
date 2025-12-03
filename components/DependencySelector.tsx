import React, { useState, useCallback } from 'react';
import { Sparkles, Plus, X, Loader2, Package } from 'lucide-react';
import { suggestDependencies } from '../services/geminiService';
import { DependencySuggestion } from '../types';

interface DependencySelectorProps {
    selectedDependencies: string[];
    onDependenciesChange: (deps: string[]) => void;
}

export const DependencySelector: React.FC<DependencySelectorProps> = ({ selectedDependencies, onDependenciesChange }) => {
    const [inputValue, setInputValue] = useState('');
    const [description, setDescription] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<DependencySuggestion[]>([]);

    const addDependency = (dep: string) => {
        if (dep && !selectedDependencies.includes(dep)) {
            onDependenciesChange([...selectedDependencies, dep]);
        }
        setInputValue('');
    };

    const removeDependency = (dep: string) => {
        onDependenciesChange(selectedDependencies.filter(d => d !== dep));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addDependency(inputValue.trim());
        }
    };

    const handleAiSuggest = useCallback(async () => {
        if (!description.trim()) return;
        
        setIsThinking(true);
        setAiSuggestions([]);
        
        const suggestions = await suggestDependencies(description);
        
        setAiSuggestions(suggestions);
        setIsThinking(false);
    }, [description]);

    return (
        <div className="space-y-4">
            {/* Manual Entry */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                    Add Packages Manually
                </label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Package className="absolute left-3 top-2.5 text-slate-500" size={16} />
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. pandas"
                            className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        onClick={() => addDependency(inputValue.trim())}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-3 rounded-md transition-colors"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            {/* AI Suggester */}
            <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-yellow-400" />
                    <h3 className="text-sm font-semibold text-indigo-200">AI Auto-Suggester</h3>
                </div>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your project (e.g., 'A web scraper for news sites')"
                        className="flex-1 bg-slate-900/50 border border-slate-700 rounded-md py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleAiSuggest()}
                    />
                    <button
                        onClick={handleAiSuggest}
                        disabled={isThinking || !description}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        {isThinking ? <Loader2 size={16} className="animate-spin" /> : 'Suggest'}
                    </button>
                </div>

                {/* Suggestions List */}
                {aiSuggestions.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {aiSuggestions.map((s, idx) => (
                            <button
                                key={idx}
                                onClick={() => addDependency(s.package)}
                                disabled={selectedDependencies.includes(s.package)}
                                className="text-left group flex items-start justify-between p-2 rounded bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 transition-all disabled:opacity-50"
                            >
                                <div>
                                    <div className="text-xs font-bold text-indigo-300">{s.package}</div>
                                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{s.reason}</div>
                                </div>
                                {!selectedDependencies.includes(s.package) && (
                                    <Plus size={14} className="text-slate-500 group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 min-h-[40px]">
                {selectedDependencies.length === 0 && (
                    <span className="text-sm text-slate-600 italic py-2">No packages selected. Standard library only.</span>
                )}
                {selectedDependencies.map((dep) => (
                    <span key={dep} className="inline-flex items-center gap-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200">
                        {dep}
                        <button
                            onClick={() => removeDependency(dep)}
                            className="hover:text-red-400 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};