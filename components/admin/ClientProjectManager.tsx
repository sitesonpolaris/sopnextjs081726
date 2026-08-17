'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, CreditCard as Edit, Trash2, Users, Briefcase, Calendar, Search, ExternalLink, Phone, Mail, Building, Clock, DollarSign, FileText } from 'lucide-react';
import {
  clientAPI,
  projectAPI,
  projectPaymentAPI,
  type Client,
  type Project,
  type ProjectPayment,
} from '@/lib/admin-data';
import ProjectForm from './ProjectForm';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatDateOnly } from '@/lib/utils';

const projectStatuses = [
  { value: 'lead_identified', label: 'Lead Identified', color: 'text-blue-600 bg-blue-100' },
  { value: 'contacted', label: 'Contacted', color: 'text-blue-600 bg-blue-100' },
  { value: 'loom_audit_sent', label: 'Loom Audit Sent', color: 'text-purple-600 bg-purple-100' },
  { value: 'call_booked', label: 'Call Booked', color: 'text-orange-600 bg-orange-100' },
  { value: 'proposal_sent', label: 'Proposal Sent', color: 'text-yellow-600 bg-yellow-100' },
  { value: 'deposit_received', label: 'Deposit Received', color: 'text-green-600 bg-green-100' },
  { value: 'website_build', label: 'Website Build', color: 'text-teal-600 bg-teal-100' },
  { value: 'retainer_active', label: 'Retainer Active', color: 'text-green-600 bg-green-100' },
  { value: 'completed_ongoing', label: 'Completed / Ongoing', color: 'text-green-700 bg-green-100' },
  { value: 'cancelled', label: 'Cancelled', color: 'text-red-600 bg-red-100' },
];

