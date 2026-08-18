import type { BrandProfile, Insight } from './types';

export const brandProfile: BrandProfile = {
  name: "Miracle Method Surface Refinishing",
  shortName: "Miracle Method",
  unitCount: 190,
  connectedSystems: [
    { name: "Compass", category: "CRM / Ops", status: "Connected", lastSyncedMinutesAgo: 2 },
    { name: "MiraPay", category: "Payments", status: "Connected", lastSyncedMinutesAgo: 5 },
    { name: "Broadly", category: "Reputation", status: "Connected", lastSyncedMinutesAgo: 14 }
  ],
  auditThresholdPct: 2.0,
  royaltyRatePct: 0.05, // 5% royalty
  auditCostRange: { min: 1000, max: 15000 },
  benchmarks: {
    topQuartileAvgRevenue: 2750000,
    bottomQuartileAvgRevenue: 416000,
    highestUnitRevenue: 4090000,
    lowestUnitRevenue: 158800
  }
};

// We will have ~20 units.
export const rawUnitsData = [
  {
    id: "U001",
    name: "Fenton",
    city: "Fenton",
    state: "MO",
    franchiseeTenureYears: 4,
    region: "Midwest",
    // Distressed unit: royalty floor behavior
    kpisBySystem: {
      compass: {
        leadsReceived: 120, estimatesIssued: 85, closeRatePct: 65, jobsCompleted: 42,
        avgTicket: 3200, technicianUtilizationPct: 75, avgDaysEstimateToStart: 8,
        repeatReferralPct: 15, selfReportedGrossRevenue: 40000, openJobBacklog: 12
      },
      mirapay: {
        settledVolume: 140000, transactionCount: 45, avgTransactionValue: 3111,
        daysToSettle: 4.5, chargebackRatePct: 0.8, failedPaymentRatePct: 2.1,
        financedJobSharePct: 35, systemImpliedRevenue: 140000
      },
      broadly: {
        reviewRequestsSent: 40, reviewsReceived: 8, responseRatePct: 20, avgRating90d: 4.2,
        ratingTrend90d: -0.3, negativeReviewResponseRatePct: 60, avgResponseTimeHours: 48
      }
    },
    monthlyRevenueTrend: [38000, 39000, 41000, 40000, 39000, 42000, 40000, 39000, 41000, 38000, 40000, 40000],
    peerTrends: { volume: -15, priceMix: -5, utilization: -10, daysToSettle: +2, financedShare: +15, repeat: -5 }
  },
  {
    id: "U002",
    name: "Sacramento",
    city: "Sacramento",
    state: "CA",
    franchiseeTenureYears: 8,
    region: "West",
    // Healthy unit
    kpisBySystem: {
      compass: {
        leadsReceived: 250, estimatesIssued: 190, closeRatePct: 78, jobsCompleted: 140,
        avgTicket: 4800, technicianUtilizationPct: 92, avgDaysEstimateToStart: 12,
        repeatReferralPct: 40, selfReportedGrossRevenue: 680000, openJobBacklog: 45
      },
      mirapay: {
        settledVolume: 678000, transactionCount: 142, avgTransactionValue: 4774,
        daysToSettle: 1.2, chargebackRatePct: 0.1, failedPaymentRatePct: 0.2,
        financedJobSharePct: 10, systemImpliedRevenue: 678000
      },
      broadly: {
        reviewRequestsSent: 130, reviewsReceived: 45, responseRatePct: 35, avgRating90d: 4.9,
        ratingTrend90d: 0.1, negativeReviewResponseRatePct: 100, avgResponseTimeHours: 2
      }
    },
    monthlyRevenueTrend: [590000, 600000, 620000, 610000, 630000, 650000, 670000, 660000, 670000, 680000, 690000, 680000],
    peerTrends: { volume: +8, priceMix: +4, utilization: +2, daysToSettle: -0.5, financedShare: -2, repeat: +5 }
  },
  {
    id: "U003",
    name: "Richmond",
    city: "Richmond",
    state: "VA",
    franchiseeTenureYears: 2,
    region: "East",
    // Watch unit: slight decline in volume
    kpisBySystem: {
      compass: {
        leadsReceived: 180, estimatesIssued: 130, closeRatePct: 60, jobsCompleted: 70,
        avgTicket: 3900, technicianUtilizationPct: 80, avgDaysEstimateToStart: 18,
        repeatReferralPct: 22, selfReportedGrossRevenue: 270000, openJobBacklog: 30
      },
      mirapay: {
        settledVolume: 274000, transactionCount: 72, avgTransactionValue: 3805,
        daysToSettle: 2.1, chargebackRatePct: 0.3, failedPaymentRatePct: 0.8,
        financedJobSharePct: 25, systemImpliedRevenue: 274000
      },
      broadly: {
        reviewRequestsSent: 65, reviewsReceived: 18, responseRatePct: 28, avgRating90d: 4.6,
        ratingTrend90d: -0.1, negativeReviewResponseRatePct: 80, avgResponseTimeHours: 12
      }
    },
    monthlyRevenueTrend: [280000, 275000, 290000, 285000, 280000, 275000, 270000, 272000, 268000, 265000, 275000, 270000],
    peerTrends: { volume: -6, priceMix: -2, utilization: -4, daysToSettle: +0.2, financedShare: +5, repeat: -2 }
  },
  {
    id: "U004",
    name: "Columbia",
    city: "Columbia",
    state: "SC",
    franchiseeTenureYears: 5,
    region: "South",
    // At Risk: royalty floor behavior
    kpisBySystem: {
      compass: {
        leadsReceived: 90, estimatesIssued: 60, closeRatePct: 55, jobsCompleted: 22,
        avgTicket: 2900, technicianUtilizationPct: 50, avgDaysEstimateToStart: 7,
        repeatReferralPct: 10, selfReportedGrossRevenue: 15000, openJobBacklog: 4
      },
      mirapay: {
        settledVolume: 64000, transactionCount: 22, avgTransactionValue: 2909,
        daysToSettle: 5.2, chargebackRatePct: 1.2, failedPaymentRatePct: 3.5,
        financedJobSharePct: 45, systemImpliedRevenue: 64000
      },
      broadly: {
        reviewRequestsSent: 20, reviewsReceived: 3, responseRatePct: 15, avgRating90d: 3.8,
        ratingTrend90d: -0.5, negativeReviewResponseRatePct: 20, avgResponseTimeHours: 96
      }
    },
    monthlyRevenueTrend: [15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000],
    peerTrends: { volume: -25, priceMix: -10, utilization: -20, daysToSettle: +3, financedShare: +20, repeat: -10 }
  }
];

