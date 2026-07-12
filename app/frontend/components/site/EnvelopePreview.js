'use client';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_LAYOUT = {
  photo: null, // { top, left, width, height } as CSS percentage strings, rectangular photo slot
  name: { top: '49%', color: '#ffffff' },
  family: { top: '58%', color: '#e8c874' },
};

/**
 * Renders the envelope artwork with the customer's Name / Family Name (and
 * optional photo) composited on top, positioned per-product to match the
 * actual printable area of that card's artwork.
 */
export default function EnvelopePreview({ image, alt, name, familyName, photo, showPhoto, namePlaceholder = 'Your Name', layout, priority = false }) {
  const cfg = { ...DEFAULT_LAYOUT, ...(layout || {}) };

  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-ivory">
      <Image src={image} alt={alt || 'Envelope'} fill className="object-cover" priority={priority} />

      <div className="absolute inset-0">
        {showPhoto && cfg.photo && (
          <AnimatePresence>
            {photo && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="absolute overflow-hidden rounded-md shadow-lg border-2 border-white/80"
                style={{ top: cfg.photo.top, left: cfg.photo.left, width: cfg.photo.width, height: cfg.photo.height }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/*
        <motion.div
          key={`n-${name}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute text-center font-display px-4 leading-tight"
          style={{
            top: cfg.name.top, left: cfg.name.left ?? 0, right: cfg.name.right ?? 0,
            width: cfg.name.width, textAlign: cfg.name.align || 'center',
            fontSize: cfg.name.size || undefined,
            color: cfg.name.color, textShadow: '0 1px 6px rgba(0,0,0,0.6)',
          }}
        >
          <span className="text-base sm:text-lg md:text-xl">
            {name || <span style={{ opacity: 0.5 }} className="italic">{namePlaceholder}</span>}
          </span>
        </motion.div>
*/}

        {/*
        {familyName && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute font-display italic px-4"
            style={{
              top: cfg.family.top, left: cfg.family.left ?? 0, right: cfg.family.right ?? 0,
              width: cfg.family.width, textAlign: cfg.family.align || 'center',
              fontSize: cfg.family.size || undefined,
              color: cfg.family.color, textShadow: '0 1px 4px rgba(0,0,0,0.5)',
            }}
          >
            <span className="text-sm sm:text-base">{familyName} Family</span>
          </motion.div>
        )}
*/}
      </div>
    </div>
  );
}
