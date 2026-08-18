import type { Unit, TrendDirection, ChurnRiskFactor, HealthBucket } from './types';
import { brandProfile, rawUnitsData } from './mockData';

export function computeUnits(): Unit[] {
  return rawUnitsData.map(raw => {
    const { kpisBySystem, peerTrends } = raw;
    const implied = kpisBySystem.mirapay.systemImpliedRevenue;
    const reported = kpisBySystem.compass.selfReportedGrossRevenue;
    const varianceAmount = implied - reported;
    const variancePct = implied > 0 ? (varianceAmount / implied) * 100 : 0;
    
    // Variance History (mock a 6 month trend)
    const varianceHistory = Array.from({length: 6}, (_, i) => variancePct * (1 - (5 - i) * 0.1));

    // 1. Royalty & Payment Integrity Trend (30%)
    let cat1Score = 0;
    let cat1Signal = "No significant royalty variance.";
    const isFloorBehavior = reported <= 15000 && implied > 40000;
    if (isFloorBehavior) {
      cat1Score = 28;
      cat1Signal = "Contractual minimum reporting despite high CRM job activity.";
    } else if (variancePct > brandProfile.auditThresholdPct) {
      cat1Score = Math.min(30, variancePct * 3);
      cat1Signal = `Reporting ${variancePct.toFixed(1)}% less royalty than implied.`;
    }

    // 2. Unit Economics Deterioration (25%)
    let cat2Score = 0;
    let cat2Signal = "Economics stable relative to peers.";
    if (peerTrends.volume < -5) cat2Score += 10;
    if (peerTrends.priceMix < -2) cat2Score += 5;
    if (peerTrends.utilization < -5) cat2Score += 10;
    if (cat2Score > 0) {
      cat2Signal = `Volume ${peerTrends.volume}% vs peer avg. Utilization ${peerTrends.utilization}%.`;
    }

    // 3. Liquidity & Solvency Proxies (20%)
    let cat3Score = 0;
    let cat3Signal = "No liquidity concerns detected.";
    if (peerTrends.daysToSettle > 1) cat3Score += 10;
    if (peerTrends.financedShare > 5) cat3Score += 10;
    if (cat3Score > 0) {
      cat3Signal = `Settlement lag up ${peerTrends.daysToSettle} days. Financed jobs up ${peerTrends.financedShare}%.`;
    }

    // 4. Compliance & Engagement Signals (15%)
    let cat4Score = 0;
    let cat4Signal = "Engagement levels normal.";
    // Mocking compliance based on negative response rate
    if (kpisBySystem.broadly.negativeReviewResponseRatePct < 50) {
      cat4Score = 15;
      cat4Signal = "Disengagement indicated by poor review response rate.";
    }

    // 5. Customer Experience Trajectory (10%)
    let cat5Score = 0;
    let cat5Signal = "Customer experience stable.";
    if (kpisBySystem.broadly.ratingTrend90d < -0.2) cat5Score += 5;
    if (peerTrends.repeat < -2) cat5Score += 5;
    if (cat5Score > 0) {
      cat5Signal = `Rating trend ${kpisBySystem.broadly.ratingTrend90d}. Repeat/referral rate ${peerTrends.repeat}%.`;
    }

    const totalChurnScore = cat1Score + cat2Score + cat3Score + cat4Score + cat5Score;
    
    let trend: TrendDirection = 'stabilizing';
    if (totalChurnScore > 60) trend = 'accelerating';
    else if (totalChurnScore < 20) trend = 'improving';
    else if (totalChurnScore > 40) trend = 'accelerating';

    let healthScore = 100 - (totalChurnScore * 0.8);
    let healthBucket: HealthBucket = 'healthy';
    if (healthScore < 50) healthBucket = 'atRisk';
    else if (healthScore < 80) healthBucket = 'watch';

    // Figure out the dominant category for Churn
    const factors: ChurnRiskFactor[] = [
      { category: "Royalty & Payment Integrity", weightPct: 30, contributionPoints: cat1Score, signal: cat1Signal },
      { category: "Unit Economics Deterioration", weightPct: 25, contributionPoints: cat2Score, signal: cat2Signal },
      { category: "Liquidity & Solvency Proxies", weightPct: 20, contributionPoints: cat3Score, signal: cat3Signal },
      { category: "Compliance & Engagement", weightPct: 15, contributionPoints: cat4Score, signal: cat4Signal },
      { category: "Customer Experience Trajectory", weightPct: 10, contributionPoints: cat5Score, signal: cat5Signal },
    ];
    
    const sortedFactors = [...factors].sort((a,b) => b.contributionPoints - a.contributionPoints);
    const dominantFactor = sortedFactors[0];
    
    let recommendedAction = "No action required at this time.";
    if (totalChurnScore > 30) {
      if (dominantFactor.category === "Royalty & Payment Integrity") {
        recommendedAction = "Schedule a conversation and consider a temporary payment plan before escalating to a formal audit — this pattern usually indicates cash-flow distress, not concealment.";
      } else if (dominantFactor.category === "Unit Economics Deterioration") {
        recommendedAction = "Dispatch a regional ops coach for a short on-site audit focused on the specific weak sub-component (scheduling efficiency vs pricing/estimating).";
      } else if (dominantFactor.category === "Liquidity & Solvency Proxies") {
        recommendedAction = "Flag for a proactive conversation about working-capital strain before it produces a missed royalty payment.";
      } else if (dominantFactor.category === "Compliance & Engagement") {
        recommendedAction = "A visit is overdue regardless of the financial numbers — disengagement from reporting typically precedes a formal exit by several months.";
      } else {
        recommendedAction = "Commission a review of the last several completed jobs and consider a secret-shopper visit before the pattern shows up in revenue.";
      }
    }

    // Revenue Recovery Logic
    let estimatedAnnualizedGap = 0;
    let confidencePct = 0;
    let investigationCost = 0;
    let netExpectedValue = 0;
    let recommendedTier = "";

    if (variancePct > 0) {
      estimatedAnnualizedGap = varianceAmount * 12 * brandProfile.royaltyRatePct; // annualized gap times royalty rate
      
      // Confidence: persistent? correlation with cat 1?
      confidencePct = 50; 
      if (isFloorBehavior) confidencePct = 95;
      else if (variancePct > 5) confidencePct = 85;
      else if (variancePct > 2) confidencePct = 65;

      // Cost: scale by unit complexity (using jobsCompleted as proxy)
      const baseCost = brandProfile.auditCostRange.min;
      const scaleCost = Math.min(brandProfile.auditCostRange.max, baseCost + (kpisBySystem.compass.jobsCompleted * 50));
      investigationCost = Math.floor(scaleCost);

      netExpectedValue = (estimatedAnnualizedGap * (confidencePct / 100)) - investigationCost;

      if (confidencePct >= 85 && netExpectedValue > 5000) {
        recommendedTier = "Formal audit recommended — expected recovery materially exceeds the estimated audit cost.";
      } else if (confidencePct >= 65 && estimatedAnnualizedGap > 10000) {
        recommendedTier = "Request supporting documentation and hold an informal reconciliation call before committing audit budget.";
      } else if (confidencePct >= 80 && estimatedAnnualizedGap <= 10000) {
        recommendedTier = "Batch into the next quarterly review — not worth a standalone audit yet, but keep tracking.";
      } else {
        recommendedTier = "Automated monthly reconciliation flag only; escalate if the pattern continues for two more consecutive months.";
      }
    }

    return {
      id: raw.id,
      name: raw.name,
      city: raw.city,
      state: raw.state,
      franchiseeTenureYears: raw.franchiseeTenureYears,
      region: raw.region,
      healthScore: Math.round(healthScore),
      healthBucket,
      monthlyRevenueTrend: raw.monthlyRevenueTrend,
      percentileRank: Math.floor(Math.random() * 100), // mock
      jobsPerMonth: kpisBySystem.compass.jobsCompleted,
      avgTicket: kpisBySystem.compass.avgTicket,
      reportedRoyaltyBasis: reported,
      systemImpliedRevenue: implied,
      variancePct,
      varianceHistory,
      aiInsight: "", // can be generated if needed
      kpisBySystem,
      derivedKpis: {
        healthScore: Math.round(healthScore),
        percentileRank: Math.floor(Math.random() * 100),
        royaltyVariancePct: variancePct,
        customerExperienceIndex: 100 + kpisBySystem.broadly.ratingTrend90d * 20,
        unitEconomicsTrend: {
          volumeComponentVsPeerPct: peerTrends.volume,
          priceMixComponentVsPeerPct: peerTrends.priceMix
        }
      },
      churnRisk: {
        score: totalChurnScore,
        trend: totalChurnScore > 30 ? trend : null,
        factorBreakdown: factors,
        topSignals: sortedFactors.filter(f => f.contributionPoints > 0).slice(0, 2).map(f => f.signal),
        recommendedAction
      },
      revenueRecovery: {
        estimatedAnnualizedGap,
        confidencePct,
        investigationCost,
        netExpectedValue: Math.max(0, netExpectedValue), // avoid negative display if not needed, though maybe useful
        recommendedTier
      }
    };
  });
}

