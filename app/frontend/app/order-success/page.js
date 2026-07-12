'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageCircle, Sparkles, Package, ArrowRight } from 'lucide-react';
import Header from '@/components/site/Header';
import WhatsAppFloat from '@/components/site/WhatsAppFloat';

function Inner() {
  const search = useSearchParams();
  const id = search.get('id');
  const [order, setOrder] = useState(null);
  const [sentToWA, setSentToWA] = useState(false);
  const WA_NUM = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`).then(r => r.json()).then(d => setOrder(d.order));
  }, [id]);

  const buildWAMessage = (o) => {
    const c = o.customization;
    const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
    const photoUrl = c?.couplePhoto ? (c.couplePhoto.startsWith('http') ? c.couplePhoto : `${SITE_URL}${c.couplePhoto}`) : '';
    const customLines = c ? [
      `\n*\u2726 Customization Details:*`,
      `\u2022 Bride: ${c.brideName || '-'}`,
      `\u2022 Groom: ${c.groomName || '-'}`,
      c.weddingDate && `\u2022 Wedding Date: ${new Date(c.weddingDate).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})}`,
      c.familyName && `\u2022 Family: ${c.familyName}`,
      c.personalMessage && `\u2022 Message: "${c.personalMessage}"`,
      photoUrl && `\u2022 Couple Photo: ${photoUrl}`,
    ].filter(Boolean).join('\n') : '';
    return encodeURIComponent(
`*\u2726 NEW ORDER \u2014 Printalaram \u2726*

*Order #${o.orderNumber}*
Product: ${o.productName}
Quantity: ${o.quantity}
Total: \u20b9${o.total}
Payment: ${o.paymentMethod} (${o.paymentStatus === 'paid' ? '\u2713 PAID' : 'Pending'})
${o.razorpayPaymentId ? `Payment ID: ${o.razorpayPaymentId}` : ''}
${customLines}

*Delivery To:*
${o.customer.name}
\u260E ${o.customer.mobile} | WhatsApp: ${o.customer.whatsapp}
${o.customer.email || ''}
${o.customer.address}, ${o.customer.city}, ${o.customer.state} - ${o.customer.pincode}

Please confirm & share digital proof. Thank you!`
    );
  };

  useEffect(() => {
    // WhatsApp was already opened from the checkout page after payment.
    // Success page only shows the retry button — no auto re-open (to avoid double tabs).
  }, [order, WA_NUM]);

  if (!order) return <div className="min-h-screen flex items-center justify-center bg-cream text-plum font-display text-xl">Loading order…</div>;

  return (
    <div className="min-h-screen bg-cream paper-bg">
      <Header />
      <div className="container mx-auto px-6 py-12 max-w-2xl text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="w-24 h-24 mx-auto rounded-full bg-gold/20 flex items-center justify-center">
          <CheckCircle2 className="w-14 h-14 text-gold" />
        </motion.div>
        <h1 className="mt-6 font-display text-4xl md:text-5xl text-plum">Thank You!</h1>
        <p className="mt-2 text-plum/70 font-serif-elegant">Your order has been placed successfully.</p>
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-plum text-[#f0d68c] text-sm">
          <Sparkles className="w-4 h-4 text-gold" /> Order #{order.orderNumber}
        </div>

        <div className="mt-8 bg-white rounded-2xl p-6 border border-gold/20 shadow-sm text-left">
          <div className="flex gap-4">
            <div className="relative w-20 h-24 rounded-lg overflow-hidden"><Image src={order.productImage} alt="" fill className="object-cover" /></div>
            <div className="flex-1">
              <div className="font-display text-plum">{order.productName}</div>
              <div className="text-sm text-plum/60">Qty: {order.quantity} • Total: ₹{order.total}</div>
              {order.customization && (
                <div className="mt-1 text-xs text-gold">For: {order.customization.groomName} & {order.customization.brideName}</div>
              )}
            </div>
          </div>
        </div>

        <motion.a
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          href={`https://wa.me/${WA_NUM}?text=${buildWAMessage(order)}`}
          target="_blank" rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold transition"
          data-testid="order-success-whatsapp-button"
        >
          <MessageCircle className="w-5 h-5" /> Send Order Details on WhatsApp
        </motion.a>
        <p className="text-xs text-plum/50 mt-2">We’ve also opened WhatsApp automatically. If it didn’t open, click the button above.</p>

        <div className="mt-10 bg-ivory rounded-2xl p-6 border border-gold/20 text-left">
          <h3 className="font-display text-lg text-plum mb-3 flex items-center gap-2"><Package className="w-4 h-4 text-gold" /> What happens next?</h3>
          <ol className="space-y-2 text-sm text-plum/80">
            <li>1. We’ll review your order and customization within 6 hours.</li>
            <li>2. You’ll receive a high-resolution digital proof on WhatsApp.</li>
            <li>3. Once you approve, we print &amp; dispatch within 72 hours.</li>
            <li>4. Track your shipment until your envelopes reach your doorstep.</li>
          </ol>
        </div>

        <Link href="/" className="mt-8 inline-flex items-center gap-1 text-plum hover:text-gold text-sm">Continue shopping <ArrowRight className="w-4 h-4" /></Link>
      </div>
      <WhatsAppFloat />
    </div>
  );
}

export default function OrderSuccess() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-cream text-plum font-display text-xl">Loading…</div>}><Inner /></Suspense>;
}
