import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContactPage: React.FC = () => {
  const { settings } = useApp();
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Customer Support',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({
      name: '',
      email: '',
      phone: '',
      inquiryType: 'Customer Support',
      message: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase font-semibold tracking-wider text-[#8C7A6B]">
          Direct Factory Contact
        </span>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1E1E1E]">
          We’re Here to Help You Sleep Better
        </h1>
        <p className="text-sm text-[#524E48] leading-relaxed">
          Reach our mattress specialists for custom sizing questions, bulk hotel requirements, or warranty assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E8E3DC] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-serif-display text-xl font-bold text-[#1E1E1E]">
              Corporate &amp; Factory Headquarters
            </h3>

            <div className="space-y-4 text-xs text-[#524E48]">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#E8E3DC] flex items-center justify-center text-[#B88E2F] shrink-0">
                  <MapPin size={17} />
                </div>
                <div>
                  <span className="font-semibold text-[#1E1E1E] block">Manufacturing Plant &amp; Experience Studio:</span>
                  <p className="mt-0.5 leading-relaxed">
                    {settings.businessAddress}, {settings.city}, {settings.state} - {settings.pincode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#E8E3DC] flex items-center justify-center text-[#B88E2F] shrink-0">
                  <Phone size={17} />
                </div>
                <div>
                  <span className="font-semibold text-[#1E1E1E] block">Direct Toll-Free Line:</span>
                  <p className="mt-0.5">{settings.supportPhone}</p>
                  <p className="text-[11px] text-[#78716C]">Mon - Sat: 9:00 AM to 8:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#E8E3DC] flex items-center justify-center text-[#B88E2F] shrink-0">
                  <Mail size={17} />
                </div>
                <div>
                  <span className="font-semibold text-[#1E1E1E] block">Email Addresses:</span>
                  <p className="mt-0.5">Customer Care: {settings.supportEmail}</p>
                  <p className="text-[11px] text-[#78716C]">B2B &amp; Hotel Hospitality: b2b@dreamnestmattresses.com</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EFECE6] text-xs text-[#78716C]">
              <span className="font-semibold text-[#1E1E1E] block mb-1">Live Factory Showrooms:</span>
              <p>· Hyderabad: Cherlapally Plant &amp; Jubilee Hills Studio</p>
              <p>· Bengaluru: Indiranagar 100ft Road</p>
              <p>· Chennai: TTK Road, Alwarpet</p>
            </div>
          </div>
        </div>

        {/* Inquiry Form Column */}
        <div className="lg:col-span-7 bg-white border border-[#E8E3DC] rounded-3xl p-6 sm:p-8 shadow-xs">
          <h3 className="font-serif-display text-xl font-bold text-[#1E1E1E] mb-1">
            Send an Inquiry to Factory Engineers
          </h3>
          <p className="text-xs text-[#78716C] mb-6">
            We typically respond within 2 to 4 business hours.
          </p>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
              <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
              <h4 className="font-semibold text-sm text-emerald-900">Inquiry Received</h4>
              <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                Thank you! Our sleep engineer will call you back shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-semibold text-emerald-900 underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#524E48] block mb-1 font-medium">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3.5 py-2.5 focus:outline-[#1E1E1E]"
                  />
                </div>
                <div>
                  <label className="text-[#524E48] block mb-1 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="98490 00000"
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3.5 py-2.5 focus:outline-[#1E1E1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#524E48] block mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="ramesh@example.com"
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3.5 py-2.5 focus:outline-[#1E1E1E]"
                  />
                </div>
                <div>
                  <label className="text-[#524E48] block mb-1 font-medium">Inquiry Category</label>
                  <select
                    value={form.inquiryType}
                    onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3.5 py-2.5 focus:outline-[#1E1E1E]"
                  >
                    <option>Custom Mattress Sizing</option>
                    <option>Order &amp; Delivery Tracking</option>
                    <option>10-Year Warranty Claim</option>
                    <option>Hotel &amp; B2B Wholesale</option>
                    <option>Retail Dealership Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#524E48] block mb-1 font-medium">Detailed Message</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Specify length, width, firmness, or existing cot details..."
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3.5 py-2.5 focus:outline-[#1E1E1E]"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 bg-[#1E1E1E] hover:bg-[#33312E] text-white font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-2"
              >
                <Send size={14} />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
