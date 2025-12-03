import React, { useMemo } from 'react';
import { EnvConfig, OSType, ShellType } from '../types';
import { Copy, Download, Terminal } from 'lucide-react';

interface TerminalOutputProps {
    config: EnvConfig;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ config }) => {
    
    const scriptContent = useMemo(() => {
        const isWin = config.os === OSType.WINDOWS;
        const deps = config.dependencies.join(' ');
        
        // Windows (Batch/Powershell hybrid safe approach or standard CMD)
        if (isWin) {
            const lines = [
                `@echo off`,
                `echo Creating virtual environment '${config.envName}'...`,
                `${config.pythonCommand} -m venv ${config.envName}`,
                `echo Activating environment...`,
                `call .\\${config.envName}\\Scripts\\activate`,
                `echo Upgrading pip...`,
                `python -m pip install --upgrade pip`
            ];

            if (deps) {
                lines.push(`echo Installing dependencies: ${deps}...`);
                lines.push(`pip install ${deps}`);
            }

            if (config.includeRequirementsTxt) {
                lines.push(`echo Generating requirements.txt...`);
                lines.push(`pip freeze > requirements.txt`);
            }

            lines.push(`echo Done! To activate later, run: .\\${config.envName}\\Scripts\\activate`);
            if (config.autoActivate) {
                lines.push(`cmd /k`); // Keep window open and env activated
            }
            return lines.join('\n');
        } 
        // Unix (Bash/Zsh)
        else {
            const lines = [
                `#!/bin/bash`,
                `echo "Creating virtual environment '${config.envName}'..."`,
                `${config.pythonCommand} -m venv ${config.envName}`,
                `echo "Activating environment..."`,
                `source ./${config.envName}/bin/activate`,
                `echo "Upgrading pip..."`,
                `pip install --upgrade pip`
            ];

            if (deps) {
                lines.push(`echo "Installing dependencies: ${deps}..."`);
                lines.push(`pip install ${deps}`);
            }

            if (config.includeRequirementsTxt) {
                lines.push(`echo "Generating requirements.txt..."`);
                lines.push(`pip freeze > requirements.txt`);
            }

            lines.push(`echo "Setup complete! To activate run: source ./${config.envName}/bin/activate"`);
            return lines.join('\n');
        }
    }, [config]);

    const handleCopy = () => {
        navigator.clipboard.writeText(scriptContent);
    };

    const handleDownload = () => {
        const isWin = config.os === OSType.WINDOWS;
        const filename = isWin ? 'setup_env.bat' : 'setup_env.sh';
        const blob = new Blob([scriptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-xl overflow-hidden flex flex-col h-full">
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <Terminal size={18} className="text-indigo-400" />
                    <span className="text-sm font-medium text-slate-300">
                        Generated Script Preview ({config.os === OSType.WINDOWS ? 'Batch' : 'Bash'})
                    </span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors"
                        title="Copy to Clipboard"
                    >
                        <Copy size={16} />
                    </button>
                    <button 
                        onClick={handleDownload}
                        className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors"
                        title="Download Script"
                    >
                        <Download size={16} />
                    </button>
                </div>
            </div>
            <div className="p-4 font-mono text-sm overflow-auto text-emerald-400 flex-1 whitespace-pre">
                {scriptContent}
            </div>
        </div>
    );
};