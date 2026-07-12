'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, MessageCircle, Lock, CheckCircle2, Sparkles, CreditCard, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/site/Header';
import WhatsAppFloat from '@/components/site/WhatsAppFloat';
import { DEFAULT_QTY, getUnitPrice } from '@/lib/pricing';

const WA_NUM = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919904551144';
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

function buildWAMessage(order) {
  const c = order.customization;
  const photoUrl = c?.couplePhoto ? (c.couplePhoto.startsWith('http') ? c.couplePhoto : `${SITE_URL}${c.couplePhoto}`) : '';
  const customLines = c ? [
    `\n*\u2726 Customization Details:*`,
    `\u2022 Name: ${c.name || '-'}`,
    c.familyName && `\u2022 Family: ${c.familyName}`,
    photoUrl && `\u2022 Photo: ${photoUrl}`,
  ].filter(Boolean).join('\n') : '';
  return encodeURIComponent(
`*\u2726 NEW ORDER \u2014 Printalaram \u2726*

*Order #${order.orderNumber}*
Product: ${order.productName}
Quantity: ${order.quantity}
Price/pc: \u20b9${order.price}
*Total: \u20b9${order.total}*

*Payment:* ${order.paymentMethod === 'RAZORPAY' ? 'Online via Razorpay' : order.paymentMethod} (${order.paymentStatus === 'paid' ? '\u2713 PAID' : 'Pending'})
${order.razorpayPaymentId ? `Payment ID: ${order.razorpayPaymentId}` : ''}
${customLines}

*Delivery To:*
${order.customer.name}
\u2022 Mobile: ${order.customer.mobile}
\u2022 WhatsApp: ${order.customer.whatsapp}
${order.customer.email ? `Email: ${order.customer.email}` : ''}
${order.customer.address}
${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}

Please confirm & share digital proof. Thank you!`
  );
}

