'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Star, Calendar, Award, Target, Zap } from 'lucide-react';
import { portfolioAPI, consultationAPI, type PortfolioItem, type ConsultationSubmission } from '@/lib/admin-data';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AnalyticsDashboard() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [consultations, setConsultations] = useState<ConsultationSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [portfolioData, consultationData] = await Promise.all([
        portfolioAPI.getAll(),
        consultationAPI.getAll(),
      ]);
      setPortfolioItems(portfolioData);
      setConsultations(consultationData);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalProjects = portfolioItems.length;
  const featuredProjects = portfolioItems.filter((item) => item.is_featured).length;
  const totalConsultations = consultations.length;
  const pendingConsultations = consultations.filter((c) => c.status === 'pending').length;
  const convertedConsultations = consultations.filter((c) => c.status === 'converted').length;
  const conversionRate =
    totalConsultations > 0 ? ((convertedConsultations / totalConsultations) * 100).toFixed(1) : '0';
  const averageScore =
    consultations.length > 0
      ? Math.round(
          consultations.reduce((sum, c) => sum + c.quiz_score, 0) / consultations.length
        ).toString()
      : '0';

  const recentConsultations = consultations
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const categoryBreakdown = portfolioItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getMonthlyTrends = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const count = consultations.filter((c) => {
        const d = new Date(c.created_at);
        return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
      }).length;
      months.push({ month: monthName, count });
    }
    return months;
  };

  const monthlyTrends = getMonthlyTrends();
  const maxTrend = Math.max(...monthlyTrends.map((m) => m.count), 1);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'contacted':
        return 'text-blue-600';
      case 'qualified':
        return 'text-green-600';
      case 'converted':
        return 'text-purple-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="medium" className="mx-auto mb-4" />
        <p className="text-zero/60">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-destructive/30 p-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={loadData}
          className="bg-fahrenheit text-white px-6 py-3 rounded-lg font-semibold hover:bg-fahrenheit/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zero">Analytics Dashboard</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white rounded-xl border border-zero/10 p-6 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-fahrenheit rounded-lg flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-zero mb-2">{totalProjects}</div>
          <div className="text-zero/60 text-sm">Total Projects</div>
          <div className="text-fahrenheit text-xs mt-1">{featuredProjects} Featured</div>
        </div>

        <div className="bg-white rounded-xl border border-zero/10 p-6 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-zero mb-2">{totalConsultations}</div>
          <div className="text-zero/60 text-sm">Consultations</div>
          <div className="text-blue-600 text-xs mt-1">{pendingConsultations} Pending</div>
        </div>

        <div className="bg-white rounded-xl border border-zero/10 p-6 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-zero mb-2">{conversionRate}%</div>
          <div className="text-zero/60 text-sm">Conversion</div>
          <div className="text-green-600 text-xs mt-1">{convertedConsultations} Converted</div>
        </div>

        <div className="bg-white rounded-xl border border-zero/10 p-6 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-zero mb-2">{averageScore}</div>
          <div className="text-zero/60 text-sm">Avg Score</div>
          <div className="text-purple-600 text-xs mt-1">XP Points</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-zero/10 p-6">
          <h3 className="text-lg font-semibold text-zero mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-fahrenheit" />
            Monthly Consultation Trends
          </h3>
          <div className="space-y-4">
            {monthlyTrends.map((month) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-zero/70 text-sm">{month.month}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-muted rounded-lg h-2">
                    <div
                      className="bg-fahrenheit h-2 rounded-lg transition-all duration-500"
                      style={{ width: `${Math.max(10, (month.count / maxTrend) * 100)}%` }}
                    />
                  </div>
                  <span className="text-fahrenheit font-semibold w-8 text-right text-sm">
                    {month.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zero/10 p-6">
          <h3 className="text-lg font-semibold text-zero mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-fahrenheit" />
            Portfolio Categories
          </h3>
          <div className="space-y-4">
            {Object.entries(categoryBreakdown).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-zero/70 text-sm truncate">{category}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-muted rounded-lg h-2">
                    <div
                      className="bg-fahrenheit h-2 rounded-lg transition-all duration-500"
                      style={{ width: `${Math.max(10, (count / totalProjects) * 100)}%` }}
                    />
                  </div>
                  <span className="text-fahrenheit font-semibold w-8 text-right text-sm">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zero/10 p-6">
        <h3 className="text-lg font-semibold text-zero mb-6 flex items-center gap-2">
          <Star className="w-6 h-6 text-fahrenheit" />
          Recent Consultation Activity
        </h3>
        {recentConsultations.length > 0 ? (
          <div className="space-y-4">
            {recentConsultations.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-fahrenheit rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-zero font-medium text-sm truncate">
                      {c.first_name} {c.last_name}
                    </div>
                    <div className="text-zero/50 text-xs truncate">
                      {c.company_name || 'Individual'} • {c.project_type || 'General'}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className={`text-sm font-medium capitalize ${getStatusColor(c.status || 'pending')}`}
                  >
                    {c.status || 'pending'}
                  </div>
                  <div className="text-zero/40 text-xs hidden md:block">
                    {formatDate(c.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-zero/30 mx-auto mb-4" />
            <p className="text-zero/50">No recent consultation activity</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-zero/10 p-6">
        <h3 className="text-lg font-semibold text-zero mb-6">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-fahrenheit mb-2">
              {consultations.filter((c) => c.quiz_score >= 150).length}
            </div>
            <div className="text-zero/60 text-sm">High-Quality Leads</div>
            <div className="text-zero/40 text-xs">(Score ≥ 150 XP)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-fahrenheit mb-2">
              {consultations.filter((c) => c.project_type === 'ecommerce').length}
            </div>
            <div className="text-zero/60 text-sm">E-commerce Projects</div>
            <div className="text-zero/40 text-xs">High-value opportunities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-fahrenheit mb-2">
              {consultations.filter((c) => (c.additional_services || []).length > 0).length}
            </div>
            <div className="text-zero/60 text-sm">Add-on Services</div>
            <div className="text-zero/40 text-xs">Additional revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
}
