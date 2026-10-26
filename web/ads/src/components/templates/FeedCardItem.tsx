'use client';

import React from 'react';
import { Heart, MessageSquare, Eye, Share2, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
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
  options = [],
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
        {options.length > 0 && <div style={{ position: 'relative' }}>
          <Button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            variant="ghost"
            size="icon"
            aria-label="More post actions"
            aria-expanded={menuOpen}
            aria-controls={`post-actions-${id}`}
          >
            <MoreVertical size={16} />
          </Button>

          {menuOpen && (
            <div
              id={`post-actions-${id}`}
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
              {options.map((option) => (
                <Button
                  key={option.label}
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    option.onClick(id);
                    setMenuOpen(false);
                  }}
                  style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0 }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}
        </div>}
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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="cf-template-stat-item"
            onClick={handleLike}
            aria-label={`${liked ? 'Unlike' : 'Like'} ${title}`}
            aria-pressed={liked}
            style={{ color: liked ? 'var(--color-crimson)' : undefined }}
          >
            <Heart size={16} fill={liked ? 'var(--color-crimson)' : 'none'} />
            <span>{likesCount}</span>
          </Button>

          {onReply && <Button
            type="button"
            variant="ghost"
            size="sm"
            className="cf-template-stat-item"
            onClick={() => onReply(id)}
          >
            <MessageSquare size={16} />
            <span>{metrics.replies ?? 0}</span>
          </Button>}

          <span className="cf-template-stat-item" style={{ cursor: 'default' }}>
            <Eye size={16} />
            <span>{metrics.views ?? 0}</span>
          </span>
        </div>

        {onShare && <Button
          type="button"
          variant="ghost"
          size="sm"
          className="cf-template-stat-item"
          onClick={() => onShare(id)}
        >
          <Share2 size={16} />
          <span>Share</span>
        </Button>}
      </div>
    </article>
  );
};