export default function ClientProjectManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allPayments, setAllPayments] = useState<ProjectPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'project'; id: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date_created' | 'date_completed' | 'status' | 'client_name'>('date_completed');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [yearFilter, setYearFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [clientsData, projectsData, paymentsData] = await Promise.all([
        clientAPI.getAll(),
        projectAPI.getAll(),
        projectPaymentAPI.getAll(),
      ]);
      setClients(clientsData);
      setProjects(projectsData);
      setAllPayments(paymentsData);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSorted = useMemo(() => {
    let filtered = projects.filter((project) => {
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesSearch =
        searchTerm === '' ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client?.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;
      switch (sortBy) {
        case 'date_completed':
          aValue = a.date_completed ? new Date(a.date_completed) : new Date(0);
          bValue = b.date_completed ? new Date(b.date_completed) : new Date(0);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'client_name':
          aValue = a.client?.name || '';
          bValue = b.client?.name || '';
          break;
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
      }
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [projects, statusFilter, searchTerm, sortBy, sortOrder]);

  const handleDelete = async (id: string) => {
    try {
      await projectAPI.delete(id);
      await loadData();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
    }
  };

  const getStatusInfo = (status: string) =>
    projectStatuses.find((s) => s.value === status) || projectStatuses[0];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const formatDateColumn = formatDateOnly;

  const getPaymentsForProject = (projectId: string) =>
    allPayments.filter((p) => p.project_id === projectId);

  const getTotalPayments = (projectId: string) =>
    getPaymentsForProject(projectId).reduce((sum, p) => sum + p.amount, 0);

  const getMostRecentPayment = (projectId: string): ProjectPayment | null => {
    const payments = getPaymentsForProject(projectId);
    if (payments.length === 0) return null;
    return [...payments].sort(
      (a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
    )[0];
  };

  const metrics = useMemo(() => {
    const filteredPayments =
      yearFilter === 'all'
        ? allPayments
        : allPayments.filter((p) => new Date(p.payment_date).getFullYear() === parseInt(yearFilter));

    const totalValue = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const uniqueProjectIds = new Set(filteredPayments.map((p) => p.project_id));

    const now = new Date();
    const currentMonthPayments = allPayments.filter((p) => {
      const d = new Date(p.payment_date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const currentMonthValue = currentMonthPayments.reduce((sum, p) => sum + p.amount, 0);
    const currentMonthIds = new Set(currentMonthPayments.map((p) => p.project_id));

    const pendingStatuses = [
      'lead_identified',
      'contacted',
      'loom_audit_sent',
      'call_booked',
      'proposal_sent',
    ];
    const pendingProjects = projects.filter((p) => pendingStatuses.includes(p.status));
    const pendingValue = pendingProjects.reduce((sum, p) => sum + (p.value || 0), 0);

    return {
      totalValue,
      totalCount: uniqueProjectIds.size,
      currentMonthValue,
      currentMonthCount: currentMonthIds.size,
      pendingValue,
      pendingCount: pendingProjects.length,
    };
  }, [allPayments, yearFilter, projects]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  if (loading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="medium" className="mx-auto mb-4" />
        <p className="text-zero/60">Loading clients and projects...</p>
      </div>
    );
  }

  if (showProjectForm) {
    return (
      <ProjectForm
        project={editingProject}
        clients={clients}
        onSubmit={async () => {
          setShowProjectForm(false);
          setEditingProject(null);
          await loadData();
        }}
        onCancel={() => {
          setShowProjectForm(false);
          setEditingProject(null);
        }}
        onPaymentsChange={loadData}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-zero">Project Management</h2>
        <button
          onClick={() => {
            setEditingProject(null);
            setShowProjectForm(true);
          }}
          className="bg-fahrenheit text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-fahrenheit/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl border border-fahrenheit/20 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-zero">Total Portfolio Value</h3>
            <div className="flex items-center gap-2">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-2 py-1.5 text-sm rounded-lg border border-zero/15 bg-white text-zero"
              >
                <option value="all">All Time</option>
                {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                  <option key={y} value={y.toString()}>
                    {y}
                  </option>
                ))}
              </select>
              <div className="w-10 h-10 bg-fahrenheit/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-fahrenheit" />
              </div>
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-fahrenheit">{formatCurrency(metrics.totalValue)}</p>
          <p className="text-xs text-zero/60 mt-1">
            From {metrics.totalCount} {metrics.totalCount === 1 ? 'project' : 'projects'}
            {yearFilter !== 'all' ? ` in ${yearFilter}` : ' (all time)'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-green-500/20 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-zero">Current Month Revenue</h3>
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-green-600">
            {formatCurrency(metrics.currentMonthValue)}
          </p>
          <p className="text-xs text-zero/60 mt-1">
            From {metrics.currentMonthCount} {metrics.currentMonthCount === 1 ? 'project' : 'projects'} this month
          </p>
        </div>

        <div className="bg-white rounded-xl border border-odyssey/20 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-zero">Pending Projects</h3>
            <div className="w-10 h-10 bg-odyssey/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-odyssey" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-odyssey">
            {formatCurrency(metrics.pendingValue)}
          </p>
          <p className="text-xs text-zero/60 mt-1">
            Across {metrics.pendingCount} pending {metrics.pendingCount === 1 ? 'project' : 'projects'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 md:p-6 border border-zero/10">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zero/40" />
            <input
              type="text"
              placeholder="Search projects or clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-muted border border-zero/10 text-zero focus:outline-none focus:ring-2 focus:ring-fahrenheit"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-lg bg-white border border-zero/15 text-zero focus:outline-none focus:ring-2 focus:ring-fahrenheit"
            >
              <option value="all">All Status</option>
              {projectStatuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as typeof sortBy);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-4 py-3 rounded-lg bg-white border border-zero/15 text-zero focus:outline-none focus:ring-2 focus:ring-fahrenheit"
            >
              <option value="date_completed-desc">Recently Completed</option>
              <option value="date_completed-asc">Earliest Completed</option>
              <option value="date_created-desc">Newest First</option>
              <option value="date_created-asc">Oldest First</option>
              <option value="status-asc">Status A-Z</option>
              <option value="client_name-asc">Client A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAndSorted.map((project) => {
          const payments = getPaymentsForProject(project.id);
          const totalPayments = getTotalPayments(project.id);
          const mostRecent = getMostRecentPayment(project.id);

          return (
            <div key={project.id} className="bg-white rounded-lg border border-zero/10 p-4 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-2 mb-3">
                    <h3 className="text-base md:text-xl font-semibold text-zero">{project.title}</h3>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs md:text-sm font-medium w-fit ${getStatusInfo(project.status).color}`}
                    >
                      {getStatusInfo(project.status).label}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 mb-3">
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-fahrenheit flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="text-zero font-medium text-sm truncate">
                          {project.client?.name}
                        </div>
                        <a
                          href={`mailto:${project.client?.email}`}
                          className="text-zero/60 hover:text-fahrenheit text-xs block truncate"
                        >
                          {project.client?.email}
                        </a>
                      </div>
                    </div>
                    {project.client?.phone && (
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-fahrenheit flex-shrink-0 mt-0.5" />
                        <a
                          href={`tel:${project.client?.phone}`}
                          className="text-zero/60 hover:text-fahrenheit text-xs truncate"
                        >
                          {project.client?.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-fahrenheit flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-zero/60 text-xs">Created</div>
                        <div className="text-zero text-sm font-medium">
                          {formatDate(project.created_at)}
                        </div>
                      </div>
                    </div>
                    {project.date_completed && (
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-zero/60 text-xs">Completed</div>
                          <div className="text-zero text-sm font-medium">
                            {formatDateColumn(project.date_completed)}
                          </div>
                        </div>
                      </div>
                    )}
                    {project.value != null && (
                      <div className="flex items-start gap-2">
                        <Building className="w-4 h-4 text-zero/40 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-zero/50 text-xs">Project Value</div>
                          <div className="text-zero/70 font-semibold text-sm">
                            {formatCurrency(project.value)}
                          </div>
                        </div>
                      </div>
                    )}
                    {payments.length > 0 && (
                      <>
                        <div className="flex items-start gap-2">
                          <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-zero/60 text-xs">Total Payments</div>
                            <div className="text-zero font-bold text-sm">
                              {formatCurrency(totalPayments)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-fahrenheit flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-zero/60 text-xs">
                              {payments.length} payment{payments.length !== 1 ? 's' : ''} | Latest:{' '}
                              {mostRecent ? formatDateColumn(mostRecent.payment_date) : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {project.description && (
                    <p className="text-zero/60 text-sm line-clamp-2 mb-2">{project.description}</p>
                  )}

                  {project.website_url && (
                    <a
                      href={project.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-fahrenheit hover:text-zero text-sm py-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Website
                    </a>
                  )}
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setShowProjectForm(true);
                    }}
                    className="p-2 rounded-lg hover:bg-zero/5 transition-colors"
                    title="Edit Project"
                  >
                    <Edit className="w-4 h-4 text-zero" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ type: 'project', id: project.id })}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-zero/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zero mb-2">No Projects Found</h3>
            <p className="text-zero/50 mb-6 max-w-md mx-auto">
              {statusFilter === 'all' && searchTerm === ''
                ? 'Create your first project to get started.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
            <button
              onClick={() => {
                setEditingProject(null);
                setShowProjectForm(true);
              }}
              className="bg-fahrenheit text-white px-6 py-3 rounded-lg font-semibold hover:bg-fahrenheit/90 transition-colors"
            >
              Create First Project
            </button>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-zero mb-4">Confirm Deletion</h3>
            <p className="text-zero/70 mb-6">
              Delete this project? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 bg-destructive text-destructive-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-muted text-zero px-4 py-2.5 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
