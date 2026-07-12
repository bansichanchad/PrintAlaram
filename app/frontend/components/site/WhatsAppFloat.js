'use client';

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M16.001 3C9.107 3 3.5 8.607 3.5 15.5c0 2.34.638 4.53 1.746 6.41L3 29l7.278-2.208A12.44 12.44 0 0 0 16.001 28C22.894 28 28.5 22.393 28.5 15.5S22.894 3 16.001 3Zm0 22.7a10.16 10.16 0 0 1-5.19-1.42l-.372-.221-4.323 1.311 1.34-4.212-.243-.386A10.14 10.14 0 0 1 5.8 15.5c0-5.633 4.578-10.2 10.201-10.2 5.622 0 10.2 4.567 10.2 10.2 0 5.633-4.578 10.2-10.2 10.2Zm5.593-7.632c-.306-.153-1.809-.892-2.089-.994-.28-.102-.484-.153-.688.153-.204.306-.789.993-.968 1.198-.178.204-.357.23-.663.077-.306-.153-1.293-.477-2.463-1.522-.91-.812-1.525-1.815-1.704-2.121-.178-.306-.019-.472.134-.624.137-.137.306-.357.459-.535.153-.179.204-.306.306-.51.102-.204.051-.383-.026-.536-.076-.153-.687-1.658-.942-2.271-.248-.596-.5-.516-.687-.525l-.586-.01c-.204 0-.535.077-.815.383-.28.306-1.068 1.044-1.068 2.548 0 1.503 1.093 2.956 1.245 3.16.153.204 2.15 3.283 5.208 4.605.728.314 1.296.502 1.739.642.731.232 1.396.2 1.922.121.586-.088 1.809-.74 2.064-1.454.255-.715.255-1.327.178-1.454-.076-.128-.28-.204-.586-.357Z"/>
    </svg>
  );
}

export default function WhatsAppFloat() {
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
  const msg = encodeURIComponent('Hi Printalaram, I want to know more about your customized wedding money covers.');
  return (
    <a
      href={`https://wa.me/${num}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl pl-4 pr-5 py-2.5 transition-transform hover:-translate-y-0.5"
      aria-label="Chat on WhatsApp"
      data-testid="whatsapp-float-button"
    >
      <span className="relative flex-shrink-0">
        <span className="absolute inset-0 rounded-full bg-white/30 animate-ping"></span>
        <WhatsAppIcon className="relative w-8 h-8" />
      </span>
      <span className="flex flex-col leading-tight text-left">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/90">
          Printalaram
          <span className="inline-flex items-center gap-1 bg-white/20 rounded-full px-1.5 py-0.5 text-[9px] uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-300 animate-pulse" /> Online
          </span>
        </span>
        <span className="text-sm font-bold whitespace-nowrap">Contact For Customization</span>
      </span>
    </a>
  );
}
