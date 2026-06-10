import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FileText, Calendar, PieChart as PieChartIcon, BarChart as BarChartIcon, TrendingUp, ArrowRight, Loader } from 'lucide-react';
import { LineChartComponent, BarChartComponent } from '../../components/charts';
import { getRegistrationTrends, getMembershipBySection, ChartPoint } from '../../services/reportService';
import toast from 'react-hot-toast';

const ReportsPage: React.FC = () => {
  const [trends, setTrends] = useState<ChartPoint[]>([]);
  const [sections, setSections] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingIdx, setGeneratingIdx] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      getRegistrationTrends().then(d => setTrends(d)),
      getMembershipBySection().then(d => setSections(d)),
    ]).finally(() => setLoading(false));
  }, []);

  const trendData = trends.map(d => ({ name: d.label, value: d.value }));
  const sectionData = sections.map(d => ({ name: d.label, value: d.value }));

  const reportsList = [
    { title: 'Monthly Registration Summary', description: 'Analysis of new scout registrations by section and county.', icon: <FileText className="text-blue-500" />, type: 'PDF' },
    { title: 'Financial Performance Q2', description: 'Quarterly financial report including revenue and expenses.', icon: <TrendingUp className="text-green-500" />, type: 'Excel' },
    { title: 'County Activity Report', description: 'Overview of scouting activities across all counties.', icon: <BarChartIcon className="text-purple-500" />, type: 'PDF' },
    { title: 'Member Retention Analysis', description: 'Insights into member renewal rates and section transitions.', icon: <PieChartIcon className="text-orange-500" />, type: 'PDF' },
  ];

  const handleGenerate = (idx: number) => {
    setGeneratingIdx(idx);
    setTimeout(() => {
      setGeneratingIdx(null);
      toast.success(`${reportsList[idx].title} generated successfully`);
    }, 1500);
  };

  return (
    <DashboardLayout title="Reports">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div><h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2><p className="text-gray-500 mt-1">Generate and view detailed reports</p></div>
        <Button variant="primary" size="sm" className="flex items-center gap-2" onClick={() => toast.success('Report scheduled. You will receive it via email.')}><Calendar size={18} />Schedule Report</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {[1, 2].map(i => <div key={i} className="bg-white rounded-xl p-6 animate-pulse border border-gray-100"><div className="h-64 bg-gray-200 rounded" /></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card><div className="flex items-center justify-between mb-6"><h3 className="text-lg font-bold text-gray-900">Registration Trends</h3></div><div className="h-64"><LineChartComponent title="Registration Trends" data={trendData} /></div></Card>
          <Card><div className="flex items-center justify-between mb-6"><h3 className="text-lg font-bold text-gray-900">Membership by Section</h3></div><div className="h-64"><BarChartComponent title="Section Breakdown" data={sectionData} /></div></Card>
        </div>
      )}

      <h3 className="text-xl font-bold text-gray-900 mb-4">Available Reports</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportsList.map((report, idx) => (
          <Card key={idx} className="hover:shadow-md transition-shadow duration-200 group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-primary-50 transition-colors">{report.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between"><h4 className="font-bold text-gray-900">{report.title}</h4><span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded">{report.type}</span></div>
                <p className="text-sm text-gray-500 mt-1 mb-4">{report.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Ready to generate</span>
                  <Button variant="ghost" size="sm" className="text-primary-600 flex items-center gap-1 group/btn" disabled={generatingIdx === idx} onClick={() => handleGenerate(idx)}>
                    {generatingIdx === idx ? <><Loader size={14} className="animate-spin" /> Generating...</> : <>Generate New<ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" /></>}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
