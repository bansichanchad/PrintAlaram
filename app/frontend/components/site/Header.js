'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ShoppingBag, Heart } from 'lucide-react';

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#fdfaf3]/85 border-b border-[#c9a961]/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3" data-testid="header-logo-link">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg ring-2 ring-[#c9a961]/40 bg-white">
              <Image src="/logo.png" alt="Printalaram" fill className="object-cover" sizes="48px" priority />
            </div>
            <div className="leading-tight">
              <div className="font-display text-2xl text-plum tracking-wide">Printalaram</div>
              <div className="text-[10px] tracking-[0.3em] text-gold uppercase">Shagun Couture</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-plum/80 ml-auto">
            <Link href="/" className="hover:text-plum transition-colors" data-testid="header-nav-home">Home</Link>
            <Link href="/#shop" className="hover:text-plum transition-colors" data-testid="header-nav-shop">Shop</Link>
            <Link href="/#categories" className="hover:text-plum transition-colors" data-testid="header-nav-collections">Collections</Link>
            <Link href="/#why" className="hover:text-plum transition-colors" data-testid="header-nav-why-us">Why Us</Link>
            <Link href="/#faq" className="hover:text-plum transition-colors" data-testid="header-nav-faq">FAQ</Link>
            <Link href="/#contact" className="hover:text-plum transition-colors" data-testid="header-nav-contact">Contact</Link>
          </nav>
          <button className="md:hidden text-plum ml-auto" onClick={() => setOpen(!open)} data-testid="header-mobile-menu-toggle">
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3 text-plum" data-testid="header-mobile-menu">
            <Link href="/" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/#shop" onClick={() => setOpen(false)}>Shop</Link>
            <Link href="/#categories" onClick={() => setOpen(false)}>Collections</Link>
            <Link href="/#why" onClick={() => setOpen(false)}>Why Us</Link>
            <Link href="/#faq" onClick={() => setOpen(false)}>FAQ</Link>
            <Link href="/#contact" onClick={() => setOpen(false)}>Contact</Link>
          </div>
        )}
      </div>
    </header>
  );
}
