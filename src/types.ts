export interface RoundData {
  round: number;
  debtorLumpSum: number;
  debtorMonthly: number;
  debtorMonths: number;
  debtorTotalOffer: number;
  ourLumpSum: number;
  ourMonthly: number;
  ourMonths: number;
  ourTotalOffer: number;
  midpoint: number;
  winner: 'Us' | 'Debtor' | 'Tie';
  midpointChange: number | null;
}

export interface ChartData {
  name: string;
  debtorTotalOffer: number;
  ourOffer: number;
  midpoint: number;
}

export interface SuggestedOffer {
  lumpSum?: number;
  monthly?: number;
  months?: number;
  total: number;
}

export interface SuggestedOffers {
  lumpSum: SuggestedOffer;
  combo: SuggestedOffer;
  monthly: SuggestedOffer;
}

export interface SettlementSummary {
  winCount: number;
  lossCount: number;
  tieCount: number;
  totalRecovered: number;
  recoveryPercentage: number;
  discountFromTotal: number;
  finalLumpSum: number;
  finalMonthly: number;
  finalMonths: number;
  loanNumber: string;
  settlementDate: string;
}