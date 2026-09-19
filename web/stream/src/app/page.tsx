'use client';

export default function StreamSplashScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background cyan/indigo radial glow */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '520px',
        height: '520px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(55px)',
      }} />

      <div className="glass-panel" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '48px 40px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Status Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#22d3ee',
          marginBottom: '28px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}>
          <div className="status-dot" />
          <span>Broadcasting Pipeline In Progress</span>
        </div>

        {/* Icon & Title */}
        <div style={{
          fontSize: '44px',
          marginBottom: '16px',
        }}>
          📡
        </div>

        <h1 style={{
          fontSize: '36px',
          fontWeight: '800',
          letterSpacing: '-0.5px',
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #ffffff 40%, #38bdf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          CrimFig Stream
        </h1>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '32px',
        }}>
          High-performance real-time WebRTC & RTMP live video broadcasting, interactive audience engagement, and creator studio.
        </p>

        {/* Feature Tags */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '36px',
        }}>
          {['Sub-Second Latency', 'RTMP & WebRTC Ingestion', 'Interactive Chat Integration', 'Adaptive Bitrate HLS'].map((feat) => (
            <span key={feat} style={{
              fontSize: '12px',
              color: '#e2e8f0',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              padding: '6px 12px',
              borderRadius: '8px',
            }}>
              {feat}
            </span>
          ))}
        </div>

        {/* Ecosystem Nav Links */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          fontSize: '13px',
        }}>
          <a href="https://auth.crimfig.com" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            Central Auth
          </a>
          <span style={{ color: 'var(--border-color)' }}>•</span>
          <a href="https://ads.crimfig.com" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            Ads Portal
          </a>
          <span style={{ color: 'var(--border-color)' }}>•</span>
          <a href="https://chat.crimfig.com" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            Live Chat
          </a>
        </div>
      </div>
    </div>
  );
}
