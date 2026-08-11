'use client';

import { useState, useEffect } from 'react';

interface Message {
  roomId: string;
  senderId: string;
  message: string;
  timestamp: string;
}

export default function ChatPage() {
  const [activeRoom, setActiveRoom] = useState('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userId] = useState(() => 'user_' + Math.random().toString(36).substring(2, 7));

  const rooms = [
    { id: 'general', name: 'General Lounge' },
    { id: 'engineering', name: 'Engineering & Tech' },
    { id: 'announcements', name: 'Ecosystem Updates' },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: Message = {
      roomId: activeRoom,
      senderId: userId,
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
  };

  return (
    <>
      <div className="sidebar">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', fontWeight: '700', fontSize: '18px', background: 'linear-gradient(to right, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CrimFig Chat
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '4px' }}>CHANNELS</div>
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeRoom === room.id ? 'var(--accent-purple)' : 'transparent',
                color: activeRoom === room.id ? 'white' : 'var(--text-muted)',
                textAlign: 'left',
                fontWeight: activeRoom === room.id ? '600' : '400',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
            >
              # {room.name}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-main">
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', fontWeight: '600', fontSize: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div># {rooms.find((r) => r.id === activeRoom)?.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Online as <span style={{ color: '#a78bfa' }}>{userId}</span></div>
        </div>

        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {messages.filter((m) => m.roomId === activeRoom).length === 0 ? (
            <div style={{ margin: 'auto', color: 'var(--text-muted)', fontSize: '14px' }}>
              No messages yet in #{activeRoom}. Send the first message!
            </div>
          ) : (
            messages.filter((m) => m.roomId === activeRoom).map((msg, idx) => (
              <div key={idx} className={`message-bubble ${msg.senderId === userId ? 'message-mine' : 'message-other'}`}>
                <div>{msg.message}</div>
                <div style={{ fontSize: '10px', opacity: 0.7, textAlign: 'right', marginTop: '4px' }}>{msg.timestamp}</div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSend} style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder={`Message #${activeRoom}...`}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}
