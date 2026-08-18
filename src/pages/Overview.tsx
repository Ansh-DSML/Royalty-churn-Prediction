import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, AlertCircle, DollarSign, ActivitySquare } from 'lucide-react';
import { networkAggregates, units } from '../data/computeUnits';
import { brandProfile, insightsFeed } from '../data/mockData';

export default function Overview() {
  const navigate = useNavigate();
  const avgHealth = Math.round(units.reduce((sum, u) => sum + u.healthScore, 0) / units.length);
  const avgRevenue = units.reduce((sum, u) => sum + u.systemImpliedRevenue, 0) / units.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Connected Sources Header Strip */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Connected sources</span>
        <div className="flex items-center space-x-6">
          {brandProfile.connectedSystems.map((sys: any) => (
            <div key={sys.name} className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="font-medium text-slate-900">{sys.name}</span>
              <span className="text-xs text-slate-500">Connected ({sys.lastSyncedMinutesAgo}m ago)</span>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Network Health</div>
          <div className="text-3xl font-semibold text-slate-900 flex items-center">
            {avgHealth} <span className="text-sm text-emerald-600 ml-2 flex items-center"><TrendingUp className="w-4 h-4 mr-1"/>+2</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Units at Risk</div>
          <div className="text-3xl font-semibold text-red-600">{networkAggregates.churnWatchlist.flaggedCount}</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Royalty Variance Flagged</div>
          <div className="text-3xl font-semibold text-amber-600 tabular-nums">
            ${networkAggregates.revenueRecovery.totalGapTrailing12Mo.toLocaleString(undefined, {maximumFractionDigits:0})}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Network Revenue (Avg)</div>
          <div className="text-3xl font-semibold text-slate-900 tabular-nums">
            ${avgRevenue.toLocaleString(undefined, {maximumFractionDigits:0})}
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-2 gap-6 w-full max-w-4xl mb-2">
          <button onClick={() => navigate('/churn-forecast')} className="group flex items-center justify-between p-6 bg-surface-dark rounded-xl border border-slate-800 shadow-lg hover:bg-slate-800 transition-all">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-rose-500/10 rounded-lg group-hover:bg-rose-500/20 transition-colors">
                <ActivitySquare className="w-6 h-6 text-rose-500" />
              </div>
              <div className="text-left">
                <div className="text-lg font-semibold text-white">Churn Risk Forecast</div>
                <div className="text-slate-400 text-sm">Prioritized intervention plan</div>
              </div>
            </div>
            <span className="text-rose-500 font-medium">{networkAggregates.churnWatchlist.flaggedCount} flagged</span>
          </button>
          
          <button onClick={() => navigate('/recovery-forecast')} className="group flex items-center justify-between p-6 bg-surface-dark rounded-xl border border-slate-800 shadow-lg hover:bg-slate-800 transition-all">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-brand-500/10 rounded-lg group-hover:bg-brand-500/20 transition-colors">
                <DollarSign className="w-6 h-6 text-brand-500" />
              </div>
              <div className="text-left">
                <div className="text-lg font-semibold text-white">Revenue Recovery Forecast</div>
                <div className="text-slate-400 text-sm">Prioritized audit pipeline</div>
              </div>
            </div>
            <span className="text-brand-500 font-medium tabular-nums">${(networkAggregates.revenueRecovery.totalGapTrailing12Mo/1000).toFixed(1)}k exposure</span>
          </button>
        </div>
        <p className="text-sm text-slate-500">Both use the same connected data — no new integration required.</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Insights Feed */}
        <div className="col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">AI Insights</h2>
          <div className="space-y-3">
            {insightsFeed.map((insight: any) => (
              <div key={insight.id} className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${insight.severity === 'red' ? 'bg-rose-500' : insight.severity === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <p className="text-sm text-slate-700 leading-relaxed pl-2 mb-2">{insight.text}</p>
                {insight.unitId && (
                  <Link to={`/unit/${insight.unitId}`} className="text-xs font-medium text-brand-600 hover:text-brand-700 pl-2">
                    View unit →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Unit Grid */}
        <div className="col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Network Units</h2>
          <div className="grid grid-cols-2 gap-4">
            {units.slice(0, 16).map(unit => {
              const hasAlert = unit.healthBucket === 'atRisk' || unit.revenueRecovery.estimatedAnnualizedGap > 0;
              return (
                <Link key={unit.id} to={`/unit/${unit.id}`} className="block bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:border-brand-500 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center">
                        {unit.name}
                        {hasAlert && <AlertCircle className="w-4 h-4 text-amber-500 ml-2" />}
                      </div>
                      <div className="text-xs text-slate-500">{unit.city}, {unit.state}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${
                      unit.healthScore >= 80 ? 'bg-emerald-100 text-emerald-800' :
                      unit.healthScore >= 50 ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {unit.healthScore}
                    </div>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">System Implied</div>
                      <div className="font-medium text-slate-900 tabular-nums">${unit.systemImpliedRevenue.toLocaleString()}</div>
                    </div>
                    <div className="w-16 h-8 flex items-end space-x-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      {unit.monthlyRevenueTrend.map((v, i) => (
                        <div key={i} className="flex-1 bg-slate-300 rounded-t-sm" style={{ height: `${Math.max(10, (v / Math.max(...unit.monthlyRevenueTrend)) * 100)}%` }}></div>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
