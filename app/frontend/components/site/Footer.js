import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-plum-deep text-[#f0e6c8] mt-20">
      <div className="container mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-[#c9a961]/40 bg-white">
              <Image src="/logo.png" alt="Printalaram" fill className="object-cover" sizes="48px" />
            </div>
            <div className="font-display text-3xl gold-text">Printalaram</div>
          </div>
          <p className="text-sm text-[#f0e6c8]/70 leading-relaxed">Hand-crafted wedding money covers personalized for your most sacred celebrations.</p>
          <div className="flex gap-3 mt-5">
            <a className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center hover:bg-gold/10 transition" href="https://www.instagram.com/printalaram5/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
            <a className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center hover:bg-gold/10 transition" href="https://www.facebook.com/profile.php?id=61591651010384" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
            <a className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center hover:bg-gold/10 transition" href="https://www.youtube.com/@Printalaram" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube className="w-4 h-4" /></a>
          </div>
        </div>
        <div>
          <div className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Shop</div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#shop">All Lifafas</Link></li>
            <li><Link href="/#categories">Collections</Link></li>
            <li><Link href="/#shop">Best Sellers</Link></li>
            <li><Link href="/#shop">New Arrivals</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Support</div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#faq">FAQ</Link></li>
            <li><Link href="/#contact">Contact</Link></li>
            <li><Link href="/shipping-returns">Shipping &amp; Returns</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Get in Touch</div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold" /> +91 99045 51144</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-gold" /> printalaram@gmail.com</li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gold mt-0.5" /> Surat, Gujarat, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold/20 py-6 text-center text-xs text-[#f0e6c8]/50">
        © {new Date().getFullYear()} Printalaram • Crafted with love for Indian weddings
      </div>
    </footer>
  );
}
