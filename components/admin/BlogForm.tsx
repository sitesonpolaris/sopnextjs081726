'use client';

import { useState, useEffect } from 'react';
import { Save, X, Plus } from 'lucide-react';
import { blogAPI, type BlogPost } from '@/lib/admin-data';
import FileUpload from './FileUpload';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface BlogFormProps {
  post?: BlogPost | null;
  onSubmit: () => void;
  onCancel: () => void;
}

const categories = [
  'Case Studies',
  'Web Design Tips',
  'SEO Strategies',
  'Charlotte Business',
  'Industry News',
  'Client Success Stories',
];

export default function BlogForm({ post, onSubmit, onCancel }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Jesse Shepeard',
    category: '',
    tags: [] as string[],
    image_url: '',
    featured: false,
    published: true,
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    read_time: '5 min read',
    sort_order: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        category: post.category,
        tags: post.tags || [],
        image_url: post.image_url || '',
        featured: post.featured,
        published: post.published,
        seo_title: post.seo_title || '',
        seo_description: post.seo_description || '',
        seo_keywords: post.seo_keywords || '',
        read_time: post.read_time,
        sort_order: post.sort_order,
      });
    }
  }, [post]);

  useEffect(() => {
    if (formData.title && !post) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (post) {
        await blogAPI.update(post.id, formData);
      } else {
        await blogAPI.create(formData);
      }
      onSubmit();
    } catch (err) {
      console.error('Error saving blog post:', err);
      setError(err instanceof Error ? err.message : 'Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-zero/15 bg-white text-zero focus:outline-none focus:ring-2 focus:ring-fahrenheit focus:border-transparent';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-zero">
          {post ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-zero/5 transition-colors">
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zero mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className={inputClass}
                placeholder="Enter blog post title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className={inputClass}
                placeholder="url-friendly-slug"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className={inputClass}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                className={inputClass}
                placeholder="Author name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Read Time</label>
              <input
                type="text"
                value={formData.read_time}
                onChange={(e) => setFormData((prev) => ({ ...prev, read_time: e.target.value }))}
                className={inputClass}
                placeholder="5 min read"
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-fahrenheit focus:ring-fahrenheit"
                />
                <span className="text-sm font-medium text-zero">Featured Post</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, published: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-fahrenheit focus:ring-fahrenheit"
                />
                <span className="text-sm font-medium text-zero">Published</span>
              </label>
            </div>
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
          <div className="mt-4">
            <label className="block text-sm font-medium text-zero mb-2">Excerpt *</label>
            <textarea
              required
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              className={`${inputClass} resize-y`}
              placeholder="Brief description of the blog post"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zero/10 p-6">
          <h3 className="text-lg font-semibold text-zero mb-4">Featured Image</h3>
          <FileUpload
            onUpload={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
            accept="image/*"
            maxSize={10}
            folder="blog/images"
            placeholder="Upload featured image"
            currentUrl={formData.image_url}
          />
        </div>

        <div className="bg-white rounded-xl border border-zero/10 p-6">
          <h3 className="text-lg font-semibold text-zero mb-4">Tags</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className={inputClass}
              placeholder="Add tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-fahrenheit/10 text-fahrenheit px-3 py-1 rounded-lg"
              >
                <span className="text-sm">{tag}</span>
                <button type="button" onClick={() => removeTag(index)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zero/10 p-6">
          <h3 className="text-lg font-semibold text-zero mb-4">Content</h3>
          <textarea
            required
            rows={20}
            value={formData.content}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            className={`${inputClass} font-mono text-sm resize-y`}
            placeholder="Write your blog post content in HTML..."
          />
          <p className="text-xs text-zero/40 mt-2">
            Use HTML tags: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;
          </p>
        </div>

        <div className="bg-white rounded-xl border border-zero/10 p-6">
          <h3 className="text-lg font-semibold text-zero mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zero mb-2">SEO Title</label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, seo_title: e.target.value }))
                }
                className={inputClass}
                placeholder="SEO optimized title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">SEO Description</label>
              <textarea
                rows={3}
                value={formData.seo_description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, seo_description: e.target.value }))
                }
                className={`${inputClass} resize-y`}
                placeholder="SEO meta description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zero mb-2">SEO Keywords</label>
              <input
                type="text"
                value={formData.seo_keywords}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, seo_keywords: e.target.value }))
                }
                className={inputClass}
                placeholder="keyword1, keyword2, keyword3"
              />
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
                {post ? 'Update Post' : 'Create Post'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
