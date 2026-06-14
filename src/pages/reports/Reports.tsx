import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  FileText, Calendar, PieChart as PieChartIcon, BarChart as BarChartIcon,
  TrendingUp, ArrowRight, Loader, Users, UserPlus, Clock, DollarSign,
  RefreshCw, Download, MapPin
} from 'lucide-react';
import { LineChartComponent, BarChartComponent, PieChartComponent } from '../../components/charts';
import {
  getRegistrationTrends, getMembershipBySection, getReportsSummary,
  getCountyBreakdown, ChartPoint, ReportSummary
} from '../../services/reportService';
import { generatePDF, ReportData } from '../../services/pdfGenerator';
import toast from 'react-hot-toast';
import { CHART_COLORS } from '../../constants';

const PIE_COLORS = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6'];

type Period = '7d' | '30d' | '6m' | '1y';

const ReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<Period>('30d');
  const [trends, setTrends] = useState<ChartPoint[]>([]);
  const [sections, setSections] = useState<ChartPoint[]>([]);
  const [counties, setCounties] = useState<ChartPoint[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingIdx, setGeneratingIdx] = useState<number | null>(null);

  const fetchData = (p: Period) => {
    setLoading(true);
    Promise.all([
      getRegistrationTrends(p).then(setTrends),
      getMembershipBySection('current').then(setSections),
      getCountyBreakdown().then(setCounties),
      getReportsSummary(p).then(setSummary),
    ]).catch(() => toast.error('Failed to load report data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(period); }, [period]);

  const trendData = trends.map(d => ({ name: d.label, value: d.value }));
  const sectionData = sections.map(d => ({ name: d.label, value: d.value }));
  const countyData = counties.map((d, i) => ({ name: d.label, value: d.value, fill: PIE_COLORS[i % PIE_COLORS.length] }));

  const handleGenerate = (idx: number) => {
    setGeneratingIdx(idx);
    setTimeout(() => {
      setGeneratingIdx(null);
      const msgs = [
        `Monthly Registration Summary: ${summary?.newRegistrations ?? 0} new registrations this period`,
        `County Activity Report: ${summary?.activeCounties ?? 0} active counties out of ${summary?.totalCounties ?? 0}`,
        `Member Retention Analysis: ${summary?.totalMembers ?? 0} total members, ${summary?.pendingApprovals ?? 0} pending approvals`,
        `Financial Performance: Revenue KES ${(summary?.totalRevenue ?? 0).toLocaleString()} (${(summary?.totalRevenueChange ?? 0) >= 0 ? '+' : ''}${(summary?.totalRevenueChange ?? 0).toLocaleString()} vs last month)`,
      ];
      toast.success(msgs[idx]);
    }, 800);
  };

  return (
    <DashboardLayout title="Reports">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
          <p className="text-gray-500 mt-1">Generate and view detailed reports</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value as Period)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="6m">Last 6 months</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="ghost" size="sm" onClick={() => fetchData(period)} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </Button>
          <Button variant="primary" size="sm" className="flex items-center gap-2 flex-shrink-0" onClick={() => toast.success('Report scheduled. You will receive it via email.')}>
            <Calendar size={18} />Schedule Report
          </Button>
        </div>
      </div>

      {loading && !summary ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl p-5 animate-pulse border border-gray-100">
                <div className="h-4 w-20 bg-gray-200 rounded mb-3" />
                <div className="h-8 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse border border-gray-100">
                <div className="h-64 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Members', value: summary?.totalMembers ?? 0, icon: <Users size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'New Registrations', value: summary?.newRegistrations ?? 0, icon: <UserPlus size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Pending Approvals', value: summary?.pendingApprovals ?? 0, icon: <Clock size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Total Revenue (KES)', value: (summary?.totalRevenue ?? 0).toLocaleString(), icon: <DollarSign size={20} />, color: 'text-purple-600', bg: 'bg-purple-50', sub: `${(summary?.totalRevenueChange ?? 0) >= 0 ? '+' : ''}${(summary?.totalRevenueChange ?? 0).toLocaleString()} vs last month` },
            ].map((stat, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{stat.label}</span>
                  <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>{stat.icon}</div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.sub && <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>}
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="lg:col-span-2">
              <LineChartComponent title="Registration Trends" data={trendData} />
            </div>
            <BarChartComponent title="Section Breakdown" data={sectionData} />
            <PieChartComponent title="County Distribution" data={countyData} />
          </div>

          {/* Available Reports */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Available Reports</h3>
            <span className="text-xs text-gray-400">Data as of {new Date().toLocaleDateString()}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Monthly Registration Summary', description: `Analysis of ${summary?.newRegistrations ?? 0} new scout registrations by section and county.`, icon: <FileText className="text-blue-500" />, type: 'PDF' },
              { title: 'County Activity Report', description: `Overview of scouting activities across ${summary?.activeCounties ?? 0} active counties (${summary?.totalCounties ?? 0} total).`, icon: <MapPin className="text-purple-500" />, type: 'PDF' },
              { title: 'Member Retention Analysis', description: `Insights into ${summary?.totalMembers ?? 0} total members, ${summary?.pendingApprovals ?? 0} pending approvals, and section transitions.`, icon: <PieChartIcon className="text-orange-500" />, type: 'PDF' },
              { title: 'Financial Performance', description: `Revenue KES ${(summary?.totalRevenue ?? 0).toLocaleString()} with ${summary?.totalRevenueChange ?? 0 >= 0 ? 'growth' : 'decline'} vs previous period.`, icon: <TrendingUp className="text-green-500" />, type: 'Excel' },
            ].map((report, idx) => (
              <Card key={idx} className="hover:shadow-md transition-shadow duration-200 group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-primary-50 transition-colors">{report.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-gray-900 truncate">{report.title}</h4>
                      <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded whitespace-nowrap">{report.type}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 mb-4">{report.description}</p>
                    <div className="flex items-center justify-between">
                      <Button variant="ghost" size="sm" className="text-gray-400 flex items-center gap-1" onClick={() => {
                        try { const filename = `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
                        let pdfData: ReportData;
                        if (idx === 0) {
                          pdfData = { title: report.title, type: 'PDF', summary: `Monthly registration summary for Kenya Scout Association. ${trends.length} data points recorded.`, tableHeaders: ['Date', 'Registrations'], tableRows: trends.map(t => [t.label, String(t.value)]), stats: [{ label: 'Total Registrations', value: String(summary?.newRegistrations ?? 0) }, { label: 'Data Points', value: String(trends.length) }, { label: 'Period', value: period }, { label: 'Generated', value: new Date().toLocaleDateString() }] };
                        } else if (idx === 1) {
                          pdfData = { title: report.title, type: 'PDF', summary: `County activity report showing member distribution across ${counties.length} counties.`, tableHeaders: ['County', 'Members'], tableRows: counties.map(c => [c.label, String(c.value)]), stats: [{ label: 'Active Counties', value: String(counties.length) }, { label: 'Total Counties', value: String(summary?.totalCounties ?? 0) }, { label: 'Total Members', value: String(summary?.totalMembers ?? 0) }, { label: 'Coverage', value: counties.length && summary?.totalCounties ? `${Math.round(counties.length / summary.totalCounties * 100)}%` : '0%' }] };
                        } else if (idx === 2) {
                          pdfData = { title: report.title, type: 'PDF', summary: `Member retention analysis for Kenya Scout Association. ${sections.length} sections tracked.`, tableHeaders: ['Section', 'Members'], tableRows: sections.map(s => [s.label, String(s.value)]), stats: [{ label: 'Total Members', value: String(summary?.totalMembers ?? 0) }, { label: 'Active Sections', value: String(sections.length) }, { label: 'Pending Approvals', value: String(summary?.pendingApprovals ?? 0) }, { label: 'Retention Rate', value: summary?.totalMembers ? `${Math.round((summary.totalMembers - (summary?.pendingApprovals ?? 0)) / summary.totalMembers * 100)}%` : '0%' }] };
                        } else {
                          pdfData = { title: report.title, type: 'PDF', summary: `Financial performance overview for Kenya Scout Association. Revenue KES ${(summary?.totalRevenue ?? 0).toLocaleString()}.`, tableHeaders: ['Metric', 'Value'], tableRows: [['Total Revenue (KES)', (summary?.totalRevenue ?? 0).toLocaleString()], ['Change vs Last Month', `${(summary?.totalRevenueChange ?? 0) >= 0 ? '+' : ''}${(summary?.totalRevenueChange ?? 0).toLocaleString()}`], ['Total Members', String(summary?.totalMembers ?? 0)], ['Period', period === '7d' ? 'Last 7 days' : period === '30d' ? 'Last 30 days' : period === '6m' ? 'Last 6 months' : 'Last year']], stats: [{ label: 'Total Revenue', value: `KES ${(summary?.totalRevenue ?? 0).toLocaleString()}` }, { label: 'Change', value: `${(summary?.totalRevenueChange ?? 0) >= 0 ? '+' : ''}${(summary?.totalRevenueChange ?? 0).toLocaleString()}` }, { label: 'Members', value: String(summary?.totalMembers ?? 0) }, { label: 'Period', value: period }] };
                        }
                        const doc = generatePDF(pdfData);
                        doc.save(filename);
                        toast.success(`${report.title} downloaded as ${filename}`);
                        } catch (e) { console.error('PDF generation failed', e); toast.error('Failed to generate PDF. Check console for details.'); }
                      }}>
                        <Download size={14} /> Download
                      </Button>
                      <Button variant="ghost" size="sm" className="text-primary-600 flex items-center gap-1 group/btn" disabled={generatingIdx === idx} onClick={() => handleGenerate(idx)}>
                        {generatingIdx === idx ? <><Loader size={14} className="animate-spin" /> Generating...</> : <>Generate New<ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" /></>}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default ReportsPage;