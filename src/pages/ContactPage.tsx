import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      error('Please complete your name, email, and message.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success(data.message);
        setSubmitted(true);
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      } else {
        error(data.error || 'Failed to send message.');
      }
    } catch {
      error('Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#e11d48] font-bold">
          Client Concierge
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-cinzel text-white">
          Connect With Rich People Atelier
        </h1>
        <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
          For custom bridal & Eid group orders, sizing inquiries, or retail appointments in Banani, our concierge is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info (5 Cols) */}
        <div className="lg:col-span-5 p-8 rounded-2xl bg-[#0f0f13] border border-white/[0.08] space-y-8 h-fit">
          <h2 className="text-lg font-cinzel font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
            Atelier Headquarters
          </h2>

          <div className="space-y-6 text-xs text-zinc-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#831828]/20 flex items-center justify-center text-rose-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block text-sm mb-1 font-semibold">Flagship Atelier</strong>
                <p className="text-zinc-400 leading-relaxed">
                  Level 4, House 18, Road 11, Block D<br />
                  Banani, Dhaka-1213, Bangladesh
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#831828]/20 flex items-center justify-center text-rose-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block text-sm mb-1 font-semibold">Phone & WhatsApp</strong>
                <p className="text-zinc-400 font-mono">+880 1712-345678</p>
                <p className="text-zinc-500 text-[11px] mt-0.5">Direct helpline for order verification</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#831828]/20 flex items-center justify-center text-rose-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block text-sm mb-1 font-semibold">Email Concierge</strong>
                <p className="text-zinc-400 font-mono">concierge@richpeople.fashion</p>
                <p className="text-zinc-400 font-mono">orders@richpeople.com.bd</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#831828]/20 flex items-center justify-center text-rose-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white block text-sm mb-1 font-semibold">Hours of Operation</strong>
                <p className="text-zinc-400">Saturday – Thursday: 10:00 AM – 9:00 PM</p>
                <p className="text-zinc-400">Friday: 2:00 PM – 9:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7 p-8 rounded-2xl bg-[#0f0f13] border border-white/[0.08] space-y-6">
          <h2 className="text-lg font-cinzel font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
            Send a Concierge Message
          </h2>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-cinzel text-white">Message Dispatched</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Thank you for contacting Rich People. Our private concierge team will respond within 4 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-zinc-800 text-white text-xs uppercase tracking-wider rounded font-semibold"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Navid Chowdhury"
                    className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white focus:outline-none focus:border-white/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. navid@example.com"
                    className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white focus:outline-none focus:border-white/40"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Inquiry Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Custom Panjabi Length / Eid Order"
                    className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Message Details *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your requirements, sizing, or questions..."
                  rows={5}
                  className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white focus:outline-none focus:border-white/40"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#831828] hover:bg-[#991b1b] text-white text-xs font-bold uppercase tracking-[0.2em] rounded transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Transmitting Message...' : 'Transmit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
