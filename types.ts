export enum OSType {
    WINDOWS = 'WINDOWS',
    UNIX = 'UNIX' // Mac or Linux
}

export enum ShellType {
    BASH = 'BASH',
    CMD = 'CMD',
    POWERSHELL = 'POWERSHELL'
}

export interface EnvConfig {
    projectName: string;
    envName: string;
    pythonCommand: string;
    os: OSType;
    dependencies: string[];
    includeRequirementsTxt: boolean;
    autoActivate: boolean;
}

export interface DependencySuggestion {
    package: string;
    reason: string;
}