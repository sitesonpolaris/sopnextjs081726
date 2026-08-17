'use client';

import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Eye, Star, Calendar, User } from 'lucide-react';
import { blogAPI, type BlogPost } from '@/lib/admin-data';
import BlogForm from './BlogForm';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await blogAPI.getAll();
      setPosts(data);
    } catch (err) {
      setError('Failed to load blog posts');
      console.error('Error loading blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await blogAPI.delete(id);
      await loadPosts();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting blog post:', err);
      setError('Failed to delete blog post');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="medium" className="mx-auto mb-4" />
        <p className="text-zero/60">Loading blog posts...</p>
      </div>
    );
  }

  if (showForm) {
    return (
      <BlogForm
        post={editingPost}
        onSubmit={async () => {
          setShowForm(false);
          setEditingPost(null);
          await loadPosts();
        }}
        onCancel={() => {
          setShowForm(false);
          setEditingPost(null);
        }}
      />
    );
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-zero">Blog Management</h2>
        <button
          onClick={handleCreate}
          className="bg-fahrenheit text-white px-4 md:px-6 py-2.5 rounded-lg font-semibold hover:bg-fahrenheit/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">New Post</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl border border-zero/10 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-40 md:h-48 overflow-hidden">
              <img
                src={
                  post.image_url ||
                  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400'
                }
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {post.featured && (
                <div className="absolute top-3 left-3 bg-sol text-zero px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Featured
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className="bg-black/50 text-white px-2 py-1 rounded-lg text-xs">
                  {post.category}
                </span>
              </div>
              <div className="absolute bottom-3 left-3">
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                    post.published
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-base md:text-lg font-semibold text-zero mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-zero/60 text-xs md:text-sm mb-3 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center gap-3 mb-3 text-xs text-zero/50">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(post.created_at)}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {(post.tags || []).slice(0, 2).map((tag) => (
                  <span key={tag} className="bg-muted text-zero/70 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
                {(post.tags || []).length > 2 && (
                  <span className="text-zero/40 text-xs">+{(post.tags || []).length - 2}</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-1 md:gap-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-2 rounded-lg hover:bg-zero/5 text-zero transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(post.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-zero/5 text-zero transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                </div>
                <span className="text-xs text-zero/40">#{post.sort_order}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <Plus className="w-16 h-16 text-zero/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-zero mb-2">No Blog Posts</h3>
          <p className="text-zero/50 mb-6">Create your first blog post to get started.</p>
          <button
            onClick={handleCreate}
            className="bg-fahrenheit text-white px-6 py-3 rounded-lg font-semibold hover:bg-fahrenheit/90 transition-colors"
          >
            Create First Post
          </button>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-zero mb-4">Confirm Deletion</h3>
            <p className="text-zero/70 mb-6">
              Are you sure you want to delete this blog post? This action cannot be undone.
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
