import React, { useState, useMemo } from 'react';
import type { RoundData, ChartData, SuggestedOffers, SettlementSummary } from '../types';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import NegotiationHistory from './NegotiationHistory';
import MidpointChart from './MidpointChart';

const DollarIcon = () => <span className="text-slate-500">$</span>;

const NegotiatorApp: React.FC = () => {
  // Account Details
  const [totalBalance, setTotalBalance] = useState<number | ''>('');
  const [principalBalance, setPrincipalBalance] = useState<number | ''>('');

  // Current Round Inputs
  const [debtorLumpSum, setDebtorLumpSum] = useState<number | ''>('');
  const [debtorMonthly, setDebtorMonthly] = useState<number | ''>('');
  const [debtorMonths, setDebtorMonths] = useState<number | ''>('');
  const [ourLumpSum, setOurLumpSum] = useState<number | ''>('');
  const [ourMonthly, setOurMonthly] = useState<number | ''>('');
  const [ourMonths, setOurMonths] = useState<number | ''>('');

  // Settlement Inputs
  const [settledLumpSum, setSettledLumpSum] = useState<number | ''>('');
  const [settledMonthly, setSettledMonthly] = useState<number | ''>('');
  const [settledMonths, setSettledMonths] = useState<number | ''>('');
  const [loanNumber, setLoanNumber] = useState<string>('');
  const [settlementDate, setSettlementDate] = useState<string>('');

  // State Management
  const [currentMidpoint, setCurrentMidpoint] = useState<number | null>(null);
  const [suggestedOffers, setSuggestedOffers] = useState<SuggestedOffers | null>(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [history, setHistory] = useState<RoundData[]>([]);
  const [isSettled, setIsSettled] = useState(false);
  const [settlementSummary, setSettlementSummary] = useState<SettlementSummary | null>(null);

  const ourTotalOfferDisplay = useMemo(() => {
    const lump = Number(ourLumpSum) || 0;
    const monthly = Number(ourMonthly) || 0;
    const months = Number(ourMonths) || 0;
    return lump + (monthly * months);
  }, [ourLumpSum, ourMonthly, ourMonths]);

  const canCalculate = useMemo(() => {
    const isDebtorOfferValid = debtorLumpSum !== '' || (debtorMonthly !== '' && debtorMonths !== '');
    const isOurOfferValid = ourLumpSum !== '' || (ourMonthly !== '' && ourMonths !== '');
    return isDebtorOfferValid && isOurOfferValid;
  }, [debtorLumpSum, debtorMonthly, debtorMonths, ourLumpSum, ourMonthly, ourMonths]);

  const canSettle = useMemo(() => {
    return principalBalance !== '' && (settledLumpSum !== '' || (settledMonthly !== '' && settledMonths !== ''));
  }, [principalBalance, settledLumpSum, settledMonthly, settledMonths]);
  
  const showReset = useMemo(() => totalBalance !== '' || principalBalance !== '' || history.length > 0, [totalBalance, principalBalance, history]);

const handleNumberChange = (setter: React.Dispatch<React.SetStateAction<number | ''>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setter('');
      return;
    }
    
    const parsedValue = parseFloat(value);
    // Only update the state if the parsed value is not NaN.
    // This handles invalid inputs like "abc" and allows partial inputs like "12."
    // while preventing NaN from entering the state.
    if (!isNaN(parsedValue)) {
      // Note: parseFloat("12a") returns 12. This behavior sanitizes the input.
      setter(parsedValue);
    }
  };

  const handleTextChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };
  
  const handleCalculate = () => {
    if (!canCalculate) return;

    const numDebtorLumpSum = Number(debtorLumpSum);
    const numDebtorMonthly = Number(debtorMonthly);
    const numDebtorMonths = Number(debtorMonths);

    const numOurLumpSum = Number(ourLumpSum);
    const numOurMonthly = Number(ourMonthly);
    const numOurMonths = Number(ourMonths);

    const debtorTotalOffer = numDebtorLumpSum + (numDebtorMonthly * numDebtorMonths);
    const ourTotalOffer = numOurLumpSum + (numOurMonthly * numOurMonths);
    
    const midpoint = (debtorTotalOffer + ourTotalOffer) / 2;
    const range = { min: midpoint * 0.9, max: midpoint * 1.1 };

    setCurrentMidpoint(midpoint);

    const offerMonths = { combo: 18, monthly: 24 };
    const lowEnd = range.min;
    const highEnd = range.max;
    const comboTotal = midpoint * 1.02;

    const comboLumpSum = comboTotal * 0.25;
    const comboMonthly = (comboTotal - comboLumpSum) / offerMonths.combo;
    const monthlyPayment = highEnd / offerMonths.monthly;

    const newSuggestedOffers: SuggestedOffers = {
        lumpSum: { total: lowEnd, lumpSum: lowEnd },
        combo: { total: comboTotal, lumpSum: comboLumpSum, monthly: comboMonthly, months: offerMonths.combo },
        monthly: { total: highEnd, monthly: monthlyPayment, months: offerMonths.monthly }
    };
    setSuggestedOffers(newSuggestedOffers);

    const previousMidpoint = history.length > 0 ? history[history.length - 1].midpoint : null;
    const midpointChange = previousMidpoint !== null ? midpoint - previousMidpoint : null;

    let winner: 'Us' | 'Debtor' | 'Tie';
    if (midpointChange === null) {
      winner = 'Tie'; // First round
    } else if (midpointChange > 0) {
      winner = 'Us'; // Midpoint increased
    } else if (midpointChange < 0) {
      winner = 'Debtor'; // Midpoint decreased
    } else {
      winner = 'Tie'; // No change
    }

    const newRound: RoundData = {
      round: roundNumber,
      debtorLumpSum: numDebtorLumpSum,
      debtorMonthly: numDebtorMonthly,
      debtorMonths: numDebtorMonths,
      debtorTotalOffer: debtorTotalOffer,
      ourLumpSum: numOurLumpSum,
      ourMonthly: numOurMonthly,
      ourMonths: numOurMonths,
      ourTotalOffer: ourTotalOffer,
      midpoint: midpoint,
      winner,
      midpointChange,
    };

    setHistory(prev => [...prev, newRound]);
    setRoundNumber(prev => prev + 1);

    setDebtorLumpSum('');
    setDebtorMonthly('');
    setDebtorMonths('');
    setOurLumpSum('');
    setOurMonthly('');
    setOurMonths('');
  };

  const handleFinalizeSettlement = () => {
    if (!canSettle) return;
    const numSettledLumpSum = Number(settledLumpSum);
    const numSettledMonthly = Number(settledMonthly);
    const numSettledMonths = Number(settledMonths);
    const numPrincipal = Number(principalBalance);
    const numTotalBalance = Number(totalBalance);

    const totalRecovered = numSettledLumpSum + (numSettledMonthly * numSettledMonths);
    const recoveryPercentage = numPrincipal > 0 ? (totalRecovered / numPrincipal) * 100 : 0;
    const discountFromTotal = numTotalBalance > 0 ? numTotalBalance - totalRecovered : 0;
    
    const summary: SettlementSummary = {
        winCount: history.filter(h => h.winner === 'Us').length,
        lossCount: history.filter(h => h.winner === 'Debtor').length,
        tieCount: history.filter(h => h.winner === 'Tie').length,
        totalRecovered,
        recoveryPercentage,
        discountFromTotal,
        finalLumpSum: numSettledLumpSum,
        finalMonthly: numSettledMonthly,
        finalMonths: numSettledMonths,
        loanNumber: loanNumber,
        settlementDate: settlementDate,
    };
    
    setSettlementSummary(summary);
    setIsSettled(true);
  };
  
  const chartData: ChartData[] = useMemo(() => {
      return history.map(h => ({
          name: `Round ${h.round}`,
          debtorTotalOffer: h.debtorTotalOffer,
          ourOffer: h.ourTotalOffer,
          midpoint: h.midpoint,
      }));
  }, [history]);

  const recoveryScore = useMemo(() => {
    if (!settlementSummary) return 0;
    
    const percentage = settlementSummary.recoveryPercentage;

    let score: number;

    if (percentage >= 100) {
      score = 100;
    } else if (percentage >= 66) {
      const recoveryRange = 100 - 66; 
      const scoreRange = 100 - 90; 
      score = 90 + ((percentage - 66) / recoveryRange) * scoreRange;
    } else if (percentage >= 33) {
      const recoveryRange = 66 - 33;
      const scoreRange = 90 - 50;
      score = 50 + ((percentage - 33) / recoveryRange) * scoreRange;
    } else if (percentage >= 0) {
      const recoveryRange = 33 - 0;
      const scoreRange = 50 - 0;
      score = (percentage / recoveryRange) * scoreRange;
    } else {
        score = 0;
    }

    return Math.round(score);
  }, [settlementSummary]);

  const handleReset = () => {
    setTotalBalance('');
    setPrincipalBalance('');
    setDebtorLumpSum('');
    setDebtorMonthly('');
    setDebtorMonths('');
    setOurLumpSum('');
    setOurMonthly('');
    setOurMonths('');
    setSettledLumpSum('');
    setSettledMonthly('');
    setSettledMonths('');
    setLoanNumber('');
    setSettlementDate('');
    setCurrentMidpoint(null);
    setSuggestedOffers(null);
    setRoundNumber(1);
    setHistory([]);
    setIsSettled(false);
    setSettlementSummary(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="relative text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-cyan-400 sm:text-5xl drop-shadow-[0_0_10px_rgba(0,255,255,0.4)]">
            DrewBot Negotiation Domination Machine
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Analyze offers, find the midpoint, and dominate negotiations.
          </p>
          {showReset && (
            <div className="absolute top-0 right-0">
                <Button 
                    onClick={handleReset} 
                    className="bg-red-600/80 hover:bg-red-500 shadow-red-500/30 hover:shadow-red-500/40 focus-visible:outline-red-500"
                >
                    Reset Negotiations
                </Button>
            </div>
          )}
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-8">
            <Card title="Account Details">
                <div className="space-y-4">
                    <Input label="Total Balance" id="totalBalance" value={totalBalance} onChange={handleNumberChange(setTotalBalance)} placeholder="e.g., 10000" icon={<DollarIcon />} disabled={history.length > 0 || isSettled} />
                    <Input label="Principal Balance" id="principalBalance" value={principalBalance} onChange={handleNumberChange(setPrincipalBalance)} placeholder="e.g., 8000" icon={<DollarIcon />} disabled={history.length > 0 || isSettled} />
                </div>
            </Card>

            {!isSettled && (
              <Card title={`Negotiation Round ${roundNumber}`}>
                  <div className="space-y-6">
                      <div>
                          <h4 className="font-semibold text-white mb-3">Debtor's Offer Structure</h4>
                          <div className="space-y-4">
                            <Input label="Lump Sum" id="debtorLumpSum" value={debtorLumpSum} onChange={handleNumberChange(setDebtorLumpSum)} placeholder="e.g., 1000" icon={<DollarIcon />} />
                            <Input label="Monthly Payments" id="debtorMonthly" value={debtorMonthly} onChange={handleNumberChange(setDebtorMonthly)} placeholder="e.g., 100" icon={<DollarIcon />} />
                            <Input label="Number of Months" id="debtorMonths" value={debtorMonths} onChange={handleNumberChange(setDebtorMonths)} placeholder="e.g., 12" />
                          </div>
                      </div>
                      <div className="border-t border-cyan-500/30 pt-6">
                          <h4 className="font-semibold text-white mb-3">Our Offer Structure</h4>
                          <div className="space-y-4">
                              <Input label="Lump Sum" id="ourLumpSum" value={ourLumpSum} onChange={handleNumberChange(setOurLumpSum)} placeholder="e.g., 1000" icon={<DollarIcon />} />
                              <Input label="Monthly Payments" id="ourMonthly" value={ourMonthly} onChange={handleNumberChange(setOurMonthly)} placeholder="e.g., 200" icon={<DollarIcon />} />
                              <Input label="Number of Months" id="ourMonths" value={ourMonths} onChange={handleNumberChange(setOurMonths)} placeholder="e.g., 12" />
                          </div>
                          <div className="mt-4 flex justify-between items-center bg-slate-950/70 p-3 rounded-lg border border-cyan-500/20">
                            <span className="text-sm font-medium text-slate-400">Calculated Total Offer:</span>
                            <span className="text-lg font-bold text-cyan-400">${ourTotalOfferDisplay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                      </div>
                      <Button onClick={handleCalculate} disabled={!canCalculate} className="w-full">
                          Calculate & Record Round
                      </Button>
                  </div>
              </Card>
            )}
            
            {currentMidpoint !== null && suggestedOffers && !isSettled && (
                 <Card title="Suggested Counter-Offers">
                    <div className="space-y-4">
                       <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border-l-4 border-cyan-500">
                            <span className="text-slate-400">Negotiation Midpoint:</span>
                            <span className="text-2xl font-bold text-cyan-400">${currentMidpoint.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-lime-400">1. Aggressive Lump Sum</p>
                            <p className="text-2xl font-bold text-white mt-1">${suggestedOffers.lumpSum.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            <p className="text-xs text-slate-400 mt-1">Single payment for quick settlement.</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-lime-400">2. Balanced Combo Offer</p>
                            <p className="text-2xl font-bold text-white mt-1">${suggestedOffers.combo.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            <p className="text-xs text-slate-400 mt-1">${suggestedOffers.combo.lumpSum?.toLocaleString(undefined, { maximumFractionDigits: 0 })} down + ${suggestedOffers.combo.monthly?.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo for {suggestedOffers.combo.months} months.</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-lime-400">3. Strategic Monthly Offer</p>
                            <p className="text-2xl font-bold text-white mt-1">${suggestedOffers.monthly.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                             <p className="text-xs text-slate-400 mt-1">${suggestedOffers.monthly.monthly?.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo for {suggestedOffers.monthly.months} months.</p>
                        </div>
                    </div>
                 </Card>
            )}
          </div>
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Card title="Negotiation Progress">
                <MidpointChart data={chartData} />
            </Card>
            <NegotiationHistory history={history} />

            {history.length > 0 && !isSettled && (
              <Card title="Settled Negotiation Terms">
                  <div className="space-y-6">
                      <p className="text-sm text-slate-400">Enter the final agreed upon terms to calculate the recovery summary.</p>
                      <div className="space-y-4">
                          <Input label="Loan Number" id="loanNumber" type="text" value={loanNumber} onChange={handleTextChange(setLoanNumber)} placeholder="e.g., 12345-ABC" />
                          <Input label="Settlement Date" id="settlementDate" type="date" value={settlementDate} onChange={handleTextChange(setSettlementDate)} />
                          <div className="border-t border-cyan-500/30 pt-4 space-y-4">
                            <Input label="Final Lump Sum" id="settledLumpSum" value={settledLumpSum} onChange={handleNumberChange(setSettledLumpSum)} icon={<DollarIcon />} />
                            <Input label="Final Monthly Payment" id="settledMonthly" value={settledMonthly} onChange={handleNumberChange(setSettledMonthly)} icon={<DollarIcon />} />
                            <Input label="Final Number of Months" id="settledMonths" value={settledMonths} onChange={handleNumberChange(setSettledMonths)} />
                          </div>
                      </div>
                      <Button onClick={handleFinalizeSettlement} disabled={!canSettle} className="w-full">
                          Finalize Settlement
                      </Button>
                  </div>
              </Card>
            )}

            {isSettled && settlementSummary && (
                <Card title="Settlement Summary: Mission Complete" className="border-lime-500/50 shadow-lime-500/20">
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4 text-left border-b border-cyan-500/20 pb-4">
                            <div>
                                <p className="text-sm text-slate-400">Loan Number</p>
                                <p className="text-lg font-semibold text-white">{settlementSummary.loanNumber || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Settlement Date</p>
                                <p className="text-lg font-semibold text-white">{settlementSummary.settlementDate || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="text-center pt-2">
                            <p className="text-lg text-lime-400 font-bold tracking-widest">PRINCIPAL RECOVERY</p>
                            <p className="text-6xl font-bold text-white my-2 drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">{settlementSummary.recoveryPercentage.toFixed(2)}%</p>
                            <div className="w-full bg-slate-700 rounded-full h-2.5">
                                <div className="bg-lime-500 h-2.5 rounded-full" style={{ width: `${recoveryScore}%` }}></div>
                            </div>
                            <p className="text-sm text-slate-400 mt-2">Overall Score: {recoveryScore}/100</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center border-t border-cyan-500/20 py-4">
                            <div>
                                <p className="text-sm text-slate-400">Total Recovered</p>
                                <p className="text-xl font-semibold text-white">${settlementSummary.totalRecovered.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                             <div>
                                <p className="text-sm text-slate-400">Total Discount</p>
                                <p className="text-xl font-semibold text-white">${settlementSummary.discountFromTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                         <div className="text-center">
                            <p className="text-sm text-slate-400">Round Record (W-L-T)</p>
                            <p className="text-xl font-semibold text-white">
                                <span className="text-lime-400">{settlementSummary.winCount}</span> - 
                                <span className="text-red-500">{settlementSummary.lossCount}</span> - 
                                <span className="text-slate-400">{settlementSummary.tieCount}</span>
                            </p>
                        </div>
                    </div>
                </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NegotiatorApp;
