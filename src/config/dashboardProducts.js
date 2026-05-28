import cashflowForecast    from '../assets/products/dashboard/cashflow-forecast.png'
import revenue             from '../assets/products/dashboard/revenue.png'
import strategicPerf       from '../assets/products/dashboard/strategic-performance.png'
import groupGoal           from '../assets/products/dashboard/group-goal.png'
import sbuInsights         from '../assets/products/dashboard/sbu-insights.png'

const dashboardProducts = [
  {
    id: 'cashflow-forecast',
    label: 'BC Cashflow Forecast Dashboard',
    image: cashflowForecast,
    description: 'Real-time cashflow forecasting dashboard giving finance teams full visibility into incoming and outgoing cash positions across business units.',
  },
  {
    id: 'revenue',
    label: 'BC Revenue Dashboard',
    image: revenue,
    description: 'Comprehensive revenue tracking dashboard consolidating sales performance, targets, and trends across all business channels.',
  },
  {
    id: 'strategic-performance',
    label: 'CEO Strategic Performance Dashboard',
    image: strategicPerf,
    description: 'Executive-level strategic performance overview giving leadership real-time visibility into company-wide KPIs and goals.',
  },
  {
    id: 'group-goal',
    label: 'Group Goal Performance Dashboard',
    image: groupGoal,
    description: 'Group-wide goal tracking dashboard monitoring team and departmental performance against set objectives and milestones.',
  },
  {
    id: 'sbu-insights',
    label: 'SBU Insights Dashboard',
    image: sbuInsights,
    description: 'Strategic Business Unit insights dashboard providing granular performance data and analytics across individual business units.',
  },
]

export default dashboardProducts