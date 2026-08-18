export interface BrandProfile {
  name: string;
  shortName: string;
  unitCount: number;
  connectedSystems: { name: string; category: string; status: string; lastSyncedMinutesAgo: number }[];
  auditThresholdPct: number;
  royaltyRatePct: number;
  auditCostRange: { min: number; max: number };
  benchmarks: {
    topQuartileAvgRevenue: number;
    bottomQuartileAvgRevenue: number;
    highestUnitRevenue: number;
    lowestUnitRevenue: number;
  };
}

export type HealthBucket = 'healthy' | 'watch' | 'atRisk';
export type TrendDirection = 'accelerating' | 'stabilizing' | 'improving' | null;

export interface KpisBySystem {
  compass: {
    leadsReceived: number;
    estimatesIssued: number;
    closeRatePct: number;
    jobsCompleted: number;
    avgTicket: number;
    technicianUtilizationPct: number;
    avgDaysEstimateToStart: number;
    repeatReferralPct: number;
    selfReportedGrossRevenue: number;
    openJobBacklog: number;
  };
  mirapay: {
    settledVolume: number;
    transactionCount: number;
    avgTransactionValue: number;
    daysToSettle: number;
    chargebackRatePct: number;
    failedPaymentRatePct: number;
    financedJobSharePct: number;
    systemImpliedRevenue: number;
  };
  broadly: {
    reviewRequestsSent: number;
    reviewsReceived: number;
    responseRatePct: number;
    avgRating90d: number;
    ratingTrend90d: number;
    negativeReviewResponseRatePct: number;
    avgResponseTimeHours: number;
  };
}

export interface DerivedKpis {
  healthScore: number;
  percentileRank: number;
  royaltyVariancePct: number;
  customerExperienceIndex: number;
  unitEconomicsTrend: {
    volumeComponentVsPeerPct: number;
    priceMixComponentVsPeerPct: number;
  };
}

export interface ChurnRiskFactor {
  category: string;
  weightPct: number;
  contributionPoints: number;
  signal: string;
}

export interface ChurnRisk {
  score: number;
  trend: TrendDirection;
  factorBreakdown: ChurnRiskFactor[];
  topSignals: string[];
  recommendedAction: string;
}

export interface RevenueRecovery {
  estimatedAnnualizedGap: number;
  confidencePct: number;
  investigationCost: number;
  netExpectedValue: number;
  recommendedTier: string;
}

export interface Unit {
  id: string;
  name: string;
  city: string;
  state: string;
  franchiseeTenureYears: number;
  region: string;
  healthScore: number;
  healthBucket: HealthBucket;
  monthlyRevenueTrend: number[];
  percentileRank: number;
  jobsPerMonth: number;
  avgTicket: number;
  reportedRoyaltyBasis: number;
  systemImpliedRevenue: number;
  variancePct: number;
  varianceHistory: number[];
  aiInsight: string;
  kpisBySystem: KpisBySystem;
  derivedKpis: DerivedKpis;
  churnRisk: ChurnRisk;
  revenueRecovery: RevenueRecovery;
}

export interface Insight {
  id: string;
  severity: 'red' | 'amber' | 'green';
  unitId: string | null;
  text: string;
  timestampMinutesAgo: number;
}
