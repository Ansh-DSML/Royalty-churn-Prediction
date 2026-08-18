import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { units, networkAggregates } from '../data/computeUnits';
import { ArrowDown, ArrowUp, DollarSign } from 'lucide-react';

export default function RevenueRecoveryForecast() {
  const [sortCol, setSortCol] = useState<'netEv' | 'gap'>('netEv');
  const [sortDesc, setSortDesc] = useState(true);

  const flaggedUnits = units.filter(u => u.revenueRecovery.estimatedAnnualizedGap > 0);

  const sorted = [...flaggedUnits].sort((a, b) => {
    if (sortCol === 'netEv') {
      return sortDesc ? b.revenueRecovery.netExpectedValue - a.revenueRecovery.netExpectedValue : a.revenueRecovery.netExpectedValue - b.revenueRecovery.netExpectedValue;
    }
    return sortDesc ? b.revenueRecovery.estimatedAnnualizedGap - a.revenueRecovery.estimatedAnnualizedGap : a.revenueRecovery.estimatedAnnualizedGap - b.revenueRecovery.estimatedAnnualizedGap;
  });

  const handleSort = (col: 'netEv' | 'gap') => {
    if (sortCol === col) setSortDesc(!sortDesc);
    else { setSortCol(col); setSortDesc(true); }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center space-x-3 mb-2">
        <DollarSign className="w-6 h-6 text-brand-500" />
        <h1 className="text-2xl font-semibold text-slate-900">Revenue Recovery Forecast</h1>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm grid grid-cols-3 gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">Total Flagged (Trailing 12Mo)</div>
          <div className="text-2xl font-semibold text-slate-900 tabular-nums">
            ${networkAggregates.revenueRecovery.totalGapTrailing12Mo.toLocaleString(undefined, {maximumFractionDigits:0})}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-slate-500">Projected Exposure (Next 2 Qtrs)</div>
          <div className="text-2xl font-semibold text-brand-600 tabular-nums">
            ${networkAggregates.revenueRecovery.projectedNext2QuartersExposure.toLocaleString(undefined, {maximumFractionDigits:0})}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-slate-500">Formal Audits Recommended</div>
          <div className="text-2xl font-semibold text-slate-900">{networkAggregates.revenueRecovery.formalAuditTierCount} units</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Unit</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900 cursor-pointer" onClick={() => handleSort('gap')}>
                <div className="flex items-center justify-end">Annualized Gap {sortCol === 'gap' && (sortDesc ? <ArrowDown className="w-3 h-3 ml-1"/> : <ArrowUp className="w-3 h-3 ml-1"/>)}</div>
              </th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">Confidence</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">Est. Inv. Cost</th>
              <th className="px-4 py-3 text-right font-semibold text-brand-700 cursor-pointer" onClick={() => handleSort('netEv')}>
                <div className="flex items-center justify-end">Net Expected Value {sortCol === 'netEv' && (sortDesc ? <ArrowDown className="w-3 h-3 ml-1"/> : <ArrowUp className="w-3 h-3 ml-1"/>)}</div>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Recommended Action Tier</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white tabular-nums">
            {sorted.map(unit => {
              return (
                <tr key={unit.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-slate-900">{unit.name}, {unit.state}</td>
                  <td className="px-4 py-4 text-right text-rose-600 font-medium">
                    ${unit.revenueRecovery.estimatedAnnualizedGap.toLocaleString(undefined, {maximumFractionDigits:0})}
                  </td>
                  <td className="px-4 py-4 text-right text-slate-700">{unit.revenueRecovery.confidencePct}%</td>
                  <td className="px-4 py-4 text-right text-slate-600">
                    ${unit.revenueRecovery.investigationCost.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-brand-600">
                    ${unit.revenueRecovery.netExpectedValue.toLocaleString(undefined, {maximumFractionDigits:0})}
                  </td>
                  <td className="px-4 py-4 text-slate-700 max-w-xs">{unit.revenueRecovery.recommendedTier}</td>
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
        * Ranked by expected value, not by who simply crossed a threshold — the same logic a controller would use to prioritize a limited audit budget. Projected exposure assumes trailing trends persist unaddressed.
      </p>
    </div>
  );
}