function loadRazorpayScript() {
  return new Promise(resolve => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) { existing.addEventListener('load', () => resolve(true)); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function CheckoutInner() {
  const router = useRouter();
  const search = useSearchParams();
  const productId = search.get('product');
  const qty = parseInt(search.get('qty') || String(DEFAULT_QTY));
  const customizationId = search.get('customization');

  const [product, setProduct] = useState(null);
  const [customization, setCustomization] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState('info'); // 'info' | 'payment'

  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '',
    address: '', apartment: '', city: '', state: '', pincode: '',
    phone: '', whatsapp: '',
    emailOffers: true, smsOffers: false, saveInfo: false,
    paymentMethod: 'RAZORPAY',
  });

  useEffect(() => {
    if (productId) fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`).then(r => r.json()).then(d => setProduct(d.product));
    if (customizationId) fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customizations/${customizationId}`).then(r => r.json()).then(d => setCustomization(d.customization));
  }, [productId, customizationId]);

  if (!product) return <div className="min-h-screen flex items-center justify-center bg-cream text-plum font-display text-xl">Loading…</div>;

  const unitPrice = getUnitPrice(qty);
  const subtotal = unitPrice * qty;
  const addressComplete = Boolean(form.city && form.state && form.pincode);
  const shipping = addressComplete ? (subtotal >= 999 ? 0 : 49) : null;
  const total = subtotal + (shipping || 0);
  const setF = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const goToPayment = () => {
    const required = ['firstName', 'lastName', 'phone', 'whatsapp', 'address', 'city', 'state', 'pincode'];
    for (const f of required) if (!form[f]) { toast.error('Please fill all required fields'); return; }
    if (form.phone.length < 10) { toast.error('Enter a valid phone number'); return; }
    setStep('payment');
  };

  const redirectToWhatsAppAndSuccess = (order) => {
    const waUrl = `https://wa.me/${WA_NUM}?text=${buildWAMessage(order)}`;
    window.open(waUrl, '_blank');
    router.push('/');
  };

  const createOrderRecord = async () => {
    const fullAddress = form.apartment ? `${form.address}, ${form.apartment}` : form.address;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id, productName: product.name, productImage: product.image,
        customization, quantity: qty, price: unitPrice, total,
        customerName: `${form.firstName} ${form.lastName}`.trim(),
        mobile: form.phone, whatsapp: form.whatsapp, email: form.email,
        address: fullAddress, city: form.city, state: form.state, pincode: form.pincode,
        paymentMethod: form.paymentMethod,
      }),
    });
    const data = await res.json();
    return data.order;
  };

  const placeOrder = async () => {
    setSubmitting(true);
    try {
      const order = await createOrderRecord();
      if (!order?.id) { toast.error('Order creation failed'); setSubmitting(false); return; }

      // Since we removed COD, we always process payment through Razorpay
      const rzpRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, amount: total }),
      });
      const rzpData = await rzpRes.json();

      if (rzpData.simulated) {
        toast.info('💳 Test payment simulated successfully');
        await new Promise(r => setTimeout(r, 1200));
        const sim = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/simulate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id }),
        }).then(r => r.json());
        if (sim.success) {
          toast.success('✅ Payment received! Opening WhatsApp…');
          redirectToWhatsAppAndSuccess(sim.order);
        } else { toast.error('Payment simulation failed'); setSubmitting(false); }
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) { toast.error('Could not load Razorpay'); setSubmitting(false); return; }

      const options = {
        key: rzpData.keyId,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: 'Printalaram',
        description: `${product.name} × ${qty}`,
        order_id: rzpData.razorpayOrderId,
        prefill: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#3a0a2a' },
        handler: async (response) => {
          const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order.id,
            }),
          });
          const v = await verifyRes.json();
          if (v.success) {
            toast.success('✅ Payment successful! Opening WhatsApp…');
            redirectToWhatsAppAndSuccess(v.order);
          } else {
            toast.error('Payment verification failed');
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => { toast.info('Payment cancelled'); setSubmitting(false); },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => { toast.error('Payment failed. Try again.'); setSubmitting(false); });
      rzp.open();
    } catch (e) {
      console.error(e);
      toast.error('Something went wrong.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream paper-bg">
      <Header />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-display text-3xl md:text-4xl text-plum text-center mb-2">Secure Checkout</h1>
        <p className="text-center text-plum/60 text-sm mb-8 flex items-center justify-center gap-2"><Lock className="w-3.5 h-3.5" /> Your details are safe with us</p>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-6">
            {step === 'info' ? (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gold/20 shadow-sm" data-testid="checkout-info-step">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl text-plum">Contact</h2>
                </div>
                <Field label="Email" type="email" value={form.email} onChange={v => setF('email', v)} placeholder="you@example.com" testId="checkout-email-input" />
                <label className="flex items-center gap-2 mt-3 text-sm text-plum/70 cursor-pointer">
                  <input type="checkbox" checked={form.emailOffers} onChange={e => setF('emailOffers', e.target.checked)} className="accent-[#c9a961] w-4 h-4" data-testid="checkout-email-offers-checkbox" />
                  Email me with news and offers
                </label>

                <h2 className="font-display text-xl text-plum mt-8 mb-4">Delivery</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs tracking-[0.2em] uppercase text-plum/70 mb-1.5 block">Country/Region</label>
                    <div className="w-full px-4 py-3 rounded-xl bg-ivory border border-gold/30 text-plum" data-testid="checkout-country-field">India</div>
                  </div>
                  <Field label="First Name *" value={form.firstName} onChange={v => setF('firstName', v)} placeholder="First name" testId="checkout-first-name-input" />
                  <Field label="Last Name *" value={form.lastName} onChange={v => setF('lastName', v)} placeholder="Last name" testId="checkout-last-name-input" />
                  <div className="md:col-span-2">
                    <Field label="Address *" value={form.address} onChange={v => setF('address', v)} placeholder="House no., street, area, landmark" testId="checkout-address-input" />
                  </div>
                  <div className="md:col-span-2">
                    <Field label="Apartment, suite, etc. (optional)" value={form.apartment} onChange={v => setF('apartment', v)} placeholder="Apartment, suite, etc." testId="checkout-apartment-input" />
                  </div>
                  <Field label="City *" value={form.city} onChange={v => setF('city', v)} placeholder="Mumbai" testId="checkout-city-input" />
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-plum/70 mb-1.5 block">State *</label>
                    <select value={form.state} onChange={e => setF('state', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-ivory border border-gold/30 focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none text-plum" data-testid="checkout-state-select">
                      <option value="">Select state</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <Field label="PIN Code *" value={form.pincode} onChange={v => setF('pincode', v.replace(/\D/g,'').slice(0,6))} placeholder="400001" testId="checkout-pincode-input" />
                  <Field label="Phone *" value={form.phone} onChange={v => setF('phone', v.replace(/\D/g,'').slice(0,10))} placeholder="10-digit" testId="checkout-mobile-input" />
                  <Field label="WhatsApp Number *" value={form.whatsapp} onChange={v => setF('whatsapp', v.replace(/\D/g,'').slice(0,10))} placeholder="For order updates" testId="checkout-whatsapp-input" />
                </div>
                <label className="flex items-center gap-2 mt-4 text-sm text-plum/70 cursor-pointer">
                  <input type="checkbox" checked={form.saveInfo} onChange={e => setF('saveInfo', e.target.checked)} className="accent-[#c9a961] w-4 h-4" data-testid="checkout-save-info-checkbox" />
                  Save this information for next time
                </label>
                <label className="flex items-center gap-2 mt-2 text-sm text-plum/70 cursor-pointer">
                  <input type="checkbox" checked={form.smsOffers} onChange={e => setF('smsOffers', e.target.checked)} className="accent-[#c9a961] w-4 h-4" data-testid="checkout-sms-offers-checkbox" />
                  Text me with news and offers
                </label>

                <button onClick={goToPayment} className="mt-6 w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-br from-[#3a0a2a] to-[#2a0620] text-[#f0d68c] font-bold hover:shadow-xl border border-gold/40 transition flex items-center justify-center gap-2" data-testid="checkout-continue-button">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gold/20 shadow-sm" data-testid="checkout-payment-step">
                <div className="flex items-start justify-between gap-3 pb-4 mb-4 border-b border-gold/10">
                  <div className="text-sm text-plum/70">
                    <span className="text-plum font-medium">{form.firstName} {form.lastName}</span> · {form.phone}<br/>
                    {form.address}{form.apartment ? `, ${form.apartment}` : ''}, {form.city}, {form.state} - {form.pincode}
                  </div>
                  <button onClick={() => setStep('info')} className="flex items-center gap-1 text-xs text-gold hover:text-plum flex-shrink-0" data-testid="checkout-edit-info-button">
                    <Pencil className="w-3.5 h-3.5" /> Change
                  </button>
                </div>
                <h2 className="font-display text-xl text-plum mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${form.paymentMethod === 'RAZORPAY' ? 'border-gold bg-gold/10' : 'border-gold/20 hover:border-gold/40'}`} data-testid="checkout-payment-razorpay-option">
                    <input type="radio" checked={form.paymentMethod === 'RAZORPAY'} onChange={() => setF('paymentMethod', 'RAZORPAY')} className="accent-[#c9a961] mt-1" />
                    <div className="flex-1">
                      <div className="font-display text-plum flex items-center gap-2"><CreditCard className="w-4 h-4 text-gold" /> Pay Online via Razorpay (Test Mode)</div>
                      <div className="text-xs text-plum/60 mt-1">UPI · Cards · NetBanking · Wallets</div>
                    </div>
                  </label>
                </div>
                <button onClick={placeOrder} disabled={submitting} className="mt-6 w-full px-6 py-4 rounded-full bg-gradient-to-br from-[#3a0a2a] to-[#2a0620] text-[#f0d68c] font-bold hover:shadow-xl border border-gold/40 disabled:opacity-60 transition flex items-center justify-center gap-2" data-testid="checkout-place-order-button">
                  {submitting ? 'Processing…' : (<>Pay ₹{total.toLocaleString('en-IN')} & Place Order <ArrowRight className="w-4 h-4" /></>)}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gold/20 shadow-sm h-fit lg:sticky lg:top-24">
            <h2 className="font-display text-xl text-plum mb-4">Order Summary</h2>
            <div className="flex gap-4">
              <div className="relative w-20 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-plum text-[#f0d68c] text-xs flex items-center justify-center font-bold">1</span>
              </div>
              <div className="flex-1">
                <div className="font-display text-plum text-sm leading-tight">{product.name}</div>
                <div className="text-xs text-plum/60 mt-1">{qty} Pcs</div>
                {customization && (
                  <div className="mt-2 text-xs text-gold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {customization.name}{customization.familyName ? ` • ${customization.familyName} Family` : ''}</div>
                )}
              </div>
              <div className="text-sm text-plum font-medium">₹{subtotal.toLocaleString('en-IN')}</div>
            </div>
            <div className="mt-5 pt-5 border-t border-gold/10 space-y-2 text-sm text-plum/80">
              <Row label="Subtotal" value={`₹${subtotal.toLocaleString('en-IN')}`} />
              <Row label="Shipping" value={!addressComplete ? <span className="text-plum/50">Enter shipping address</span> : shipping === 0 ? <span className="text-gold font-semibold">FREE</span> : `₹${shipping}`} />
              <div className="flex justify-between pt-2 mt-2 border-t border-gold/10">
                <span className="font-display text-plum">Total</span>
                <span className="font-display text-2xl text-plum">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-xs text-plum/50">Inclusive of all taxes</div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-plum/60"><ShieldCheck className="w-4 h-4 text-gold" /> Secure & encrypted checkout</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-plum/60"><Truck className="w-4 h-4 text-gold" /> Free shipping above ₹999</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-plum/60"><MessageCircle className="w-4 h-4 text-gold" /> Order details sent to WhatsApp instantly</div>
          </div>
        </div>
      </div>
      <WhatsAppFloat />
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type='text', testId }) {
  return (
    <div>
      <label className="text-xs tracking-[0.2em] uppercase text-plum/70 mb-1.5 block">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl bg-ivory border border-gold/30 focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none text-plum" data-testid={testId} />
    </div>
  );
}
function Row({ label, value }) {
  return (<div className="flex justify-between"><span>{label}</span><span>{value}</span></div>);
}

export default function Checkout() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-cream text-plum font-display text-xl">Loading…</div>}><CheckoutInner /></Suspense>;
}
