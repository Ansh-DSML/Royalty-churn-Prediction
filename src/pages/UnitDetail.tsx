import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { units, networkAggregates } from '../data/computeUnits';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, DollarSign, Layers, ActivitySquare } from 'lucide-react';

export default function UnitDetail() {
  const { id } = useParams();
  const unit = units.find(u => u.id === id);
  const [activeTab, setActiveTab] = useState<'overview' | 'kpis' | 'risk'>('overview');

  if (!unit) return <div className="p-8">Unit not found</div>;

  const avgNetworkJobs = units.reduce((acc, u) => acc + u.jobsPerMonth, 0) / units.length;
  const avgNetworkTicket = units.reduce((acc, u) => acc + u.avgTicket, 0) / units.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Overview
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">{unit.name}, {unit.state}</h1>
          <div className="text-slate-500 mt-1">Franchisee Tenure: {unit.franchiseeTenureYears} years • {unit.region} Region</div>
        </div>
        <div className={`flex items-center px-4 py-2 rounded-full border ${
          unit.healthBucket === 'healthy' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          unit.healthBucket === 'watch' ? 'bg-amber-50 border-amber-200 text-amber-800' :
          'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="text-sm font-semibold uppercase tracking-wider mr-2">Health Score</div>
          <div className="text-2xl font-bold">{unit.healthScore}</div>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('kpis')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'kpis'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            KPIs by System
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'risk'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Risk & Recovery
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Performance</h2>
              <div className="mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm text-slate-500 font-medium">Revenue Trend (12 mo)</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                    {unit.percentileRank}th percentile network-wide
                  </span>
                </div>
                <div className="h-32 flex items-end space-x-1">
                  {unit.monthlyRevenueTrend.map((v, i) => (
                    <div key={i} className="flex-1 bg-brand-500/80 rounded-t-sm hover:bg-brand-500 transition-colors relative group" style={{ height: `${Math.max(5, (v / Math.max(...unit.monthlyRevenueTrend)) * 100)}%` }}>
                       <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity z-10 tabular-nums">
                         ${(v/1000).toFixed(1)}k
                       </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded border border-slate-100">
                  <div className="text-sm text-slate-500 mb-1">Jobs Completed</div>
                  <div className="text-xl font-semibold text-slate-900">{unit.jobsPerMonth}</div>
                  <div className={`text-xs mt-1 ${unit.jobsPerMonth >= avgNetworkJobs ? 'text-emerald-600' : 'text-slate-500'}`}>
                    vs. {Math.round(avgNetworkJobs)} network avg
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded border border-slate-100">
                  <div className="text-sm text-slate-500 mb-1">Average Ticket</div>
                  <div className="text-xl font-semibold text-slate-900">${unit.avgTicket.toLocaleString()}</div>
                  <div className={`text-xs mt-1 ${unit.avgTicket >= avgNetworkTicket ? 'text-emerald-600' : 'text-slate-500'}`}>
                    vs. ${Math.round(avgNetworkTicket).toLocaleString()} network avg
                  </div>
                </div>
              </div>
            </div>
            
            {unit.churnRisk.score > 30 && (
              <div className="bg-rose-50 rounded-lg border border-rose-100 p-4">
                <h3 className="text-sm font-semibold text-rose-800 uppercase tracking-wider mb-2 flex items-center"><ActivitySquare className="w-4 h-4 mr-2"/> AI Insight</h3>
                <p className="text-rose-900 text-sm leading-relaxed">{unit.churnRisk.topSignals[0]}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Revenue Integrity</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">System-implied revenue (MiraPay)</span>
                    <span className="font-medium text-slate-900 tabular-nums">${unit.systemImpliedRevenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded h-2">
                    <div className="bg-slate-800 h-2 rounded" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Self-reported royalty basis (Compass)</span>
                    <span className="font-medium text-slate-900 tabular-nums">${unit.reportedRoyaltyBasis.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded h-2">
                    <div className="bg-slate-400 h-2 rounded" style={{ width: `${Math.min(100, (unit.reportedRoyaltyBasis / unit.systemImpliedRevenue) * 100)}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6 p-4 rounded-lg bg-slate-50 border border-slate-100">
                <div className={`text-4xl font-bold tabular-nums ${
                  unit.variancePct > 2 ? 'text-rose-600' : unit.variancePct > 1 ? 'text-amber-500' : 'text-emerald-600'
                }`}>
                  {unit.variancePct.toFixed(1)}%
                </div>
                <div className="text-sm text-slate-600">
                  Current month variance.<br/>
                  <span className="text-xs">{unit.variancePct > 2 ? 'Exceeds 2.0% formal audit trigger threshold.' : 'Below formal audit threshold.'}</span>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-slate-900 mb-2">6-Month Variance History</div>
                <div className="flex items-end h-16 space-x-2">
                  {unit.varianceHistory.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end group relative">
                      <div className={`w-full rounded-t-sm transition-all ${v > 2 ? 'bg-rose-400' : v > 1 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ height: `${Math.max(5, Math.min(100, v * 15))}%` }}></div>
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-0.5 px-1.5 rounded pointer-events-none transition-opacity whitespace-nowrap z-10">
                         {v.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1 text-xs text-slate-400">
                  <span>6 mo ago</span>
                  <span>Current</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'kpis' && (
        <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Compass (CRM)</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Leads received</span><span className="font-medium text-slate-900">{unit.kpisBySystem.compass.leadsReceived}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Estimates issued</span><span className="font-medium text-slate-900">{unit.kpisBySystem.compass.estimatesIssued}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Close rate</span><span className="font-medium text-slate-900">{unit.kpisBySystem.compass.closeRatePct}%</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Jobs completed</span><span className="font-medium text-slate-900">{unit.kpisBySystem.compass.jobsCompleted}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Avg ticket</span><span className="font-medium text-slate-900">${unit.kpisBySystem.compass.avgTicket.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Tech utilization</span><span className="font-medium text-slate-900">{unit.kpisBySystem.compass.technicianUtilizationPct}%</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Days to start</span><span className="font-medium text-slate-900">{unit.kpisBySystem.compass.avgDaysEstimateToStart}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Repeat share</span><span className="font-medium text-slate-900">{unit.kpisBySystem.compass.repeatReferralPct}%</span></div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Broadly (Reputation)</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Requests sent</span><span className="font-medium text-slate-900">{unit.kpisBySystem.broadly.reviewRequestsSent}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Reviews rec'd</span><span className="font-medium text-slate-900">{unit.kpisBySystem.broadly.reviewsReceived}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Response rate</span><span className="font-medium text-slate-900">{unit.kpisBySystem.broadly.responseRatePct}%</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Avg rating</span><span className="font-medium text-slate-900">{unit.kpisBySystem.broadly.avgRating90d}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Rating trend</span><span className="font-medium text-slate-900">{unit.kpisBySystem.broadly.ratingTrend90d > 0 ? '+' : ''}{unit.kpisBySystem.broadly.ratingTrend90d}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Neg response</span><span className="font-medium text-slate-900">{unit.kpisBySystem.broadly.negativeReviewResponseRatePct}%</span></div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">MiraPay (Payments)</h3>
              <div className="grid grid-cols-1 gap-y-4 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Settled volume</span><span className="font-medium text-slate-900">${unit.kpisBySystem.mirapay.settledVolume.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Transaction count</span><span className="font-medium text-slate-900">{unit.kpisBySystem.mirapay.transactionCount}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Avg transaction</span><span className="font-medium text-slate-900">${unit.kpisBySystem.mirapay.avgTransactionValue.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Days to settle</span><span className="font-medium text-slate-900">{unit.kpisBySystem.mirapay.daysToSettle}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Chargeback rate</span><span className="font-medium text-slate-900">{unit.kpisBySystem.mirapay.chargebackRatePct}%</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Failed payments</span><span className="font-medium text-slate-900">{unit.kpisBySystem.mirapay.failedPaymentRatePct}%</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Financed share</span><span className="font-medium text-slate-900">{unit.kpisBySystem.mirapay.financedJobSharePct}%</span></div>
              </div>
            </div>

            <div className="bg-brand-50 rounded-lg border border-brand-200 p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-bl-lg">Cross-System</div>
              <h3 className="text-sm font-semibold text-brand-900 uppercase tracking-wider mb-4 border-b border-brand-200 pb-2">Derived by Meridian</h3>
              <div className="grid grid-cols-1 gap-y-4 text-sm">
                <div className="flex justify-between"><span className="text-brand-800">Health Score</span><span className="font-semibold text-brand-900">{unit.derivedKpis.healthScore}</span></div>
                <div className="flex justify-between"><span className="text-brand-800">Percentile Rank</span><span className="font-semibold text-brand-900">{unit.derivedKpis.percentileRank}th</span></div>
                <div className="flex justify-between"><span className="text-brand-800">Royalty Variance</span><span className="font-semibold text-brand-900">{unit.derivedKpis.royaltyVariancePct.toFixed(1)}%</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-800">Customer Experience Index<br/><span className="text-xs text-brand-600/70 opacity-80">(blends Broadly rating + Compass repeat)</span></span>
                  <span className="font-semibold text-brand-900">{unit.derivedKpis.customerExperienceIndex.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-brand-200/50 pt-2">
                  <span className="text-brand-800">Unit Economics Trend</span>
                  <div className="text-right">
                    <div className="text-xs"><span className="text-brand-700">Vol:</span> {unit.derivedKpis.unitEconomicsTrend.volumeComponentVsPeerPct}%</div>
                    <div className="text-xs"><span className="text-brand-700">Mix:</span> {unit.derivedKpis.unitEconomicsTrend.priceMixComponentVsPeerPct}%</div>
                  </div>
                </div>
                <div className="flex justify-between border-t border-brand-200/50 pt-2"><span className="text-brand-800">Churn Risk Score</span><span className="font-semibold text-brand-900">{unit.churnRisk.score}</span></div>
                <div className="flex justify-between"><span className="text-brand-800">Recovery Priority ($)</span><span className="font-semibold text-brand-900">${unit.revenueRecovery.netExpectedValue.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-300">
          {/* Churn Risk */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center"><ActivitySquare className="w-5 h-5 mr-2 text-rose-500" /> Churn Risk Forecast</h2>
            
            {unit.churnRisk.score > 30 ? (
              <div className="space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-1">Risk Score</div>
                    <div className="text-4xl font-bold text-rose-600">{unit.churnRisk.score}</div>
                  </div>
                  <div className="text-sm font-medium text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 capitalize flex items-center">
                    {unit.churnRisk.trend === 'accelerating' ? <TrendingUp className="w-4 h-4 mr-1"/> : unit.churnRisk.trend === 'improving' ? <TrendingDown className="w-4 h-4 mr-1"/> : null}
                    {unit.churnRisk.trend}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-slate-700 mb-3">Factor Contribution</div>
                  <div className="flex h-6 rounded overflow-hidden">
                    {unit.churnRisk.factorBreakdown.map((f, i) => {
                      if (f.contributionPoints === 0) return null;
                      const width = (f.contributionPoints / unit.churnRisk.score) * 100;
                      const colors = ['bg-rose-600', 'bg-rose-500', 'bg-rose-400', 'bg-rose-300', 'bg-rose-200'];
                      return (
                        <div key={i} title={`${f.category}: ${f.contributionPoints} pts`} style={{width: `${width}%`}} className={`${colors[i]} border-r border-white/20 last:border-0`}></div>
                      );
                    })}
                  </div>
                  <div className="mt-3 space-y-2">
                    {unit.churnRisk.factorBreakdown.filter(f => f.contributionPoints > 0).sort((a,b) => b.contributionPoints - a.contributionPoints).map((f, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-slate-600 font-medium">{f.category} <span className="text-slate-400 font-normal">({f.weightPct}%)</span></span>
                        <span className="text-slate-900 font-semibold">{f.contributionPoints} pts</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 rounded border border-slate-200 p-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Primary Signals</div>
                  <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                    {unit.churnRisk.topSignals.map((sig, i) => (
                      <li key={i}>{sig}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recommended Action Plan</div>
                  <p className="text-sm text-slate-900 font-medium leading-relaxed bg-brand-50 p-4 rounded-lg border border-brand-100">
                    {unit.churnRisk.recommendedAction}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No elevated churn risk</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm">Health Score and royalty trend are stable across all five measured categories.</p>
              </div>
            )}
          </div>

          {/* Revenue Recovery */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center"><DollarSign className="w-5 h-5 mr-2 text-brand-500" /> Revenue Recovery Forecast</h2>
            
            {unit.revenueRecovery.estimatedAnnualizedGap > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded border border-slate-100">
                    <div className="text-sm text-slate-500 mb-1">Estimated Annualized Gap</div>
                    <div className="text-2xl font-semibold text-rose-600 tabular-nums">${unit.revenueRecovery.estimatedAnnualizedGap.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded border border-slate-100">
                    <div className="text-sm text-slate-500 mb-1">Model Confidence</div>
                    <div className="text-2xl font-semibold text-slate-900">{unit.revenueRecovery.confidencePct}%</div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-medium text-slate-700">Expected Recovery</span>
                    <span className="text-sm text-slate-900 tabular-nums">${(unit.revenueRecovery.estimatedAnnualizedGap * (unit.revenueRecovery.confidencePct/100)).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-4 text-slate-500">
                    <span className="text-sm font-medium">Estimated Investigation Cost</span>
                    <span className="text-sm tabular-nums">− ${unit.revenueRecovery.investigationCost.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-4 border-t border-slate-200">
                    <span className="text-base font-semibold text-slate-900">Net Expected Value</span>
                    <span className="text-2xl font-bold text-brand-600 tabular-nums">${unit.revenueRecovery.netExpectedValue.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recommended Action Tier</div>
                  <p className="text-sm text-slate-900 font-medium leading-relaxed bg-brand-50 p-4 rounded-lg border border-brand-100">
                    {unit.revenueRecovery.recommendedTier}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No revenue recovery flagged</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm">Self-reported royalty basis matches system-implied revenue within acceptable tolerances.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
