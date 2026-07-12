import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import WhatsAppFloat from '@/components/site/WhatsAppFloat';
import { Truck, Clock, MapPin, RotateCcw, ShieldCheck, MessageCircle, Package, IndianRupee, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Return Policy — Printalaram',
  description: 'Pan-India shipping, delivery timelines, and our transparent return, exchange & reprint policy for Printalaram Shagun Lifafa.',
};

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-cream paper-bg">
      <Header />
      <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 max-w-4xl">
        <div className="text-center mb-10 sm:mb-12">
          <div className="ornate-divider mb-4"><span className="text-xs tracking-[0.3em] uppercase">Policies</span></div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-plum">Shipping &amp; Return Policy</h1>
          <p className="mt-3 text-plum/60 font-serif-elegant">Hand-crafted with care — delivered with love across India.</p>
        </div>

        {/* SHIPPING */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold/20 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-plum text-[#f0d68c] flex items-center justify-center border border-gold/40 flex-shrink-0"><Truck className="w-5 h-5" /></div>
            <h2 className="font-display text-2xl sm:text-3xl text-plum">Shipping Policy</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <PolicyCard icon={MapPin} title="Delivery Coverage">
              We ship across <strong>all 28 states and 8 union territories of India</strong>. Every PIN code is serviceable — from metro cities to smaller towns. Currently we do not ship internationally; for special international requirements please WhatsApp us and we&apos;ll arrange a custom quote.
            </PolicyCard>

            <PolicyCard icon={Clock} title="Order Processing Time">
              <ul className="space-y-1">
                <li>• <strong>Design proof</strong> shared on WhatsApp within 6 working hours of your order</li>
                <li>• <strong>Printing &amp; finishing</strong>: 3–4 working days after your proof approval</li>
                <li>• <strong>Bulk orders</strong> (100+ pieces): 5–7 working days</li>
              </ul>
            </PolicyCard>

            <PolicyCard icon={Package} title="Delivery Timeline">
              <ul className="space-y-1">
                <li>• Metro cities: <strong>3–5 working days</strong> after dispatch</li>
                <li>• Tier-2 &amp; tier-3 cities: <strong>5–7 working days</strong></li>
                <li>• Remote PIN codes: 7–10 working days</li>
                <li>• Total end-to-end: <strong>7–10 days for most orders</strong></li>
              </ul>
            </PolicyCard>

            <PolicyCard icon={IndianRupee} title="Shipping Charges">
              <ul className="space-y-1">
                <li>• Orders below ₹999: flat <strong>₹49</strong></li>
                <li>• Orders ₹999 and above: <strong className="text-gold">FREE Shipping</strong></li>
                <li>• Bulk orders (250+ pcs): always free</li>
                <li>• Express same-day dispatch (metros): ₹199 extra</li>
              </ul>
            </PolicyCard>

            <PolicyCard icon={ShieldCheck} title="Tracking &amp; Logistics Partners">
              Every parcel is shipped through trusted courier partners including <strong>Delhivery, BlueDart, DTDC and India Post</strong>. A tracking link is sent on WhatsApp and email the moment your package leaves our studio.
            </PolicyCard>

            <PolicyCard icon={AlertCircle} title="Undelivered / RTO Orders">
              If a package is returned to us due to incorrect address, unavailability at delivery, or refusal to accept, we&apos;ll reach out on WhatsApp. Re-shipping charges (₹49) may apply. Please double-check your address &amp; PIN code at checkout.
            </PolicyCard>
          </div>
        </div>

        {/* RETURNS */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gold/20 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-plum text-[#f0d68c] flex items-center justify-center border border-gold/40 flex-shrink-0"><RotateCcw className="w-5 h-5" /></div>
            <h2 className="font-display text-2xl sm:text-3xl text-plum">Return &amp; Exchange Policy</h2>
          </div>

          <div className="text-plum/80 leading-relaxed space-y-5 text-sm sm:text-base">
            <p>Every Printalaram lifafa is <strong>personalised and printed to order</strong>. Because your names, dates, and messages are unique to you, our return policy is built around a promise: <em>if what arrives isn&apos;t perfect, we will make it right.</em></p>

            <div className="p-5 rounded-xl bg-gold/10 border border-gold/30">
              <h3 className="font-display text-lg text-plum mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gold" /> Our 100% Reprint Promise</h3>
              <p>If your envelopes arrive with a <strong>printing defect, spelling error on our part, wrong colour, damaged packaging, or physical damage during transit</strong>, we will reprint and resend the entire batch <strong>free of cost</strong>. Just message us on WhatsApp within <strong>48 hours of delivery</strong> with clear photos, and we&apos;ll dispatch a fresh batch within 3–4 working days.</p>
            </div>

            <div>
              <h3 className="font-display text-lg text-plum mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> We Will Reprint / Refund If:</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>The envelope has a printing defect (blurred print, misaligned print, missing colour)</li>
                <li>The names, date, or details differ from your approved digital proof</li>
                <li>The parcel arrives damaged, torn, or wet</li>
                <li>Fewer envelopes are delivered than what you paid for</li>
                <li>Wrong product was shipped by mistake</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg text-plum mb-3 flex items-center gap-2"><XCircle className="w-4 h-4 text-rose-500" /> Returns Are NOT Possible For:</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Change of mind</strong> — since every product is personalised and cannot be resold</li>
                <li>Errors in details <strong>after you have approved the digital proof</strong> (please review carefully!)</li>
                <li>Minor colour variations of ±5% between screen and print (a normal industry tolerance)</li>
                <li>Slight paper texture differences between production batches</li>
                <li>Complaints raised after 48 hours from delivery date</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg text-plum mb-3">How to Request a Reprint or Refund</h3>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>WhatsApp us at <strong>+91 99045 51144</strong> within 48 hours of delivery.</li>
                <li>Share your order number (e.g. PRT12345678) and clear photos of the defect / damage.</li>
                <li>Our team reviews and confirms eligibility within 12 working hours.</li>
                <li>Approved reprints are produced and dispatched within 3–4 working days at no extra charge.</li>
                <li>For eligible refunds, the amount is transferred back to your original payment method within 5–7 working days.</li>
              </ol>
            </div>

            <div>
              <h3 className="font-display text-lg text-plum mb-3">Order Cancellation</h3>
              <p>You may cancel your order for a <strong>100% refund</strong> as long as we have not yet started printing. Once you have <strong>approved the digital proof on WhatsApp</strong>, cancellation is not possible because production begins immediately. If cancellation is requested after approval but before dispatch, a 40% design &amp; production fee will be retained and the balance refunded.</p>
            </div>

            <div>
              <h3 className="font-display text-lg text-plum mb-3">Exchanges</h3>
              <p>Since each order is custom-made to your specifications, we do not offer exchanges for a different design. However, if you notice a mistake in the details before approving the digital proof, we&apos;ll happily update it and share a revised proof at no additional cost.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-plum-deep rounded-2xl p-6 sm:p-8 border border-gold/30 text-[#f0d68c]">
          <h3 className="font-display text-xl sm:text-2xl gold-text">Have a question?</h3>
          <p className="mt-2 text-sm opacity-80">Our team is one WhatsApp message away. Average reply time: under 30 minutes.</p>
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919904551144'}?text=${encodeURIComponent('Hi Printalaram, I have a question about shipping/returns.')}`} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold transition">
            <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
          </a>
        </div>
      </section>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

function PolicyCard({ icon: Icon, title, children }) {
  return (
    <div className="p-5 rounded-xl bg-ivory border border-gold/20">
      <div className="flex items-center gap-2 text-gold text-xs tracking-[0.2em] uppercase mb-2">
        <Icon className="w-3.5 h-3.5" /> {title}
      </div>
      <div className="text-plum/80 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
