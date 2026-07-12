'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, Truck, Shield, Award, Plus, Minus, ChevronRight, MessageCircle } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import WhatsAppFloat from '@/components/site/WhatsAppFloat';
import EnvelopePreview from '@/components/site/EnvelopePreview';
import { QTY_PRESETS, DEFAULT_QTY, MIN_QTY, QTY_STEP, getUnitPrice } from '@/lib/pricing';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [slide, setSlide] = useState('sample'); // 'preview' | 'sample'
  const [qty, setQty] = useState(DEFAULT_QTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}`;
    console.log('Fetching product from:', url);
    async function fetchProduct() {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setProduct(data.product);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream text-plum font-display text-xl">Loading…</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center bg-cream text-plum font-display text-xl">Product not found</div>;

  const unitPrice = getUnitPrice(qty);
  const total = unitPrice * qty;

  // Generate a consistent random original price for display purposes
  // This makes each product show a different MSRP while keeping actual pricing accurate
  let seed = 0;
  for (let i = 0; i < product.id.toString().length; i++) {
    seed += product.id.toString().charCodeAt(i);
  }

  // Simple pseudorandom function based on product ID
  let x = Math.sin(seed++) * 10000;
  const displayOriginalPrice = Math.max(
    unitPrice * 2,  // Ensure it's at least 2x the actual price
    Math.floor(Math.floor((x - Math.floor(x)) * 1000) % 1000) + 200  // Random value between 200-1199
  );

  // Calculate savings and discount percentage based on displayed original price
  const savings = (displayOriginalPrice - unitPrice) * qty;
  const discountPct = Math.round(((displayOriginalPrice - unitPrice) / displayOriginalPrice) * 100);

  return (
    <div className="min-h-screen bg-cream paper-bg overflow-x-hidden">
      <Header />
      <div className="container mx-auto px-6 py-6 text-xs text-plum/60">
        <Link href="/">Home</Link> <span>/</span> <Link href="/#shop">Shop</Link> <span>/</span> <span className="text-plum">{product.name}</span>
      </div>

      <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-6 sm:gap-12 pb-16">
        {/* Gallery */}
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
            {slide === 'preview' ? (
              <div className="relative aspect-[3/4] bg-ivory rounded-2xl overflow-hidden border border-gold/20 shadow-lg">
                <Image src={product.image} alt={product.name} fill className="object-cover" priority />
                {product.bestSeller && (<span className="absolute top-4 left-4 bg-plum text-[#f0d68c] text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full border border-gold/40">Best Seller</span>)}
              </div>
            ) : (
              <EnvelopePreview image={product.image} alt={product.name} name="" familyName="" showPhoto={product.photoUploadEnabled} layout={product.layout} priority />
            )}
          </motion.div>
          <div className="flex gap-3 mt-4" data-testid="product-gallery-slides">
            {/* <button onClick={() => setSlide('preview')} className={`flex-1 py-2.5 rounded-full text-xs font-semibold border transition ${slide === 'preview' ? 'bg-plum text-[#f0d68c] border-plum' : 'border-gold/30 text-plum/70 hover:bg-gold/10`' } data-testid="product-slide-preview-button">Original</button> */}
            {/* <button onClick={() => setSlide('sample')} className={`
              flex-1 py-2.5 rounded-full text-xs font-semibold border transition
              ${slide === 'sample' ? 'bg-plum text-[#f0d68c] border-plum' : 'border-gold/30 text-plum/70 hover:bg-gold/10'}
            `} data-testid="product-slide-sample-button">With Your Name (Preview)</button> */}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-2">{product.categoryName}</div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-plum leading-tight">{product.name}</h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex">
              {/* Display 4.2 stars: 4 full + 0.2 partial */}
              {[...Array(4)].map((_, i) => (
                <Star key={`full-${i}`} className="w-4 h-4 fill-gold text-gold" />
              ))}
              {/* Partial star for 0.2 (20% filled) */}
              <div className="relative w-4 h-4 flex-shrink-0">
                <Star className="w-4 h-4 fill-gold text-gold" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[20%] h-full bg-white"></div>
                </div>
              </div>
              {/* Empty star for remaining 0.8 */}
              <Star className="w-4 h-4 fill-gold text-gold/20" />
            </div>
            <span className="text-sm text-plum/60">4.2 • {product.reviewCount} reviews</span>
          </div>
          <div className="flex items-baseline gap-3 mt-5">
            <span className="font-display text-4xl text-plum">₹{unitPrice}</span>
            <span className="text-lg text-plum/40 line-through">₹{displayOriginalPrice}</span>
            <span className="bg-gold/20 text-gold text-xs font-bold px-2 py-1 rounded-full">SAVE {discountPct}%</span>
          </div>
          <p className="text-xs text-plum/50 mt-1">Per envelope • Inclusive of all taxes</p>
          {/* Quantity */}
          <div className="mt-8 bg-white rounded-2xl p-6 border border-gold/20 shadow-sm">
            <div className="text-xs tracking-[0.3em] uppercase text-plum/60 mb-3">Quantity</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-ivory rounded-full border border-gold/30">
                <button onClick={() => setQty(Math.max(MIN_QTY, qty - QTY_STEP))} className="w-11 h-11 flex items-center justify-center text-plum hover:bg-gold/20 rounded-full" data-testid="qty-decrement-button"><Minus className="w-4 h-4" /></button>
                <input type="number" value={qty} onChange={e => setQty(Math.max(MIN_QTY, (parseInt(e.target.value) || MIN_QTY)))} className="w-16 text-center bg-transparent font-display text-xl text-plum focus:outline-none" data-testid="qty-input" min="1" step="1" />
                <button onClick={() => setQty(qty + QTY_STEP)} className="w-11 h-11 flex items-center justify-center text-plum hover:bg-gold/20 rounded-full" data-testid="qty-increment-button"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="flex gap-2">
                {QTY_PRESETS.map(n => (
                  <button key={n} onClick={() => setQty(n)} className={`
                    px-3 py-1.5 rounded-full text-xs border
                    ${qty === n ? 'bg-plum text-[#f0d68c] border-plum' : 'border-gold/30 text-plum/70 hover:bg-gold/10'}
                  `} data-testid={`qty-preset-${n}`}>{n} pcs</button>
                ))}
              </div>
            </div>
            <div className="mt-3 text-xs text-plum/60">₹{unitPrice} per envelope at this quantity</div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gold/10">
              <div>
                <div className="text-xs text-plum/60">Subtotal</div>
                <div className="font-display text-2xl text-plum">₹{total.toLocaleString('en-IN')}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-plum/60">You save</div>
                <div className="font-display text-2xl text-gold">₹{savings.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>

          {/* Fake Reviews Section */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-plum mb-4">Customer Reviews</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-1 flex items-center">
                  {/* Display 4.2 stars: 4 full + 0.2 partial */}
                  {[...Array(4)].map((_, i) => (
                    <Star key={`review1-full-${i}`} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                  {/* Partial star for 0.2 (20% filled) */}
                  <div className="relative w-4 h-4 flex-shrink-0">
                    <Star className="w-4 h-4 fill-gold text-gold" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-[20%] h-full bg-white"></div>
                    </div>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-plum">Priya S.</p>
                  <p className="text-sm text-plum/50">Beautiful craftsmanship! The Swaminarayan Lifafa exceeded my expectations. The quality is outstanding and the personalization was perfect.</p>
                  <p className="text-xs text-plum/40">January 15, 2024</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-1 flex items-center">
                  {/* Display 4.2 stars: 4 full + 0.2 partial */}
                  {[...Array(4)].map((_, i) => (
                    <Star key={`review2-full-${i}`} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                  {/* Partial star for 0.2 (20% filled) */}
                  <div className="relative w-4 h-4 flex-shrink-0">
                    <Star className="w-4 h-4 fill-gold text-gold" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-[20%] h-full bg-white"></div>
                    </div>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-plum">Rahul M.</p>
                  <p className="text-sm text-plum/50">Ordered for my sister's wedding and she loved it. The delivery was quick and the packaging was elegant.</p>
                  <p className="text-xs text-plum/40">January 10, 2024</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-1 flex items-center">
                  {/* Display 4.2 stars: 4 full + 0.2 partial */}
                  {[...Array(4)].map((_, i) => (
                    <Star key={`review3-full-${i}`} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                  {/* Partial star for 0.2 (20% filled) */}
                  <div className="relative w-4 h-4 flex-shrink-0">
                    <Star className="w-4 h-4 fill-gold text-gold" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-[20%] h-full bg-white"></div>
                    </div>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-plum">Anjali K.</p>
                  <p className="text-sm text-plum/50">Absolutely stunning! The attention to detail is remarkable. Will definitely order again.</p>
                  <p className="text-xs text-plum/40">January 5, 2024</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/customize/${product.id}?qty=${qty}`}
              className="flex-1 px-6 py-4 rounded-full bg-plum text-[#f0d68c] font-bold text-center hover:bg-plum-deep border border-gold/40 transition flex items-center justify-center gap-2"
              data-testid="customize-now-button"
            >
              ✨ Customize Now
            </Link>
            <Link
              href={`/checkout?product=${product.id}&qty=${qty}`}
              className="flex-1 px-6 py-4 rounded-full bg-gold text-plum-deed font-bold text-center hover:bg-[#e6c989] transition"
              data-testid="buy-now-button"
            >
              Buy Now
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[{icon:Truck,t:'Free shipping above ₹999'},{icon:Award,t:'Premium print quality'},{icon:Shield,t:'100% reprint guarantee'}].map((f,i)=>(
              <div key={i} className="text-center p-3 bg-white rounded-xl border border-gold/20">
                <f.icon className="w-5 h-5 text-gold mx-auto mb-1" />
                <div className="text-[10px] text-plum/70 leading-tight">{f.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}