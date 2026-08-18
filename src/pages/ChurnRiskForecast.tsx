import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { units, networkAggregates } from '../data/computeUnits';
import { ArrowDown, ArrowUp, ActivitySquare } from 'lucide-react';

export default function ChurnRiskForecast() {
  const [sortCol, setSortCol] = useState<'score' | 'unit'>('score');
  const [sortDesc, setSortDesc] = useState(true);

  const flaggedUnits = units.filter(u => u.churnRisk.score > 30);

  const sorted = [...flaggedUnits].sort((a, b) => {
    if (sortCol === 'score') {
      return sortDesc ? b.churnRisk.score - a.churnRisk.score : a.churnRisk.score - b.churnRisk.score;
    }
    return sortDesc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
  });

  const handleSort = (col: 'score' | 'unit') => {
    if (sortCol === col) setSortDesc(!sortDesc);
    else { setSortCol(col); setSortDesc(true); }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center space-x-3 mb-2">
        <ActivitySquare className="w-6 h-6 text-rose-500" />
        <h1 className="text-2xl font-semibold text-slate-900">Churn Risk Forecast</h1>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm grid grid-cols-4 gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">Total Flagged Units</div>
          <div className="text-2xl font-semibold text-slate-900">{networkAggregates.churnWatchlist.flaggedCount}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-slate-500">Accelerating Trend</div>
          <div className="text-2xl font-semibold text-rose-600">{networkAggregates.churnWatchlist.accelerating}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-slate-500">Stabilizing</div>
          <div className="text-2xl font-semibold text-amber-500">{networkAggregates.churnWatchlist.stabilizing}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-slate-500">Annual Revenue at Risk</div>
          <div className="text-2xl font-semibold text-slate-900 tabular-nums">
            ${networkAggregates.churnWatchlist.annualRevenueAtRisk.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-900 cursor-pointer" onClick={() => handleSort('unit')}>
                <div className="flex items-center">Unit {sortCol === 'unit' && (sortDesc ? <ArrowDown className="w-3 h-3 ml-1"/> : <ArrowUp className="w-3 h-3 ml-1"/>)}</div>
              </th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900 cursor-pointer" onClick={() => handleSort('score')}>
                <div className="flex items-center justify-end">Risk Score {sortCol === 'score' && (sortDesc ? <ArrowDown className="w-3 h-3 ml-1"/> : <ArrowUp className="w-3 h-3 ml-1"/>)}</div>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Trend</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Dominant Factor</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Top Signal</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Recommended Action</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {sorted.map(unit => {
              const domFactor = unit.churnRisk.factorBreakdown.reduce((a,b) => a.contributionPoints > b.contributionPoints ? a : b);
              return (
                <tr key={unit.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-slate-900">{unit.name}, {unit.state}</td>
                  <td className="px-4 py-4 text-right">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${unit.churnRisk.score > 60 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                      {unit.churnRisk.score}
                    </span>
                  </td>
                  <td className="px-4 py-4 capitalize text-slate-700">{unit.churnRisk.trend}</td>
                  <td className="px-4 py-4 text-slate-700 font-medium">{domFactor.category}</td>
                  <td className="px-4 py-4 text-slate-600 truncate max-w-[200px]" title={unit.churnRisk.topSignals[0]}>
                    {unit.churnRisk.topSignals[0]}
                  </td>
                  <td className="px-4 py-4 text-slate-600 max-w-xs">{unit.churnRisk.recommendedAction}</td>
                  <td className="px-4 py-4 text-right">
                    <Link to={`/unit/${unit.id}`} className="text-brand-600 hover:text-brand-700 font-medium whitespace-nowrap">
                      View Unit →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      <p className="text-sm text-slate-500 italic mt-4">
        * Explainable, factor-weighted model — not a black-box prediction. Every score can be decomposed into the five categories below: Royalty & Payment Integrity (30%), Unit Economics Deterioration (25%), Liquidity & Solvency (20%), Compliance (15%), Customer Experience (10%).
      </p>
    </div>
  );
}
