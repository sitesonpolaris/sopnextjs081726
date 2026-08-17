'use client';

import { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { portfolioAPI, type PortfolioItem } from '@/lib/admin-data';
import ImageInput from './ImageInput';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface PortfolioFormProps {
  item?: PortfolioItem | null;
  onSubmit: () => void;
  onCancel: () => void;
}

const iconOptions = ['Users', 'Zap', 'TrendingUp', 'Award', 'Target'];

export default function PortfolioForm({ item, onSubmit, onCancel }: PortfolioFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    video_url: '',
    image_url: '',
    website_url: '',
    tech_stack: [] as string[],
    results: '',
    client_name: '',
    project_duration: '',
    project_year: '',
    challenge: '',
    solution: '',
    features: [] as string[],
    metrics: [] as Array<{ label: string; value: string; icon: string }>,
    testimonial: { text: '', author: '', position: '' },
    is_featured: false,
    is_visible: true,
    sort_order: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTech, setNewTech] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newMetric, setNewMetric] = useState({ label: '', value: '', icon: 'Target' });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        category: item.category,
        description: item.description,
        video_url: item.video_url || '',
        image_url: item.image_url || '',
        website_url: item.website_url || '',
        tech_stack: item.tech_stack || [],
        results: item.results || '',
        client_name: item.client_name || '',
        project_duration: item.project_duration || '',
        project_year: item.project_year || '',
        challenge: item.challenge || '',
        solution: item.solution || '',
        features: item.features || [],
        metrics: item.metrics || [],
        testimonial: item.testimonial || { text: '', author: '', position: '' },
        is_featured: item.is_featured,
        is_visible: item.is_visible ?? true,
        sort_order: item.sort_order,
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (item) {
        await portfolioAPI.update(item.id, formData);
      } else {
        await portfolioAPI.create(formData);
      }
      onSubmit();
    } catch (err) {
      console.error('Error saving portfolio item:', err);
      setError(err instanceof Error ? err.message : 'Failed to save portfolio item');
    } finally {
      setLoading(false);
    }
  };

  const addTech = () => {
    if (newTech.trim()) {
      setFormData((prev) => ({ ...prev, tech_stack: [...prev.tech_stack, newTech.trim()] }));
      setNewTech('');
    }
  };

  const removeTech = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((_, i) => i !== index),
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addMetric = () => {
    if (newMetric.label.trim() && newMetric.value.trim()) {
      setFormData((prev) => ({ ...prev, metrics: [...prev.metrics, { ...newMetric }] }));
      setNewMetric({ label: '', value: '', icon: 'Target' });
    }
  };

  const removeMetric = (index: number) => {
    setFormData((prev) => ({ ...prev, metrics: prev.metrics.filter((_, i) => i !== index) }));
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-zero/15 bg-white text-zero focus:outline-none focus:ring-2 focus:ring-fahrenheit focus:border-transparent';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-zero">
          {item ? 'Edit Portfolio Item' : 'Create New Portfolio Item'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-zero/5 transition-colors"
        >
          <X className="w-6 h-6 text-zero" />
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-zero/10 p-6">
          <h3 className="text-lg font-semibold text-zero mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Project Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className={inputClass}
                placeholder="Enter project title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Category *</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className={inputClass}
                placeholder="e.g., SaaS Platform, E-commerce"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Client Name</label>
              <input
                type="text"
                value={formData.client_name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, client_name: e.target.value }))
                }
                className={inputClass}
                placeholder="Client company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Project Year</label>
              <input
                type="text"
                value={formData.project_year}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, project_year: e.target.value }))
                }
                className={inputClass}
                placeholder="2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Project Duration</label>
              <input
                type="text"
                value={formData.project_duration}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, project_duration: e.target.value }))
                }
                className={inputClass}
                placeholder="6 weeks"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Results</label>
              <input
                type="text"
                value={formData.results}
                onChange={(e) => setFormData((prev) => ({ ...prev, results: e.target.value }))}
                className={inputClass}
                placeholder="300% increase in user engagement"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-zero mb-2">Description *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className={`${inputClass} resize-y`}
              placeholder="Brief description of the project"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))
                }
                className="w-4 h-4 rounded text-fahrenheit focus:ring-fahrenheit"
              />
              <span className="text-sm font-medium text-zero">Featured Project</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.is_visible}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, is_visible: e.target.checked }))
                }
                className="w-4 h-4 rounded text-fahrenheit focus:ring-fahrenheit"
              />
              <span className="text-sm font-medium text-zero">Visible to Public</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))
                }
                className={inputClass}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zero/10 p-6">
          <h3 className="text-lg font-semibold text-zero mb-4">Media Files</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Project Video URL</label>
              <input
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, video_url: e.target.value }))}
                className={inputClass}
                placeholder="https://example.com/video.mp4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Live Website URL</label>
              <input
                type="url"
                value={formData.website_url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, website_url: e.target.value }))
                }
                className={inputClass}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-zero mb-4">Project Image</label>
            <ImageInput
              onImageChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
              currentUrl={formData.image_url}
              folder="portfolio/images"
              placeholder="Upload project image or enter URL"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zero/10 p-6">
          <h3 className="text-lg font-semibold text-zero mb-4">Technology Stack</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              className={inputClass}
              placeholder="Add technology (e.g., React, Node.js)"
            />
            <button
              type="button"
              onClick={addTech}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tech_stack.map((tech, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-fahrenheit/10 text-fahrenheit px-3 py-1 rounded-lg"
              >
                <span className="text-sm">{tech}</span>
                <button type="button" onClick={() => removeTech(index)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zero/10 p-6">
          <h3 className="text-lg font-semibold text-zero mb-4">Project Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Challenge</label>
              <textarea
                rows={4}
                value={formData.challenge}
                onChange={(e) => setFormData((prev) => ({ ...prev, challenge: e.target.value }))}
                className={`${inputClass} resize-y`}
                placeholder="Describe the main challenge"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Solution</label>
              <textarea
                rows={4}
                value={formData.solution}
                onChange={(e) => setFormData((prev) => ({ ...prev, solution: e.target.value }))}
                className={`${inputClass} resize-y`}
                placeholder="Describe how you solved it"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zero/10 p-6">
          <h3 className="text-lg font-semibold text-zero mb-4">Key Features</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className={inputClass}
              placeholder="Add feature"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <span className="text-sm text-zero">{feature}</span>
                <button type="button" onClick={() => removeFeature(index)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zero/10 p-6">
          <h3 className="text-lg font-semibold text-zero mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <input
              type="text"
              value={newMetric.label}
              onChange={(e) => setNewMetric((prev) => ({ ...prev, label: e.target.value }))}
              className={inputClass}
              placeholder="Metric label"
            />
            <input
              type="text"
              value={newMetric.value}
              onChange={(e) => setNewMetric((prev) => ({ ...prev, value: e.target.value }))}
              className={inputClass}
              placeholder="Value (e.g., +300%)"
            />
            <select
              value={newMetric.icon}
              onChange={(e) => setNewMetric((prev) => ({ ...prev, icon: e.target.value }))}
              className={inputClass}
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addMetric}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2">
            {formData.metrics.map((metric, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <span className="text-sm text-zero">
                  {metric.icon} | {metric.label}: {metric.value}
                </span>
                <button type="button" onClick={() => removeMetric(index)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zero/10 p-6">
          <h3 className="text-lg font-semibold text-zero mb-4">Client Testimonial</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Testimonial Text</label>
              <textarea
                rows={4}
                value={formData.testimonial.text}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    testimonial: { ...prev.testimonial, text: e.target.value },
                  }))
                }
                className={`${inputClass} resize-y`}
                placeholder="Client testimonial quote"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zero mb-2">Author Name</label>
                <input
                  type="text"
                  value={formData.testimonial.author}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      testimonial: { ...prev.testimonial, author: e.target.value },
                    }))
                  }
                  className={inputClass}
                  placeholder="Client name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zero mb-2">Position/Title</label>
                <input
                  type="text"
                  value={formData.testimonial.position}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      testimonial: { ...prev.testimonial, position: e.target.value },
                    }))
                  }
                  className={inputClass}
                  placeholder="CEO, Company Name"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-white border border-zero/15 text-zero rounded-lg font-semibold hover:bg-zero/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-fahrenheit text-white rounded-lg font-semibold hover:bg-fahrenheit/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {item ? 'Update Project' : 'Create Project'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