const computedUnits = computeUnits();

// Rank percentile correctly
computedUnits.sort((a, b) => b.systemImpliedRevenue - a.systemImpliedRevenue);
computedUnits.forEach((u, i) => {
  u.percentileRank = Math.round(((computedUnits.length - i) / computedUnits.length) * 100);
  u.derivedKpis.percentileRank = u.percentileRank;
});

export const units = computedUnits;

export const networkAggregates = {
  churnWatchlist: {
    flaggedCount: units.filter(u => u.churnRisk.score > 30).length,
    accelerating: units.filter(u => u.churnRisk.score > 30 && u.churnRisk.trend === 'accelerating').length,
    stabilizing: units.filter(u => u.churnRisk.score > 30 && u.churnRisk.trend === 'stabilizing').length,
    improving: units.filter(u => u.churnRisk.score > 30 && u.churnRisk.trend === 'improving').length,
    annualRevenueAtRisk: units.filter(u => u.churnRisk.score > 30).reduce((sum, u) => sum + (u.systemImpliedRevenue * 12), 0)
  },
  revenueRecovery: {
    totalGapTrailing12Mo: units.reduce((sum, u) => sum + u.revenueRecovery.estimatedAnnualizedGap, 0),
    projectedNext2QuartersExposure: units.reduce((sum, u) => sum + (u.revenueRecovery.estimatedAnnualizedGap / 2) * 1.1, 0),
    formalAuditTierCount: units.filter(u => u.revenueRecovery.recommendedTier.startsWith("Formal audit recommended")).length
  }
};
