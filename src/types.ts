export type Prono = {
  sport: string;          // ex: "⚽ Ligue 1"
  date: string;           // ex: "Ce soir 21h"
  equipeDomicile: string;
  equipeExterieur: string;
  pari: string;           // ex: "PSG gagne + plus de 2,5 buts"
  cote: number;           // ex: 1.85
  confiance: number;      // 1 à 5
  arguments: string[];    // 3 arguments max, courts
  accroche: string;       // le hook des 2 premières secondes
};
