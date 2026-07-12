'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ChevronRight, Sparkles, Award, Truck, Heart, Shield, Gift, ArrowRight, Plus, Minus, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { DEFAULT_QTY } from '@/lib/pricing';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import WhatsAppFloat from '@/components/site/WhatsAppFloat';

function ProductCard({ p, index }) {
  const hasCustomization = localStorage.getItem(`customization_${p.id}`);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
      className="group card-hover bg-white rounded-2xl overflow-hidden border border-gold/20 shadow-sm relative"
      data-testid={`product-card-${p.id}`}
    >
      <Link href={`/products/${p.id}`} data-testid={`product-card-link-${p.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-ivory">
          <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
          {p.bestSeller && (
            <span className="absolute top-3 left-3 bg-plum text-[#f0d68c] text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border border-gold/40">Best Seller</span>
          )}
          {p.discount > 0 && (
            <span className="absolute top-3 right-3 bg-gold text-plum-deep text-xs font-bold px-2 py-1 rounded-full">-{p.discount}%</span>
          )}
        </div>
        <div className="p-4">
          <div className="text-[10px] tracking-[0.2em] uppercase text-gold mb-1">{p.categoryName}</div>
          <h3 className="font-display text-lg text-plum leading-tight line-clamp-1">{p.name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
            <span className="text-xs text-plum/60">{p.rating.toFixed(1)} • {p.reviewCount}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display text-xl text-plum">₹{p.price}</span>
            <span className="text-sm text-plum/40 line-through">₹{p.originalPrice}</span>
          </div>
        </div>
      </Link>
      {hasCustomization && (
        <Link href={`/customize/${p.id}?qty=${DEFAULT_QTY}`} className="absolute top-3 right-3 z-10" data-testid={`product-customization-badge-${p.id}`}>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/20 text-plum ring-2 ring-white">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </Link>
      )}
    </motion.div>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then(r => r.json())
      .then(data => {
        console.log('Products API response:', data);
        setProducts(Array.isArray(data?.products) ? data.products : []);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setProducts([]);
      });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      .then(r => r.json())
      .then(data => {
        console.log('Categories API response:', data);
        setCategories(Array.isArray(data?.categories) ? data.categories : []);
      })
      .catch(err => {
        console.error('Failed to fetch categories:', err);
        setCategories([]);
      });
  }, []);

  const featured = products.filter(p => p.featured).slice(0, 8);
  const bestSellers = products.filter(p => p.bestSeller).slice(0, 8);

  const faqs = [
    { q: 'How long does customization & printing take?', a: 'Once you approve your design preview, we print and dispatch within 3–4 business days. Bulk orders may take 5–7 days.' },
    { q: 'Can I bulk order for my wedding?', a: 'Absolutely! We offer up to 40% discount on orders above 100 envelopes. WhatsApp us your requirements for a custom quote.' },
    { q: 'Do you ship pan-India?', a: 'Yes, we ship across all of India with tracking. Free shipping on orders above ₹999.' },
    { q: 'Can I upload my couple photo on the envelope?', a: 'Yes! Many of our premium designs support couple photos. You’ll see a live preview before confirming.' },
    { q: 'Is Cash on Delivery available?', a: 'Yes, COD is available across most pin codes. Online payments via UPI / Razorpay get an extra 5% off.' },
    { q: 'Can I see a digital proof before printing?', a: 'Yes! After you place your order, we send a high-resolution digital proof on WhatsApp within 6 hours. Printing starts only after your approval.' },
  ];

  return (
    <div className="min-h-screen bg-cream paper-bg">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fdfaf3] via-[#f7eed8] to-[#fdfaf3]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#3a0a2a 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative container mx-auto px-6 lg:px-8 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-white/70 text-xs tracking-[0.2em] uppercase text-plum">
              <Sparkles className="w-3.5 h-3.5 text-gold" /> Hand-Crafted in India
            </div>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-plum">
              Shagun Lifafa,
              <br/>
              <span className="gold-text italic">Personalised.</span>
            </h1>
            <p className="mt-6 text-lg text-plum/70 leading-relaxed max-w-xl font-serif-elegant">
              Personalize luxurious wedding money covers with your name, family blessing, and a cherished photo. Printed on premium paper within 72 hours, delivered with love.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="#shop" className="group relative px-8 py-4 rounded-full bg-gradient-to-br from-[#3a0a2a] to-[#2a0620] text-[#f0d68c] font-semibold tracking-wide border border-gold/50 shadow-[0_10px_30px_-10px_rgba(58,10,42,0.6)] hover:shadow-[0_18px_40px_-10px_rgba(58,10,42,0.8)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">Explore Collection</span>
                <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link href="#shop" className="group relative px-8 py-4 rounded-full bg-gradient-to-br from-[#f0d68c] via-gold to-[#b8923f] text-plum-deep font-bold tracking-wide shadow-[0_10px_30px_-10px_rgba(201,169,97,0.7)] hover:shadow-[0_18px_40px_-10px_rgba(201,169,97,0.9)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 overflow-hidden border border-gold/60">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Sparkles className="relative w-4 h-4" />
                <span className="relative">Customize Now</span>
              </Link>
            </div>
            <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-3 sm:gap-6 max-w-md">
              <div><div className="font-display text-2xl sm:text-3xl text-plum">15k+</div><div className="text-[10px] sm:text-xs text-plum/60 tracking-wide">Happy Couples</div></div>
              <div><div className="font-display text-2xl sm:text-3xl text-plum">4.9★</div><div className="text-[10px] sm:text-xs text-plum/60 tracking-wide">Avg Rating</div></div>
              <div><div className="font-display text-2xl sm:text-3xl text-plum">72h</div><div className="text-[10px] sm:text-xs text-plum/60 tracking-wide">Dispatch</div></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative" style={{ perspective: '1200px' }}>
            <div className="relative aspect-[4/5] max-w-md mx-auto" style={{ transformStyle: 'preserve-3d' }}>
              <div className="absolute -inset-6 bg-gradient-to-br from-gold/40 via-rose-300/20 to-plum/20 blur-3xl rounded-full animate-pulse" />
              <motion.div
                animate={{ rotateY: [-12, 12, -12], rotateX: [4, -4, 4], y: [0, -8, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.03, rotateY: 0, rotateX: 0 }}
                className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
                style={{ transformStyle: 'preserve-3d', boxShadow: '0 40px 80px -20px rgba(58,10,42,0.5), 0 0 0 1px rgba(201,169,97,0.3)' }}
              >
                <Image src="/cards/card-4.jpeg" alt="Swaminarayan Lifafa" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
              </motion.div>
              <motion.div
                animate={{ y: [-8, 12, -8], rotateZ: [-6, -10, -6] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-8 -left-10 w-36 h-48 rounded-xl overflow-hidden shadow-2xl border-2 border-white hidden md:block"
                style={{ transform: 'rotateZ(-8deg)', boxShadow: '0 30px 60px -15px rgba(58,10,42,0.4)' }}
              >
                <Image src="/cards/card-3.jpeg" alt="" fill className="object-cover object-bottom scale-150" />
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10], rotateZ: [8, 12, 8] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-8 w-32 h-44 rounded-xl overflow-hidden shadow-2xl border-2 border-white hidden md:block"
                style={{ transform: 'rotateZ(10deg)', boxShadow: '0 30px 60px -15px rgba(58,10,42,0.4)' }}
              >
                <Image src="/cards/card-10.jpeg" alt="" fill className="object-cover object-top scale-150" />
              </motion.div>
              {/* Floating gold sparkle */}
              <motion.div
                animate={{ y: [-20, 20, -20], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 left-4 w-8 h-8 hidden md:flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-gold" />
              </motion.div>
              <motion.div
                animate={{ y: [15, -15, 15], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-10 right-2 w-6 h-6 hidden md:flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-gold" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE TRUST */}
      <div className="bg-plum text-[#f0d68c] py-4 overflow-hidden">
        <div className="flex gap-12 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
          {[...Array(2)].flatMap((_, i) => ['✨ Premium Quality Paper','☆ Free Digital Proof on WhatsApp','✨ Pan-India Delivery in 4 Days','☆ 15,000+ Happy Couples','✨ Custom Couple Photo Print','☆ Free Shipping above ₹999'].map((t,j)=>(
            <span key={`${i}-${j}`} className="text-sm tracking-widest uppercase">{t}</span>
          )))}
        </div>
        <style jsx>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      {/* CATEGORIES → Now shows ALL LIFAFA directly */}
      <section id="categories" className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="ornate-divider mb-4"><span className="text-xs tracking-[0.3em] uppercase">Our Collection</span></div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-plum">All Shagun Lifafa</h2>
          <p className="text-plum/60 mt-3 font-serif-elegant">Every design hand-crafted and personalizable.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
      </section>

      {/* FEATURED PRODUCTS - hidden for now */}
      {false && (
      <section id="shop" className="container mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-gold mb-2">Featured</div>
            <h2 className="font-display text-4xl text-plum">Hand-picked Designs</h2>
          </div>
          <Link href="#shop" className="hidden md:inline-flex items-center gap-1 text-sm text-plum hover:text-gold">View all <ChevronRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {featured.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
      </section>
      )}

      {/* BEST SELLERS - hidden for now */}
      {false && (
      <section className="container mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-gold mb-2">Most Loved</div>
            <h2 className="font-display text-4xl text-plum">Our Best Sellers</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {bestSellers.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
      </section>
      )}

      {/* ALL PRODUCTS - hidden (duplicate of Collection now) */}
      {false && (
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="ornate-divider mb-4"><span className="text-xs tracking-[0.3em] uppercase">Full Collection</span></div>
          <h2 className="font-display text-4xl text-plum">All Lifafas</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
      </section>
      )}

      {/* WHY CHOOSE US - hidden for now */}
      {false && (
      <section id="why" className="bg-gradient-to-b from-ivory to-cream py-20 mt-10">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="ornate-divider mb-4"><span className="text-xs tracking-[0.3em] uppercase">Why Printalaram</span></div>
            <h2 className="font-display text-4xl md:text-5xl text-plum">A Promise Crafted Into Every Envelope</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, t: 'Premium 300 GSM', d: 'Imported premium textured paper' },
              { icon: Sparkles, t: 'Live Preview', d: 'See your names on the design before printing' },
              { icon: Truck, t: 'Pan-India Delivery', d: 'Free shipping above ₹999, dispatch in 72 hours' },
              { icon: Shield, t: 'Quality Guarantee', d: '100% reprint if you’re not delighted' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 border border-gold/20 shadow-sm hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-full bg-plum text-[#f0d68c] flex items-center justify-center border border-gold/40"><f.icon className="w-5 h-5" /></div>
                <h3 className="font-display text-xl text-plum mt-4">{f.t}</h3>
                <p className="text-sm text-plum/60 mt-2">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* TESTIMONIALS - hidden for now */}
      {false && (
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="ornate-divider mb-4"><span className="text-xs tracking-[0.3em] uppercase">Love Notes</span></div>
          <h2 className="font-display text-4xl text-plum">From Couples Who Said Yes</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Aanya & Vihaan', city: 'Mumbai', quote: 'The envelopes arrived more beautiful than the preview. Every relative asked us where we got them!', card: 5 },
            { name: 'Priya & Karan', city: 'Surat', quote: 'The live preview feature is genius. We tweaked names 3 times before printing 250 envelopes. Pure luxury.', card: 11 },
            { name: 'Meera & Arjun', city: 'Delhi', quote: 'The paper quality, the gold detail — it felt like opening jewellery. Worth every rupee.', card: 17 },
          ].map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 border border-gold/20 shadow-sm">
              <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_,j)=>(<Star key={j} className="w-4 h-4 fill-gold text-gold" />))}</div>
              <p className="font-serif-elegant text-plum/80 italic leading-relaxed">“{t.quote}”</p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gold/10">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold/30 relative">
                  <Image src={`/cards/card-${t.card}.jpg`} alt="" fill className="object-cover" />
                </div>
                <div>
                  <div className="font-display text-plum">{t.name}</div>
                  <div className="text-xs text-plum/50">{t.city}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      )}

      {/* FAQ - hidden for now */}
      {false && (
      <section id="faq" className="container mx-auto px-6 py-20 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="ornate-divider mb-4"><span className="text-xs tracking-[0.3em] uppercase">FAQ</span></div>
          <h2 className="font-display text-4xl text-plum">Questions, Answered</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-xl border border-gold/20 overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-display text-lg text-plum">{f.q}</span>
                {openFaq === i ? <Minus className="w-5 h-5 text-gold" /> : <Plus className="w-5 h-5 text-gold" />}
              </button>
              {openFaq === i && (<div className="px-5 pb-5 text-plum/70 font-serif-elegant">{f.a}</div>)}
            </div>
          ))}
        </div>
      </section>
      )}

      {/* CTA - hidden for now */}
      {false && (
      <section className="container mx-auto px-6 py-16">
        <div className="relative rounded-3xl overflow-hidden bg-plum-deep p-10 md:p-16 text-center border border-gold/30">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/cards/card-3.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="relative">
            <Gift className="w-10 h-10 mx-auto text-gold" />
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-[#f0d68c]">Start Crafting Your Story</h2>
            <p className="mt-3 text-[#f0d68c]/70 max-w-xl mx-auto font-serif-elegant">Personalize your envelope in under 60 seconds with our live preview tool.</p>
            <Link href="#shop" className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold text-plum-deep font-bold hover:bg-[#e6c989] transition">
              Customize Yours Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      )}

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default App;