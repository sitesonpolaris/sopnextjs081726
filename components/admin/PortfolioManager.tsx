'use client';

import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Eye, EyeOff, Star, Upload } from 'lucide-react';
import { portfolioAPI, type PortfolioItem } from '@/lib/admin-data';
import PortfolioForm from './PortfolioForm';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await portfolioAPI.getAll();
      setItems(data);
    } catch (err) {
      setError('Failed to load portfolio items');
      console.error('Error loading portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleToggleVisibility = async (id: string, current: boolean) => {
    try {
      await portfolioAPI.toggleVisibility(id, !current);
      await loadItems();
    } catch (err) {
      console.error('Error toggling visibility:', err);
      setError('Failed to toggle visibility');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await portfolioAPI.delete(id);
      await loadItems();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting:', err);
      setError('Failed to delete portfolio item');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="medium" className="mx-auto mb-4" />
        <p className="text-zero/60">Loading portfolio items...</p>
      </div>
    );
  }

  if (showForm) {
    return (
      <PortfolioForm
        item={editingItem}
        onSubmit={async () => {
          setShowForm(false);
          setEditingItem(null);
          await loadItems();
        }}
        onCancel={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-zero">Portfolio Management</h2>
        <button
          onClick={handleCreate}
          className="bg-fahrenheit text-white px-4 md:px-6 py-2.5 rounded-lg font-semibold hover:bg-fahrenheit/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">New Project</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-xl border border-zero/10 overflow-hidden hover:shadow-md transition-shadow ${
              item.is_visible === false ? 'opacity-60' : ''
            }`}
          >
            <div className="relative h-40 md:h-48 overflow-hidden">
              <img
                src={
                  item.image_url ||
                  'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400'
                }
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {item.is_featured && (
                <div className="absolute top-3 left-3 bg-sol text-zero px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Featured
                </div>
              )}
              {item.is_visible === false && (
                <div className="absolute top-3 right-3 bg-zero/80 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                  <EyeOff className="w-3 h-3" />
                  Hidden
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-base md:text-lg font-semibold text-zero mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-zero/60 text-xs md:text-sm mb-3 line-clamp-2">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-4">
                {(item.tech_stack || []).slice(0, 2).map((tech) => (
                  <span
                    key={tech}
                    className="bg-muted text-zero/70 px-2 py-1 rounded text-xs"
                  >
                    {tech}
                  </span>
                ))}
                {(item.tech_stack || []).length > 2 && (
                  <span className="text-zero/50 text-xs">
                    +{(item.tech_stack || []).length - 2}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-1 md:gap-2">
                  <button
                    onClick={() => handleToggleVisibility(item.id, item.is_visible ?? true)}
                    className={`p-2 rounded-lg transition-colors ${
                      item.is_visible !== false
                        ? 'hover:bg-orange-500/10 text-orange-500'
                        : 'hover:bg-green-500/10 text-green-500'
                    }`}
                    title={item.is_visible !== false ? 'Hide' : 'Show'}
                  >
                    {item.is_visible !== false ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded-lg hover:bg-zero/5 text-zero transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(item.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <a
                    href={`/portfolio/${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-zero/5 text-zero transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                </div>
                <span className="text-xs text-zero/40">#{item.sort_order}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <Upload className="w-16 h-16 text-zero/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-zero mb-2">No Portfolio Items</h3>
          <p className="text-zero/50 mb-6">Create your first portfolio project to get started.</p>
          <button
            onClick={handleCreate}
            className="bg-fahrenheit text-white px-6 py-3 rounded-lg font-semibold hover:bg-fahrenheit/90 transition-colors"
          >
            Add First Project
          </button>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-zero mb-4">Confirm Deletion</h3>
            <p className="text-zero/70 mb-6">
              Are you sure you want to delete this portfolio item? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(deleteConfirm)}
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