// Generate 16 more mock units to make 20 total.
const cities = ["Austin, TX", "Denver, CO", "Atlanta, GA", "Chicago, IL", "Miami, FL", "Phoenix, AZ", "Dallas, TX", "Seattle, WA", "Boston, MA", "Houston, TX", "Orlando, FL", "Tampa, FL", "Charlotte, NC", "Raleigh, NC", "Nashville, TN", "Las Vegas, NV"];

cities.forEach((cityStr, index) => {
  const [city, state] = cityStr.split(", ");
  const isTop = index % 3 === 0;
  const isBottom = index % 5 === 0;
  
  const jobsCompleted = isTop ? 120 + index * 5 : isBottom ? 15 + index : 50 + index * 2;
  const avgTicket = isTop ? 4500 : isBottom ? 2800 : 3500;
  const actualRevenue = jobsCompleted * avgTicket;
  
  // Create some variance for bottom units
  const varianceFactor = isBottom ? 0.8 : 1.0; 
  const selfReportedGrossRevenue = actualRevenue * varianceFactor;

  rawUnitsData.push({
    id: `U00${index + 5}`,
    name: city,
    city,
    state,
    franchiseeTenureYears: 1 + (index % 10),
    region: "National",
    kpisBySystem: {
      compass: {
        leadsReceived: Math.floor(jobsCompleted * 2.5),
        estimatesIssued: Math.floor(jobsCompleted * 1.8),
        closeRatePct: 55 + (index % 25),
        jobsCompleted,
        avgTicket,
        technicianUtilizationPct: 60 + (index % 30),
        avgDaysEstimateToStart: 10 + (index % 5),
        repeatReferralPct: 20 + (index % 20),
        selfReportedGrossRevenue,
        openJobBacklog: Math.floor(jobsCompleted * 0.3)
      },
      mirapay: {
        settledVolume: actualRevenue,
        transactionCount: jobsCompleted,
        avgTransactionValue: avgTicket,
        daysToSettle: isBottom ? 4 : 1.5,
        chargebackRatePct: isBottom ? 1.5 : 0.2,
        failedPaymentRatePct: isBottom ? 2.5 : 0.5,
        financedJobSharePct: isBottom ? 40 : 15,
        systemImpliedRevenue: actualRevenue
      },
      broadly: {
        reviewRequestsSent: Math.floor(jobsCompleted * 0.9),
        reviewsReceived: Math.floor(jobsCompleted * 0.3),
        responseRatePct: 30 + (index % 10),
        avgRating90d: isBottom ? 3.9 : 4.7,
        ratingTrend90d: isBottom ? -0.2 : 0.1,
        negativeReviewResponseRatePct: isBottom ? 50 : 95,
        avgResponseTimeHours: isBottom ? 48 : 12
      }
    },
    monthlyRevenueTrend: Array.from({length: 12}, (_, i) => selfReportedGrossRevenue * (1 + (i - 6) * 0.01)),
    peerTrends: {
      volume: isBottom ? -10 : isTop ? +10 : 0,
      priceMix: isBottom ? -5 : isTop ? +5 : 0,
      utilization: isBottom ? -10 : isTop ? +5 : 0,
      daysToSettle: isBottom ? +1 : 0,
      financedShare: isBottom ? +10 : 0,
      repeat: isBottom ? -5 : isTop ? +5 : 0
    }
  });
});

export const insightsFeed: Insight[] = [
  { id: "i1", severity: "red", unitId: "U001", text: "Unit #U001 (Fenton, MO) has reported 8.2% less royalty than Compass job records imply for the second consecutive month — above the 2% audit threshold.", timestampMinutesAgo: 15 },
  { id: "i2", severity: "amber", unitId: null, text: "Bottom-quartile units average 61% fewer completed jobs per month than top-quartile units, but marketing spend per unit is nearly identical — a conversion problem, not a lead-volume one.", timestampMinutesAgo: 120 },
  { id: "i3", severity: "green", unitId: "U003", text: "Unit #U003 (Richmond, VA) moved from Watch to Healthy this month after three months of decline — royalty and CRM revenue are now aligned.", timestampMinutesAgo: 300 },
  { id: "i4", severity: "red", unitId: "U004", text: "Columbia, SC is now the network's #1 churn risk — royalty reported at the contractual minimum for 3 straight months while Compass shows 22 completed jobs.", timestampMinutesAgo: 450 },
  { id: "i5", severity: "amber", unitId: null, text: "Regional variance: Midwest units are seeing an 11% increase in average days-to-settle compared to last quarter.", timestampMinutesAgo: 1440 }
];
