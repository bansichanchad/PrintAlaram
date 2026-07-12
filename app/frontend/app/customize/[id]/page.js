'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Upload, Sparkles, User, Users, ArrowRight, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/site/Header';
import WhatsAppFloat from '@/components/site/WhatsAppFloat';
import EnvelopePreview from '@/components/site/EnvelopePreview';
import { DEFAULT_QTY, getUnitPrice } from '@/lib/pricing';

export default function CustomizePage() {
  const params = useParams();
  const router = useRouter();
  const search = useSearchParams();
  const qty = parseInt(search.get('qty') || String(DEFAULT_QTY));

  const [product, setProduct] = useState(null);
  const [name, setName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [couplePhoto, setCouplePhoto] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}`)
      .then(r => r.json())
      .then(d => setProduct(d.product));
  }, [params.id]);

  const handlePhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error('Image too large. Please use under 5MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => setCouplePhoto(reader.result);
    reader.readAsDataURL(f);
  };

  const proceed = async () => {
    if (!name) { toast.error('Please enter a name.'); return; }
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: params.id, name, familyName, couplePhoto: product?.photoUploadEnabled ? couplePhoto : '' }),
      });
      const data = await res.json();
      if (data.customization?.id) {
        toast.success('Customization saved!');
        // Store customization ID in localStorage for badge indicator
        localStorage.setItem(`customization_${params.id}`, data.customization.id);
        router.push(`/checkout?product=${params.id}&qty=${qty}&customization=${data.customization.id}`);
      } else {
        toast.error('Could not save customization.');
      }
    } catch (e) { toast.error('Network error. Try again.'); }
    setSaving(false);
  };

  if (!product) return <div className="min-h-screen flex items-center justify-center bg-cream text-plum font-display text-xl">Loading…</div>;

  return (
    <div className="min-h-screen bg-cream paper-bg">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-white/70 text-xs tracking-[0.2em] uppercase text-plum">
            <Sparkles className="w-3.5 h-3.5 text-gold" /> Live Customization
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-5xl text-plum">Make It Yours</h1>
          <p className="text-plum/60 mt-2 font-serif-elegant">Fill in your details on the right and watch your envelope come alive.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* LIVE PREVIEW */}
          <div className="lg:sticky lg:top-24 self-start order-1 lg:order-1">
            <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3 text-center">Live Preview</div>
            <div className="max-w-xs sm:max-w-sm mx-auto lg:max-w-none">
              <EnvelopePreview
                image={product.image}
                alt={product.name}
                name={name}
                familyName={familyName}
                photo={couplePhoto}
                showPhoto={product.photoUploadEnabled}
                layout={product.layout}
                priority
              />
            </div>
            <p className="text-center text-xs text-plum/50 mt-3 italic">Preview is illustrative — final print position is professionally laid out by our designers and approved by you on WhatsApp before printing.</p>
          </div>

          {/* FORM */}
          <div className="order-2">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gold/20 shadow-sm space-y-5">
              <div>
                <label className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-plum/70 mb-2"><User className="w-3.5 h-3.5 text-gold" /> Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Arjun Sharma" className="w-full px-4 py-3 rounded-xl bg-ivory border border-gold/30 focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none text-plum" data-testid="customize-name-input" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-plum/70 mb-2"><Users className="w-3.5 h-3.5 text-gold" /> Family Name (optional)</label>
                <input value={familyName} onChange={e => setFamilyName(e.target.value)} placeholder="e.g. Hirpara" className="w-full px-4 py-3 rounded-xl bg-ivory border border-gold/30 focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none text-plum" data-testid="customize-family-name-input" />
              </div>
              {product.photoUploadEnabled && (
                <div>
                  <label className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-plum/70 mb-2"><ImageIcon className="w-3.5 h-3.5 text-gold" /> Your Photo (optional)</label>
                  {!couplePhoto ? (
                    <button onClick={() => fileRef.current?.click()} className="w-full px-4 py-8 rounded-xl bg-ivory border-2 border-dashed border-gold/40 hover:border-gold transition flex flex-col items-center gap-2 text-plum/60" data-testid="customize-photo-upload-button">
                      <Upload className="w-6 h-6 text-gold" />
                      <span className="text-sm">Click to upload (max 5MB)</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-ivory rounded-xl border border-gold/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={couplePhoto} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-gold" />
                      <div className="flex-1">
                        <div className="text-sm text-plum font-medium">Photo uploaded</div>
                        <div className="text-xs text-plum/50">Visible in preview</div>
                      </div>
                      <button onClick={() => setCouplePhoto('')} className="w-9 h-9 rounded-full bg-white border border-gold/30 flex items-center justify-center text-plum hover:bg-rose-50" data-testid="customize-photo-remove-button"><X className="w-4 h-4" /></button>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} data-testid="customize-photo-file-input" />
                </div>
              )}
            </div>

            <div className="mt-6 bg-plum text-[#f0d68c] rounded-2xl p-5 border border-gold/30">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs tracking-[0.2em] uppercase text-gold">{product.name}</span>
                <span className="text-xs">Qty: {qty}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-display text-3xl">₹{(getUnitPrice(qty) * qty).toLocaleString('en-IN')}</span>
                <span className="text-sm opacity-70 line-through">₹{(product.originalPrice * qty).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button onClick={proceed} disabled={saving} className="mt-4 w-full px-6 py-4 rounded-full bg-gold text-plum-deep font-bold hover:bg-[#e6c989] disabled:opacity-60 transition flex items-center justify-center gap-2" data-testid="customize-save-proceed-button">
              {saving ? 'Saving…' : (<>Save & Proceed to Checkout <ArrowRight className="w-4 h-4" /></>)}
            </button>
            <Link href={`/products/${params.id}`} className="mt-3 block text-center text-sm text-plum/60 hover:text-plum" data-testid="customize-back-to-product-link">← Back to product</Link>
          </div>
        </div>
      </div>
      <WhatsAppFloat />
    </div>
  );
}
