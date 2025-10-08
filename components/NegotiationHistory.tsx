import React from 'react';
import type { RoundData } from '../types';
import Card from './Card';

interface NegotiationHistoryProps {
  history: RoundData[];
}

const ArrowUpGreenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-lime-400">
        <path fillRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L6.22 8.78a.75.75 0 1 1-1.06-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10.75 5.612V16.25A.75.75 0 0 1 10 17Z" clipRule="evenodd" />
    </svg>
);

const ArrowDownRedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-500">
        <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.03-3.03a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 11.78a.75.75 0 1 1 1.06-1.06l3.03 3.03V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
    </svg>
);

const NegotiationHistory: React.FC<NegotiationHistoryProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <Card title="Negotiation History">
        <p className="text-slate-500 text-center py-4">No rounds completed yet.</p>
      </Card>
    );
  }

  return (
    <Card title="Negotiation History" className="overflow-hidden">
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {history.slice().reverse().map((round, roundIdx) => (
            <li key={round.round}>
              <div className="relative pb-8">
                {roundIdx !== history.length - 1 ? (
                  <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-cyan-700/50" aria-hidden="true" />
                ) : null}
                <div className="relative flex items-start space-x-4">
                  <div>
                    <span className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center ring-8 ring-slate-900">
                      <span className="font-bold text-cyan-400">{round.round}</span>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm leading-6">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-white">Round {round.round}</p>
                            <span
                                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                round.winner === 'Us'
                                    ? 'bg-lime-500/10 text-lime-400 ring-lime-500/20'
                                    : round.winner === 'Debtor'
                                    ? 'bg-fuchsia-500/10 text-fuchsia-400 ring-fuchsia-500/20'
                                    : 'bg-slate-400/10 text-slate-300 ring-slate-400/20'
                                }`}
                            >
                                Round Winner: {round.winner}
                            </span>
                        </div>
                        <p className="mt-1 text-slate-400">Midpoint: <span className="font-medium text-cyan-400">${round.midpoint.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                    </div>
                    <div className="mt-2 text-sm text-slate-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <p>Debtor Offer: <span className="text-slate-200">${round.debtorTotalOffer.toLocaleString()}</span></p>
                            <p>Our Offer: <span className="text-slate-200">${round.ourTotalOffer.toLocaleString()}</span></p>
                            {round.midpointChange !== null && (
                                <p className="flex items-center gap-1">
                                    Change: 
                                    <span className={`font-semibold ${round.midpointChange > 0 ? 'text-lime-400' : 'text-red-500'}`}>
                                        ${Math.abs(round.midpointChange).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                    {round.midpointChange > 0 ? <ArrowUpGreenIcon /> : <ArrowDownRedIcon />}
                                </p>
                            )}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default NegotiationHistory;