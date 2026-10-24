'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Heart, 
  MessageSquare, 
  Eye, 
  Share2, 
  MoreVertical, 
  Bookmark, 
  Flag, 
  Code 
} from 'lucide-react';
import './template-layout.css';

export interface FeedCardItemProps {
  id: string;
  author: {
    name: string;
    avatarUrl?: string;
    subtitle?: string;
    roleBadge?: string;
  };
  title: string;
  content: React.ReactNode;
  tags?: string[];
  metrics?: {
    likes?: number;
    replies?: number;
    views?: string | number;
    shares?: number;
  };
  onLike?: (id: string) => void;
  onReply?: (id: string) => void;
  onShare?: (id: string) => void;
  options?: {
    label: string;
    onClick: (id: string) => void;
  }[];
}

export const FeedCardItem: React.FC<FeedCardItemProps> = ({
  id,
  author,
  title,
  content,
  tags = [],
  metrics = { likes: 0, replies: 0, views: '0', shares: 0 },
  onLike,
  onReply,
  onShare,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(metrics.likes || 0);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount(prev => Math.max(0, prev - 1));
    } else {
      setLiked(true);
      setLikesCount(prev => prev + 1);
    }
    onLike?.(id);
  };

  return (
    <article className="cf-template-card" id={`card-${id}`}>
      {/* Card Header */}
      <div className="cf-template-card-header">
        <div className="cf-template-card-author">
          {author.avatarUrl ? (
            <img
              src={author.avatarUrl}
              alt={author.name}
              style={{ width: '40px', height: '40px', borderRadius: '9999px', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '9999px',
              backgroundColor: 'var(--color-crimson)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '1rem',
            }}>
              {author.name.charAt(0)}
            </div>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {author.name}
              </span>
              {author.roleBadge && (
                <span style={{
                  fontSize: '0.6875rem',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--badge-bg)',
                  color: 'var(--color-crimson)',
                  fontWeight: 600,
                }}>
                  {author.roleBadge}
                </span>
              )}
            </div>
            {author.subtitle && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {author.subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Options Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Options"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                marginTop: '4px',
                width: '180px',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                padding: '4px 0',
                zIndex: 20,
              }}
            >
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Bookmark size={14} />
                <span>Save to favorites</span>
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Code size={14} />
                <span>Embed placement</span>
              </button>
              <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  fontSize: '0.8125rem',
                  color: 'var(--color-error)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Flag size={14} />
                <span>Report issue</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Title & Content */}
      <h3 style={{
        fontSize: '1.0625rem',
        fontWeight: 600,
        color: 'var(--text-primary)',
        marginBottom: '8px',
      }}>
        {title}
      </h3>

      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {content}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
          {tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.6875rem',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Card Action Bar */}
      <div className="cf-template-card-actions-bar">
        <div className="cf-template-stats-group">
          <button
            type="button"
            className="cf-template-stat-item"
            onClick={handleLike}
            style={{ color: liked ? 'var(--color-crimson)' : undefined }}
          >
            <Heart size={16} fill={liked ? 'var(--color-crimson)' : 'none'} />
            <span>{likesCount}</span>
          </button>

          <button
            type="button"
            className="cf-template-stat-item"
            onClick={() => onReply?.(id)}
          >
            <MessageSquare size={16} />
            <span>{metrics.replies ?? 0}</span>
          </button>

          <span className="cf-template-stat-item" style={{ cursor: 'default' }}>
            <Eye size={16} />
            <span>{metrics.views ?? 0}</span>
          </span>
        </div>

        <button
          type="button"
          className="cf-template-stat-item"
          onClick={() => onShare?.(id)}
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
};
