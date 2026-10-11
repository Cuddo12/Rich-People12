import React from 'react';

interface PolicyPageProps {
  type: 'shipping' | 'returns' | 'faq' | 'privacy' | 'terms';
  navigate: (route: string, params?: any) => void;
}

export const PolicyPages: React.FC<PolicyPageProps> = ({ type, navigate }) => {
  const content = {
    shipping: {
      subtitle: 'Nationwide Logistics',
      title: 'Shipping & Delivery Policy',
      body: (
        <div className="space-y-6 text-xs text-zinc-300 leading-relaxed">
          <p>
            At Rich People, each garment is hand-inspected and pressed before dispatch from our Banani atelier. We partner with premier expedited logistics providers to ensure your attire arrives pristine.
          </p>
          <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-2">
            <h4 className="font-bold text-white text-sm">Delivery Timelines & Charges:</h4>
            <p>• <strong>Inside Dhaka Metropolitan:</strong> 24 to 48 Hours. Delivery charge is ৳80.</p>
            <p>• <strong>Outside Dhaka (All 64 Districts):</strong> 2 to 4 Business Days. Delivery charge is ৳150.</p>
            <p>• <strong>Free Shipping Threshold:</strong> All domestic orders equal to or exceeding ৳5,000 enjoy complimentary delivery.</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-2">
            <h4 className="font-bold text-white text-sm">Manual ৳200 Advance Requirement:</h4>
            <p>
              To confirm parcel booking, customers are requested to send ৳200 via bKash or Nagad Send Money. This amount is directly deducted from the total bill, leaving only the remaining balance payable via Cash on Delivery (COD).
            </p>
          </div>
        </div>
      ),
    },
    returns: {
      subtitle: 'Peace of Mind',
      title: 'Return & Exchange Policy',
      body: (
        <div className="space-y-6 text-xs text-zinc-300 leading-relaxed">
          <p>
            We take immense pride in our tailoring precision. However, if your selected size does not fit flawlessly, we offer a straightforward 7-day sizing exchange warranty.
          </p>
          <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-2">
            <h4 className="font-bold text-white text-sm">Exchange Conditions:</h4>
            <p>• Items must be unwashed, unworn, and retain all original Rich People brand tags and packaging.</p>
            <p>• Notification must be submitted within 7 days of parcel reception.</p>
            <p>• Sizing exchanges are processed promptly upon receipt of the returned garment.</p>
          </div>
          <p>
            To initiate an exchange, please contact our concierge via WhatsApp (+880 1712-345678) or email concierge@richpeople.fashion with your Order ID.
          </p>
        </div>
      ),
    },
    faq: {
      subtitle: 'Client Inquiries',
      title: 'Frequently Asked Questions',
      body: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-1.5">
            <h4 className="font-bold text-white text-sm">Why do I need to pay ৳200 advance?</h4>
            <p className="text-zinc-400">
              Courier parcel return fees are substantial for bespoke fashion brands. The ৳200 manual Send Money advance confirms buyer authenticity and is 100% deducted from your parcel's Cash on Delivery total.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-1.5">
            <h4 className="font-bold text-white text-sm">How do I verify which size to order?</h4>
            <p className="text-zinc-400">
              Each product page features an interactive Size Chart displaying Chest, Length, Shoulder, and Sleeve measurements in inches. If you fall between sizes, we recommend sizing up for casual shirts and staying true to size for tailored Panjabis.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 space-y-1.5">
            <h4 className="font-bold text-white text-sm">How can I track my parcel?</h4>
            <p className="text-zinc-400">
              Click "Track Order" in the navigation bar, input your Order ID (e.g. RP-2026-00001) and mobile number to see real-time updates from payment verification to courier dispatch.
            </p>
          </div>
        </div>
      ),
    },
    privacy: {
      subtitle: 'Data Integrity',
      title: 'Privacy Policy',
      body: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <p>
            Rich People respects your privacy. We collect client contact and shipping data solely to fulfill garment orders, verify bKash/Nagad transactions, and provide tracking alerts.
          </p>
          <p>
            We never trade, sell, or disclose client names, phone numbers, or delivery addresses to third-party marketing entities.
          </p>
        </div>
      ),
    },
    terms: {
      subtitle: 'Legal Framework',
      title: 'Terms of Service',
      body: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <p>
            By purchasing through Rich People, you agree to our standard terms of sale, including accurate disclosure of transaction identification and delivery recipient information.
          </p>
          <p>
            All content, photographic imagery, and brand marks are proprietary to Rich People Menswear Atelier.
          </p>
        </div>
      ),
    },
  }[type];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="border-b border-white/[0.08] pb-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#e11d48] font-bold">
          {content.subtitle}
        </span>
        <h1 className="text-3xl font-bold font-cinzel text-white mt-1">
          {content.title}
        </h1>
      </div>

      <div className="p-8 rounded-2xl bg-[#0f0f13] border border-white/[0.08]">
        {content.body}
      </div>
    </div>
  );
};
