// frontend/components/terminal/commands.ts

export type LineType = 'input' | 'output' | 'error' | 'system' | 'loading' | 'ai' | 'success';

export interface TerminalLine {
  id: string;
  type: LineType;
  content: string;
  isAnimated?: boolean;
}

export const TERMINAL_CONFIG = {
  user: 'etmae',
  host: 'portfolio-os',
  path: 'C:\\Users\\Etmae',
  version: 'Etmae OS Terminal [Version 10.0.22621.2428]',
};

export const generateId = () => Math.random().toString(36).substring(2, 11);

// ─────────────────────────────────────────────────────────────
// Command parser: processes user input including flags (-v, --verbose),
// quoted arguments, and subcommand routing.
// ─────────────────────────────────────────────────────────────
export interface ParsedCommand {
  cmd: string;
  args: string[];
  flags: Set<string>;   // e.g. -v, --verbose
  raw: string;
}

export function parseInput(raw: string): ParsedCommand {
  const tokens: string[] = [];
  let current = '';
  let inQuote = false;
  let quoteChar = '';

  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if ((c === '"' || c === "'") && !inQuote) {
      inQuote = true; quoteChar = c;
    } else if (c === quoteChar && inQuote) {
      inQuote = false; tokens.push(current); current = '';
    } else if (c === ' ' && !inQuote) {
      if (current) { tokens.push(current); current = ''; }
    } else {
      current += c;
    }
  }
  if (current) tokens.push(current);

  const cmd = (tokens[0] ?? '').toLowerCase();
  const args: string[] = [];
  const flags = new Set<string>();

  for (let i = 1; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.startsWith('--')) flags.add(t.slice(2));
    else if (t.startsWith('-') && t.length > 1 && !/^\d/.test(t.slice(1))) {
      // Split short flags: -abc → a, b, c
      for (const ch of t.slice(1)) flags.add(ch);
    } else {
      args.push(t);
    }
  }

  return { cmd, args, flags, raw };
}

// ─────────────────────────────────────────────────────────────
// LINE FACTORY
// ─────────────────────────────────────────────────────────────
const out = (content: string, animated = true): TerminalLine => ({
  id: generateId(), type: 'output', content, isAnimated: animated,
});

const err = (content: string): TerminalLine => ({
  id: generateId(), type: 'error', content, isAnimated: false,
});

const sys = (content: string): TerminalLine => ({
  id: generateId(), type: 'system', content, isAnimated: false,
});

const ok = (content: string): TerminalLine => ({
  id: generateId(), type: 'success', content, isAnimated: false,
});

const textToLines = (text: string, type: LineType = 'output', animated = true): TerminalLine[] =>
  text.trim().split('\n').map(line => ({ id: generateId(), type, content: line, isAnimated: animated }));

// ─────────────────────────────────────────────────────────────
// COMMAND REGISTRY
// ─────────────────────────────────────────────────────────────
type CommandHandler = (parsed: ParsedCommand) => Promise<TerminalLine[]>;

