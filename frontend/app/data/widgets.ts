export interface MarketWidget {
  label: string;
  change: string;
  value: string;
}

export interface NewsWidget {
  title: string;
  source: string;
}

export const marketWidgets: MarketWidget[] = [
  { label: 'S&P 500', change: '+0.69%', value: '4,012.61' },
  { label: 'DOW', change: '+0.07%', value: '33,141.28' },
  { label: 'NASDAQ', change: '+0.82%', value: '13,779.88' },
  { label: 'Russell 2000', change: '+0.82%', value: '1,862.32' },
];

export const newsWidgets: NewsWidget[] = [
  { title: '10 Secrets McDonald\'s Employees Aren\'t Supposed To Tell You', source: 'Delish • 7k 👍 • 190 💬' },
  { title: 'Can KPOP Idols Defeat Demons AND Fate?', source: 'The Film Theorists • 3w' },
  { title: 'Enjoy ad-free email and ransomware protection', source: 'Microsoft 365 • Sponsored' },
  { title: 'These jobs are most at risk of being replaced by AI', source: 'Newsweek • 17h' },
];
