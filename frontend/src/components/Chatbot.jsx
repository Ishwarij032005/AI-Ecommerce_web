import React, { useState } from 'react';
import API from '../api/api';

export default function Chatbot() {
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hi! I am your shopping assistant. Ask for recommendations or help.' }]);
  const [input, setInput] = useState('');
  const send = async () => {
    if (!input) return;
    setMessages(m => [...m, { from: 'user', text: input }]);
    try {
      const res = await API.post('/ai/chat', { message: input });
      setMessages(m => [...m, { from: 'bot', text: res.data.reply }]);
    } catch {
      setMessages(m => [...m, { from: 'bot', text: 'AI error. Try again later.' }]);
    } finally {
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white border rounded shadow-lg flex flex-col overflow-hidden">
      <div className="bg-indigo-600 text-white p-2">AI Chat</div>
      <div className="p-3 h-56 overflow-auto">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.from === 'bot' ? 'text-left' : 'text-right'}`}>
            <div className={`inline-block px-3 py-1 rounded ${m.from === 'bot' ? 'bg-gray-100' : 'bg-indigo-50'}`}>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="p-2 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 border rounded px-2" placeholder="Ask..." onKeyDown={e => { if (e.key === 'Enter') send(); }} />
        <button onClick={send} className="bg-indigo-600 text-white px-3 rounded">Send</button>
      </div>
    </div>
  );
}