export const COMMANDS: Record<string, CommandHandler> = {

  help: async ({ flags }) => {
    const verbose = flags.has('v') || flags.has('verbose');
    const lines = [
      out(''),
      out('AVAILABLE COMMANDS:', false),
      out(''),
      out('  ls [target]        List information'),
      out('  whereis live       Show location data'),
      out('  whoami             Professional bio'),
      out('  contact            Social and email links'),
      out('  neofetch           System information'),
      out('  history            Show command history'),
      out('  clear              Clear screen'),
      out('  -ai <query>        Route to Etmae Intelligence'),
      out('  exit               Close terminal'),
      out(''),
    ];
    if (verbose) {
      lines.push(
        out('TIPS:', false),
        out('  Use quotes for multi-word args: ls "my stuff"'),
        out('  Use flags: help --verbose, ls -a'),
        out('  Ctrl+C to interrupt any running command'),
        out('  TAB for autocomplete, ↑↓ for history'),
        out(''),
      );
    }
    return lines;
  },

  ls: async ({ args, flags }) => {
    const target = args[0]?.toLowerCase();
    const all = flags.has('a');

    if (!target || target === 'skillset') {
      return [
        out(''),
        out('TECHNICAL PROFICIENCIES', false),
        out(''),
        out('  [Frontend]      React · TypeScript · Next.js · Tailwind · Framer Motion'),
        out('  [Backend]       SQL · PostgreSQL · RESTful APIs  · Django · Nextjs · Python'),
        out('  [Architecture]  System Normalization · Requirement Discovery'),
        ...(all ? [
          out(''),
          out('  [Exploring]      ML · SPRINGBOOT · FLUTTER'),
        ] : []),
        out(''),
      ];
    }

    if (target === 'projects') {
      return textToLines(`
projects/
  ├── etmae-portfolio/    (this site)
  ├── Looms & Aura/    system architecture
  └── Agrotech/      component library
`);
    }

    return [err(`ls: cannot access '${target}': No such file or directory`)];
  },

  whereis: async ({ args }) => {
    const target = args[0]?.toLowerCase();
    if (!target || target === 'live') {
      return textToLines(`
LOCATION:      Ibadan, Nigeria (UTC+1)
AVAILABILITY:  Open to remote · Relocation-ready
TIMEZONE:      WAT — West Africa Time
`);
    }
    return [err(`whereis: '${target}' not found in PATH`)];
  },

  whoami: async () => textToLines(`
Erioluwa Elijah Olujimi
Full-Stack Engineer

building robust, scalable management architectures
with a focus on clean data models and exceptional interfaces.
`),

  contact: async () => [
    out(''),
    out('  GitHub    →  https://github.com/Etmae', false),
    out('  LinkedIn  →  linkedin.com/in/etmae', false),
    out('  Email     →  elijaholujimi060@gmail.com', false),
    out(''),
  ],

  neofetch: async () => {

    return [
      sys(''),
      sys('          .-.       OS: Etmae Portfolio OS'),
      sys('         oo|        Host: Vercel Edge Runtime'),
      sys("        /`\\        Kernel: React 18.2 (stable)"),
      sys('       (\\_;/)      Shell: Etmae-CMD v3.0'),
      sys('                   UI: Tailwind + Framer Motion'),
      sys('                   Uptime: ∞'),
      sys('                   Theme: Dark (forced) | light'),
      sys(''),
    ];
  },

  echo: async ({ args, raw }) => {
    const text = args.join(' ') || raw.slice(4).trim();
    return [out(text)];
  },

  date: async () => {
    return [out(new Date().toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit',
    }))];
  },

  pwd: async () => [out('C:\\Users\\Etmae')],

  uname: async ({ flags }) => {
    if (flags.has('a')) return [out('Etmae-OS portfolio-os 10.0.22621 x86_64 React/TypeScript')];
    return [out('Etmae-OS')];
  },
};

// ─────────────────────────────────────────────────────────────
// RESOLVER
// ─────────────────────────────────────────────────────────────
export const resolveCommand = async (rawInput: string): Promise<TerminalLine[]> => {
  const parsed = parseInput(rawInput);

  if (COMMANDS[parsed.cmd]) {
    return await COMMANDS[parsed.cmd](parsed);
  }

  // Personality: typo suggestions
  const close = Object.keys(COMMANDS).find(c =>
    Math.abs(c.length - parsed.cmd.length) <= 2 &&
    [...parsed.cmd].filter((ch, i) => c[i] === ch).length >= parsed.cmd.length - 2
  );

  return [
    err(`'${parsed.cmd}' is not recognized as an internal or external command.`),
    ...(close ? [sys(`Did you mean: ${close}?`)] : []),
    sys('Type "help" for a list of commands.'),
  ];
};