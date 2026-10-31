# Scoring and calculation methodology

Health is clamped to [0,100] and starts at **70**:
- Product adoption: clamp(round(usage change % × 0.8), -25, +10).
- Engagement: round((engagement index - 50) × 0.25).
- Critical support escalations: -12 each.
- Payment overdue flag: -10.
- Stakeholder active: +4; not active: -9.
- CSAT: round((CSAT - 3) × 5).
- Renewal fewer than 60 days away: -8.

Classification: At Risk < 50; Watchlist 50–74; Healthy >=75.

Risk exposure: 65% × ARR of At Risk accounts. Retention recommendation: 65% × ARR for At Risk, 30% × ARR for Watchlist with renewal <= 120 days. Support action: 15% × ARR where critical escalation observed. The summaries do **not** add recommendation exposures together as unique revenue.

Expansion criterion: seat utilization > 79%, product usage growth > 5%, health >= 60; illustrative expansion estimate = ARR × 20%.

Pipeline stalled criterion: active opportunity inactive > 30 days, or no next step. Exposure = opportunity amount × its illustrative stage weight.

Opportunity weights: Discovery .15, Qualification .30, Proposal .55, Negotiation .80, Closed Won 1, Closed Lost 0. Weighted open pipeline excludes Won and Lost.

Scenario incremental uplift = risk exposure × churn reduction % + qualifying expansion estimate × upsell conversion % + weighted pipeline × win-rate uplift % × (1 + ACV change %). Displayed projected illustrative total adds these to baseline ARR despite potential differing recognition timing; **not an accounting forecast**.
