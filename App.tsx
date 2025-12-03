import React, { useState } from 'react';
import { EnvConfig, OSType } from './types';
import { TerminalOutput } from './components/TerminalOutput';
import { DependencySelector } from './components/DependencySelector';
import { FolderOpen, Settings, Play, Info } from 'lucide-react';

const App: React.FC = () => {
    const [config, setConfig] = useState<EnvConfig>({
        projectName: 'my-project',
        envName: '.venv',
        pythonCommand: 'python',
        os: OSType.WINDOWS,
        dependencies: [],
        includeRequirementsTxt: true,
        autoActivate: true,
    });

    const updateConfig = (key: keyof EnvConfig, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
            
            {/* Sidebar / Configuration Panel */}
            <div className="w-full md:w-[450px] bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-slate-700">
                
                <header>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="bg-indigo-500 p-2 rounded-lg">
                            <Settings className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                            PyEnv Generator
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm">
                        Configure, visualize, and generate your Python virtual environment script instantly.
                    </p>
                </header>

                {/* OS & Environment Settings */}
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Environment</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div 
                            onClick={() => updateConfig('os', OSType.WINDOWS)}
                            className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${config.os === OSType.WINDOWS ? 'bg-indigo-900/20 border-indigo-500 text-indigo-300' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
                        >
                            <span className="block font-medium">Windows</span>
                        </div>
                        <div 
                            onClick={() => updateConfig('os', OSType.UNIX)}
                            className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${config.os === OSType.UNIX ? 'bg-indigo-900/20 border-indigo-500 text-indigo-300' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
                        >
                            <span className="block font-medium">Mac / Linux</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Python Command</label>
                            <select 
                                value={config.pythonCommand}
                                onChange={(e) => updateConfig('pythonCommand', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-indigo-500"
                            >
                                <option value="python">python</option>
                                <option value="python3">python3</option>
                                <option value="py">py (Launcher)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Venv Name</label>
                            <input 
                                type="text" 
                                value={config.envName}
                                onChange={(e) => updateConfig('envName', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                         <label className="flex items-center gap-2 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={config.includeRequirementsTxt}
                                onChange={(e) => updateConfig('includeRequirementsTxt', e.target.checked)}
                                className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Generate requirements.txt</span>
                        </label>
                         <label className="flex items-center gap-2 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={config.autoActivate}
                                onChange={(e) => updateConfig('autoActivate', e.target.checked)}
                                className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Keep terminal open (Windows only)</span>
                        </label>
                    </div>
                </section>

                <hr className="border-slate-800" />

                {/* Dependencies Section */}
                <section className="space-y-4">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Dependencies</h2>
                    <DependencySelector 
                        selectedDependencies={config.dependencies}
                        onDependenciesChange={(deps) => updateConfig('dependencies', deps)}
                    />
                </section>
            </div>

            {/* Main Content / Preview */}
            <div className="flex-1 p-6 md:p-10 flex flex-col bg-gradient-to-br from-slate-950 to-slate-900">
                <div className="max-w-4xl w-full mx-auto flex flex-col h-full gap-6">
                    
                    {/* Header info */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Your Configuration</h2>
                            <p className="text-slate-400 text-sm mt-1">
                                {config.dependencies.length > 0 
                                    ? `Installing ${config.dependencies.length} packages into '${config.envName}'`
                                    : `Clean environment '${config.envName}'`
                                }
                            </p>
                        </div>
                        <div className="flex gap-2">
                             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-medium border border-indigo-500/20">
                                {config.os === OSType.WINDOWS ? 'Windows' : 'Unix'}
                             </div>
                             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/20">
                                {config.pythonCommand}
                             </div>
                        </div>
                    </div>

                    {/* Terminal Preview */}
                    <div className="flex-1 min-h-[400px]">
                        <TerminalOutput config={config} />
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 flex gap-3">
                        <Info className="text-blue-400 shrink-0 mt-0.5" size={20} />
                        <div className="text-sm text-slate-300 space-y-2">
                            <p>
                                <strong>How to use:</strong>
                            </p>
                            <ol className="list-decimal list-inside space-y-1 text-slate-400 ml-1">
                                <li>Download the script or copy the commands.</li>
                                <li>Place the script in your desired project folder.</li>
                                <li>Run the script from your terminal.</li>
                            </ol>
                            <p className="text-xs text-slate-500 mt-2">
                                Note: Web browsers cannot directly create folders on your disk for security reasons. This tool generates the precise script to automate it for you.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default App;