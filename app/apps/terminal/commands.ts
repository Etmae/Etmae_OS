export const TERMINAL_CONFIG = {
    user: "guest",
    host: "portfolio-os",
    path: "C:\\Users\\Guest",
  };
  
  export const COMMANDS: Record<string, string> = {
    'help': `
  AVAILABLE COMMANDS:
    ls skillset    - List technical proficiencies
    whereis live   - Current location and availability
    whoami         - Professional bio
    contact        - Social and email links
    neofetch       - Display system information
    clear          - Clear the terminal screen
    exit           - Close the terminal
    `,
    'ls skillset': `
  [Frontend]      React, TypeScript, Next.js, Tailwind
  [Backend]       Node.js, PostgreSQL, Docker, GraphQL
  [Mobile]        React Native
  [Tools]         Git, AWS, Vitest, CI/CD
    `,
    'whereis live': `
  LOCATION:       New York, NY (Remote-First)
  RELOCATION:     Available for specific opportunities.
    `,
    'whoami': `
  I am a Full-Stack Engineer dedicated to building high-fidelity 
  user interfaces and robust system architectures. I specialize 
  in turning complex requirements into elegant, maintainable code.
    `,
    'contact': `
  GitHub:         github.com/yourhandle
  LinkedIn:       linkedin.com/in/yourhandle
  Email:          dev@example.com
    `,
    'neofetch': `
     .-.      OS: Portfolio Windows 11 Pro
    oo|       Host: Gemini-Flash-Runtime
    /` + "`" + `      Kernel: React 18.2.0
   (\_;/)     Uptime: 15 mins
              Packages: 42 (npm)
              Shell: cmd.exe
              Resolution: 1920x1080
              UI: Tailwind CSS
    `
  }; 