import { useState, useEffect, useMemo, useRef } from 'react'
import * as api from './api'

// ============================================================================
// CONFIG
// ============================================================================
const ADMIN_PASSWORD = 'apex2024'
const WHATSAPP_NUMBER = '971501234567'
const API_URL = import.meta.env.VITE_API_URL || 'https://apexmotors-backend-production.up.railway.app'

// ============================================================================
// ICONS (Compact)
// ============================================================================
const Icons = {
  Phone: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>,
  WhatsApp: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>,
  X: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>,
  Heart: ({filled}) => <svg className="w-5 h-5" fill={filled?"currentColor":"none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>,
  Star: ({filled=true}) => <svg className="w-4 h-4" fill={filled?"currentColor":"none"} stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Calendar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  Location: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>,
  Speed: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  Gear: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>,
  ChevronDown: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>,
  ChevronRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>,
  ChevronLeft: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>,
  Compare: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  Globe: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>,
  Shield: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  Edit: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>,
  Minus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/></svg>,
  Chat: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>,
  Send: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>,
  Mail: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Calculator: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>,
  Chart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  Download: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>,
  Play: () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>,
  Sun: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  Moon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>,
  Instagram: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg>,
  Facebook: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  Twitter: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  Car: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17h.01M16 17h.01M9 11h6M5 11l2-5h10l2 5M5 11v6h14v-6M5 11H3m16 0h2"/></svg>,
  Ring: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" strokeWidth={2}/></svg>,
  Plane: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>,
  Camera: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="3" strokeWidth={2}/></svg>,
  Briefcase: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
}

const PaymentIcons = {
  Visa: () => <svg className="h-6" viewBox="0 0 48 32"><rect width="48" height="32" rx="4" fill="#1A1F71"/><path d="M19.5 21h-3l1.9-11.5h3L19.5 21zm8-11.5l-2.8 7.9-.3-1.5-.9-4.8c-.2-.6-.6-.9-1.2-.9h-4.8l-.1.3c1.1.3 2.1.7 2.8 1.1l2.4 9h3.1l4.7-11.5h-2.9v.4z" fill="#fff"/></svg>,
  Mastercard: () => <svg className="h-6" viewBox="0 0 48 32"><rect width="48" height="32" rx="4" fill="#000"/><circle cx="18" cy="16" r="8" fill="#EB001B"/><circle cx="30" cy="16" r="8" fill="#F79E1B"/><path d="M24 9.5a8 8 0 010 13 8 8 0 000-13z" fill="#FF5F00"/></svg>,
}

// ============================================================================
// DATA
// ============================================================================
const defaultVehicles = [
  { id: 1, name: "Lamborghini Huracán EVO", brand: "Lamborghini", category: "supercar", price: 3500, image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80", images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80"], specs: { speed: "325 km/h", acceleration: "2.9s", seats: 2, fuel: "Petrol", transmission: "Automatic" }, features: ["V10 Engine", "All-Wheel Drive", "Launch Control"], rating: 4.9, reviews: 127, available: true },
  { id: 2, name: "Ferrari 488 GTB", brand: "Ferrari", category: "supercar", price: 3200, image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80", images: ["https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80"], specs: { speed: "330 km/h", acceleration: "3.0s", seats: 2, fuel: "Petrol", transmission: "Automatic" }, features: ["Twin-Turbo V8", "F1 Dual-Clutch", "Racing Mode"], rating: 4.8, reviews: 98, available: true },
  { id: 3, name: "Rolls-Royce Ghost", brand: "Rolls-Royce", category: "luxury", price: 2800, image: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80", images: ["https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80"], specs: { speed: "250 km/h", acceleration: "4.8s", seats: 5, fuel: "Petrol", transmission: "Automatic" }, features: ["Starlight Headliner", "Massage Seats", "Champagne Cooler"], rating: 5.0, reviews: 156, available: true },
  { id: 4, name: "Bentley Continental GT", brand: "Bentley", category: "luxury", price: 2200, image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80", images: ["https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80"], specs: { speed: "333 km/h", acceleration: "3.7s", seats: 4, fuel: "Petrol", transmission: "Automatic" }, features: ["W12 Engine", "Rotating Display", "Naim Audio"], rating: 4.7, reviews: 89, available: true },
  { id: 5, name: "Mercedes-AMG G63", brand: "Mercedes", category: "suv", price: 1800, image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80", images: ["https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80"], specs: { speed: "220 km/h", acceleration: "4.5s", seats: 5, fuel: "Petrol", transmission: "Automatic" }, features: ["V8 Biturbo", "3 Differential Locks", "Burmester Sound"], rating: 4.8, reviews: 203, available: true },
  { id: 6, name: "Porsche 911 Turbo S", brand: "Porsche", category: "supercar", price: 2500, image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80", images: ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80"], specs: { speed: "330 km/h", acceleration: "2.7s", seats: 4, fuel: "Petrol", transmission: "PDK" }, features: ["Flat-6 Turbo", "Sport Chrono", "Carbon Roof"], rating: 4.9, reviews: 167, available: true },
  { id: 7, name: "Range Rover Autobiography", brand: "Land Rover", category: "suv", price: 1500, image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80", images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80"], specs: { speed: "250 km/h", acceleration: "5.4s", seats: 5, fuel: "Petrol", transmission: "Automatic" }, features: ["Executive Seats", "Terrain Response", "Meridian Sound"], rating: 4.6, reviews: 134, available: true },
  { id: 8, name: "McLaren 720S", brand: "McLaren", category: "supercar", price: 3800, image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=800&q=80", images: ["https://images.unsplash.com/photo-1621135802920-133df287f89c?w=800&q=80"], specs: { speed: "341 km/h", acceleration: "2.9s", seats: 2, fuel: "Petrol", transmission: "SSG" }, features: ["Twin-Turbo V8", "Dihedral Doors", "Track Telemetry"], rating: 4.9, reviews: 78, available: true },
]

const packages = [
  { id: 1, name: "Wedding Package", icon: "Ring", price: 5000, description: "Make your special day unforgettable", includes: ["Rolls-Royce Ghost", "Decorated Vehicle", "Chauffeur", "Red Carpet"], image: "https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800&q=80" },
  { id: 2, name: "Airport Transfer", icon: "Plane", price: 800, description: "VIP airport pickup and drop-off", includes: ["Meet & Greet", "Flight Tracking", "Luxury Sedan", "WiFi"], image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80" },
  { id: 3, name: "Dubai City Tour", icon: "Camera", price: 2500, description: "Explore Dubai's iconic landmarks", includes: ["4 Hour Tour", "Professional Driver", "Photo Stops", "Burj Khalifa"], image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80" },
  { id: 4, name: "Business Package", icon: "Briefcase", price: 3500, description: "Impress your clients", includes: ["Weekly Rental", "Chauffeur Option", "24/7 Support", "Flexible Schedule"], image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&q=80" },
]

const defaultCoupons = [
  { id: 1, code: "WELCOME20", discount: 20, type: "percent", minOrder: 1000, active: true },
  { id: 2, code: "LUXURY500", discount: 500, type: "fixed", minOrder: 3000, active: true },
  { id: 3, code: "VIP10", discount: 10, type: "percent", minOrder: 5000, active: true },
]

const defaultBookings = [
  { id: 1, vehicleName: "Lamborghini Huracán EVO", customer: "Ahmed Mohammed", email: "ahmed@email.com", total: 10500, status: "confirmed", date: "2024-12-15" },
  { id: 2, vehicleName: "Rolls-Royce Ghost", customer: "Sarah Johnson", email: "sarah@email.com", total: 8400, status: "pending", date: "2024-12-14" },
]

const defaultReviews = [
  { id: 1, vehicleId: 1, customer: "Michael R.", rating: 5, comment: "Incredible experience! The Huracán was in perfect condition.", date: "2024-12-10", verified: true },
  { id: 2, vehicleId: 3, customer: "Emma S.", rating: 5, comment: "The Rolls-Royce made our wedding day magical!", date: "2024-12-08", verified: true },
  { id: 3, vehicleId: 5, customer: "Ahmed K.", rating: 4, comment: "Great G63, very comfortable for family trips.", date: "2024-12-05", verified: true },
]

const extras = [
  { id: "chauffeur", name: "Professional Chauffeur", price: 500 },
  { id: "insurance", name: "Full Insurance", price: 200 },
  { id: "gps", name: "GPS Navigation", price: 50 },
  { id: "baby_seat", name: "Baby Seat", price: 75 },
  { id: "wifi", name: "Portable WiFi", price: 30 },
]

const locations = ["Dubai Marina", "Downtown Dubai", "Palm Jumeirah", "Dubai Airport T3", "JBR Beach", "Business Bay"]

const faqs = [
  { q: "What documents do I need?", a: "Valid driver's license (international for tourists), passport, and credit card for deposit." },
  { q: "Is insurance included?", a: "Basic insurance included. Comprehensive coverage available as add-on." },
  { q: "Can I rent with a driver?", a: "Yes! Professional chauffeur service available for all vehicles." },
  { q: "Minimum rental period?", a: "1 day (24 hours). Hourly rentals for select packages." },
  { q: "Do you deliver to hotels?", a: "Yes, free delivery across Dubai including hotels and airports." },
]

const translations = {
  en: {
    nav: { home: "Home", fleet: "Fleet", packages: "Packages", reviews: "Reviews", faq: "FAQ", contact: "Contact", book: "Book Now" },
    hero: { title: "Experience Ultimate Luxury", subtitle: "Drive the world's most prestigious vehicles in Dubai", cta: "Explore Fleet", video: "Watch Video" },
    fleet: { title: "Our Premium Fleet", subtitle: "Choose from our exclusive collection", all: "All", supercar: "Supercars", luxury: "Luxury", suv: "SUV", perDay: "/day", viewDetails: "Details", bookNow: "Book Now" },
    packages: { title: "Special Packages", subtitle: "Tailored experiences", includes: "Includes", bookPackage: "Book", from: "From" },
    reviews: { title: "Customer Reviews", subtitle: "What our clients say", write: "Write Review", verified: "Verified" },
    faq: { title: "FAQ", subtitle: "Common questions" },
    checkout: { title: "Complete Booking", pickup: "Pick-up", dropoff: "Drop-off", location: "Location", days: "days", total: "Total", extras: "Add-ons", coupon: "Coupon", apply: "Apply", confirm: "Confirm", success: "Booking Confirmed!", secure: "Secure Payment" },
    newsletter: { title: "Stay Updated", subtitle: "Get exclusive offers", placeholder: "Your email", subscribe: "Subscribe", success: "Subscribed!" },
    chat: { title: "Live Chat", placeholder: "Type message...", welcome: "Hello! How can I help?" },
    calculator: { title: "Budget Calculator", days: "Days", total: "Estimated Total" },
    admin: { title: "Admin Panel", dashboard: "Dashboard", vehicles: "Vehicles", bookings: "Bookings", coupons: "Coupons", reviews: "Reviews", customers: "Customers", add: "Add", delete: "Delete", export: "Export", revenue: "Revenue", total: "Total" },
    footer: { about: "Premium luxury car rental in Dubai.", links: "Links", contact: "Contact", rights: "All rights reserved." },
  },
  ar: {
    nav: { home: "الرئيسية", fleet: "الأسطول", packages: "الباقات", reviews: "التقييمات", faq: "الأسئلة", contact: "اتصل", book: "احجز" },
    hero: { title: "استمتع بالفخامة", subtitle: "قُد أرقى السيارات في دبي", cta: "استكشف", video: "شاهد" },
    fleet: { title: "أسطولنا", subtitle: "اختر من مجموعتنا", all: "الكل", supercar: "رياضية", luxury: "فاخرة", suv: "دفع رباعي", perDay: "/يوم", viewDetails: "التفاصيل", bookNow: "احجز" },
    packages: { title: "الباقات", subtitle: "تجارب مميزة", includes: "يشمل", bookPackage: "احجز", from: "من" },
    reviews: { title: "التقييمات", subtitle: "آراء العملاء", write: "اكتب تقييم", verified: "موثق" },
    faq: { title: "الأسئلة", subtitle: "أسئلة شائعة" },
    checkout: { title: "إتمام الحجز", pickup: "الاستلام", dropoff: "التسليم", location: "الموقع", days: "أيام", total: "المجموع", extras: "إضافات", coupon: "كوبون", apply: "تطبيق", confirm: "تأكيد", success: "تم الحجز!", secure: "دفع آمن" },
    newsletter: { title: "ابق على اطلاع", subtitle: "عروض حصرية", placeholder: "بريدك", subscribe: "اشترك", success: "تم!" },
    chat: { title: "الدردشة", placeholder: "اكتب...", welcome: "مرحباً!" },
    calculator: { title: "الحاسبة", days: "الأيام", total: "التقدير" },
    admin: { title: "الإدارة", dashboard: "الرئيسية", vehicles: "السيارات", bookings: "الحجوزات", coupons: "الكوبونات", reviews: "التقييمات", customers: "العملاء", add: "إضافة", delete: "حذف", export: "تصدير", revenue: "الإيرادات", total: "المجموع" },
    footer: { about: "تأجير سيارات فاخرة في دبي.", links: "روابط", contact: "اتصل", rights: "محفوظة." },
  },
  ru: {
    nav: { home: "Главная", fleet: "Автопарк", packages: "Пакеты", reviews: "Отзывы", faq: "FAQ", contact: "Контакты", book: "Забронировать" },
    hero: { title: "Испытайте Роскошь", subtitle: "Управляйте престижными авто в Дубае", cta: "Смотреть", video: "Видео" },
    fleet: { title: "Автопарк", subtitle: "Выберите из коллекции", all: "Все", supercar: "Суперкары", luxury: "Люкс", suv: "Внедорожники", perDay: "/день", viewDetails: "Детали", bookNow: "Забронировать" },
    packages: { title: "Пакеты", subtitle: "Уникальные предложения", includes: "Включено", bookPackage: "Забронировать", from: "От" },
    reviews: { title: "Отзывы", subtitle: "Что говорят клиенты", write: "Написать", verified: "Проверено" },
    faq: { title: "FAQ", subtitle: "Частые вопросы" },
    checkout: { title: "Оформление", pickup: "Получение", dropoff: "Возврат", location: "Место", days: "дней", total: "Итого", extras: "Доп.", coupon: "Промокод", apply: "Применить", confirm: "Подтвердить", success: "Подтверждено!", secure: "Безопасно" },
    newsletter: { title: "Рассылка", subtitle: "Эксклюзивные предложения", placeholder: "Email", subscribe: "Подписаться", success: "Готово!" },
    chat: { title: "Чат", placeholder: "Сообщение...", welcome: "Здравствуйте!" },
    calculator: { title: "Калькулятор", days: "Дни", total: "Примерно" },
    admin: { title: "Админ", dashboard: "Главная", vehicles: "Авто", bookings: "Брони", coupons: "Купоны", reviews: "Отзывы", customers: "Клиенты", add: "Добавить", delete: "Удалить", export: "Экспорт", revenue: "Доход", total: "Всего" },
    footer: { about: "Премиум аренда авто в Дубае.", links: "Ссылки", contact: "Контакты", rights: "Защищены." },
  },
}

// ============================================================================
// UTILITIES
// ============================================================================
const formatPrice = (p) => `AED ${p.toLocaleString()}`
const getDays = (s, e) => s && e ? Math.max(1, Math.ceil((new Date(e) - new Date(s)) / 86400000)) : 0

// ============================================================================
// COMPONENTS
// ============================================================================

const Logo = ({ darkMode = true }) => (
  <div className="flex items-center">
    <img src="/logo.png" alt="APEX MOTORS" className="h-10 md:h-12 w-auto" />
  </div>
)

const Header = ({ lang, setLang, t, scrollTo, favorites, compareList, setShowFavorites, setShowCompare, setShowCalculator, darkMode, setDarkMode }) => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h) }, [])
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? (darkMode ? 'glass border-b border-zinc-800' : 'bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm') : ''}`}>
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Logo darkMode={darkMode} />
        <nav className="hidden lg:flex items-center gap-6">
          {['home','fleet','packages','reviews','faq','contact'].map(i => <button key={i} onClick={() => scrollTo(i)} className={`text-sm font-medium transition-colors ${darkMode ? 'text-zinc-300 hover:text-amber-500' : 'text-gray-600 hover:text-amber-600'}`}>{t.nav[i]}</button>)}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>{darkMode ? <Icons.Sun /> : <Icons.Moon />}</button>
          <div className="relative group">
            <button className={`flex items-center gap-1 text-sm ${darkMode ? 'text-zinc-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}><Icons.Globe />{lang.toUpperCase()}</button>
            <div className={`absolute top-full right-0 mt-2 rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-200 shadow-lg'}`}>
              {['en','ar','ru'].map(l => <button key={l} onClick={() => setLang(l)} className={`block w-full px-4 py-2 text-left ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-50'} ${lang===l?'text-amber-500':(darkMode?'text-white':'text-gray-700')}`}>{l==='en'?'English':l==='ar'?'العربية':'Русский'}</button>)}
            </div>
          </div>
          <button onClick={() => setShowCalculator(true)} className={`p-2 transition-colors ${darkMode ? 'text-zinc-300 hover:text-amber-500' : 'text-gray-600 hover:text-amber-600'}`}><Icons.Calculator /></button>
          <button onClick={() => setShowFavorites(true)} className={`relative p-2 transition-colors ${darkMode ? 'text-zinc-300 hover:text-amber-500' : 'text-gray-600 hover:text-amber-600'}`}><Icons.Heart filled={false} />{favorites.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full text-[10px] flex items-center justify-center text-black font-bold">{favorites.length}</span>}</button>
          <button onClick={() => setShowCompare(true)} className={`relative p-2 transition-colors ${darkMode ? 'text-zinc-300 hover:text-amber-500' : 'text-gray-600 hover:text-amber-600'}`}><Icons.Compare />{compareList.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full text-[10px] flex items-center justify-center text-black font-bold">{compareList.length}</span>}</button>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="bg-gradient-to-r from-amber-500 to-orange-600 text-black px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm hover:shadow-lg hover:shadow-amber-500/30 transition-all"><Icons.WhatsApp />{t.nav.book}</a>
        </div>
        <button onClick={() => setOpen(!open)} className={`lg:hidden ${darkMode ? 'text-white' : 'text-gray-700'}`}>{open ? <Icons.X /> : <Icons.Menu />}</button>
      </div>
      {open && <div className={`lg:hidden py-4 border-t px-4 ${darkMode ? 'border-zinc-800 glass' : 'border-gray-200 bg-white'}`}><nav className="flex flex-col gap-3">{['home','fleet','packages','reviews','faq','contact'].map(i => <button key={i} onClick={() => { scrollTo(i); setOpen(false) }} className={`text-left ${darkMode ? 'text-zinc-300' : 'text-gray-600'}`}>{t.nav[i]}</button>)}</nav></div>}
    </header>
  )
}

const Hero = ({ t, scrollTo }) => {
  const [video, setVideo] = useState(false)
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" /><div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" /></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-32">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">{t.hero.title.split(' ').map((w,i) => <span key={i} className={i===1?'gradient-text':''}>{w} </span>)}</h1>
          <p className="text-xl text-zinc-400 mb-8">{t.hero.subtitle}</p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => scrollTo('fleet')} className="bg-gradient-to-r from-amber-500 to-orange-600 text-black px-8 py-4 rounded-lg font-semibold flex items-center gap-2">{t.hero.cta}<Icons.ChevronRight /></button>
            <button onClick={() => setVideo(true)} className="border border-white/30 text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-2"><Icons.Play />{t.hero.video}</button>
          </div>
        </div>
      </div>
      {video && <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setVideo(false)}><div className="relative max-w-4xl w-full aspect-video bg-zinc-900 rounded-2xl overflow-hidden"><button onClick={() => setVideo(false)} className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white"><Icons.X /></button><iframe className="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" allow="autoplay" allowFullScreen /></div></div>}
    </section>
  )
}

const VehicleCard = ({ v, t, onSelect, onFav, onComp, isFav, isComp, darkMode = true }) => (
  <div className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl ${darkMode ? 'bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/50 hover:shadow-amber-500/10' : 'bg-white border border-gray-200 hover:border-amber-400 shadow-md hover:shadow-amber-200/50'}`}>
    <div className="relative aspect-[16/10] overflow-hidden">
      <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); onFav(v.id) }} className={`p-2 rounded-full backdrop-blur-sm ${isFav ? 'bg-red-500 text-white' : 'bg-black/50 text-white'}`}><Icons.Heart filled={isFav} /></button>
        <button onClick={(e) => { e.stopPropagation(); onComp(v.id) }} className={`p-2 rounded-full backdrop-blur-sm ${isComp ? 'bg-amber-500 text-black' : 'bg-black/50 text-white'}`}><Icons.Compare /></button>
      </div>
      <span className="absolute top-4 left-4 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase">{v.category}</span>
      <div className="absolute bottom-4 left-4 flex items-center gap-1 text-amber-400"><Icons.Star /><span className="text-white font-semibold">{v.rating}</span><span className="text-zinc-400 text-sm">({v.reviews})</span></div>
    </div>
    <div className="p-5">
      <div className="flex justify-between items-start mb-3">
        <div><p className={`text-sm ${darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>{v.brand}</p><h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{v.name}</h3></div>
        <div className="text-right"><p className="text-amber-500 font-bold text-xl">{formatPrice(v.price)}</p><p className={`text-sm ${darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>{t.fleet.perDay}</p></div>
      </div>
      <div className={`flex gap-4 mb-4 text-sm ${darkMode ? 'text-zinc-400' : 'text-gray-500'}`}><span className="flex items-center gap-1"><Icons.Speed />{v.specs.speed}</span><span className="flex items-center gap-1"><Icons.Users />{v.specs.seats}</span><span className="flex items-center gap-1"><Icons.Gear />{v.specs.transmission}</span></div>
      <div className="flex gap-2">
        <button onClick={() => onSelect(v)} className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${darkMode ? 'border border-zinc-700 text-white hover:border-amber-500 hover:text-amber-500' : 'border border-gray-300 text-gray-700 hover:border-amber-500 hover:text-amber-600'}`}>{t.fleet.viewDetails}</button>
        <button onClick={() => onSelect(v, true)} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-black py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all">{t.fleet.bookNow}</button>
      </div>
    </div>
  </div>
)

const Fleet = ({ t, vehicles, onSelect, favorites, compareList, onFav, onComp, darkMode = true }) => {
  const [cat, setCat] = useState('all')
  const [brand, setBrand] = useState('all')
  const [search, setSearch] = useState('')
  const brands = useMemo(() => ['all', ...new Set(vehicles.map(v => v.brand))], [vehicles])
  const filtered = useMemo(() => vehicles.filter(v => (cat === 'all' || v.category === cat) && (brand === 'all' || v.brand === brand) && (!search || v.name.toLowerCase().includes(search.toLowerCase()))), [vehicles, cat, brand, search])
  
  return (
    <section id="fleet" className={`py-24 ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12"><h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t.fleet.title}</h2><p className={`text-lg ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{t.fleet.subtitle}</p></div>
        <div className={`rounded-2xl p-6 mb-10 ${darkMode ? 'bg-zinc-900/50 border border-zinc-800' : 'bg-white border border-gray-200 shadow-md'}`}>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]"><div className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-zinc-500' : 'text-gray-400'}`}><Icons.Search /></div><input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className={`w-full rounded-lg pl-10 pr-4 py-2.5 transition-colors ${darkMode ? 'bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-amber-500' : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-amber-500'}`} /></div>
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className={`rounded-lg px-4 py-2.5 ${darkMode ? 'bg-zinc-800 border border-zinc-700 text-white' : 'bg-gray-50 border border-gray-300 text-gray-900'}`}>{brands.map(b => <option key={b} value={b}>{b === 'all' ? 'All Brands' : b}</option>)}</select>
          </div>
          <div className={`flex flex-wrap gap-2 mt-4 pt-4 border-t ${darkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
            {[{id:'all',l:t.fleet.all},{id:'supercar',l:t.fleet.supercar},{id:'luxury',l:t.fleet.luxury},{id:'suv',l:t.fleet.suv}].map(c => <button key={c.id} onClick={() => setCat(c.id)} className={`px-5 py-2 rounded-lg font-medium transition-colors ${cat === c.id ? 'bg-amber-500 text-black' : (darkMode ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}`}>{c.l}</button>)}
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{filtered.map(v => <VehicleCard key={v.id} v={v} t={t} onSelect={onSelect} onFav={onFav} onComp={onComp} isFav={favorites.includes(v.id)} isComp={compareList.includes(v.id)} darkMode={darkMode} />)}</div>
        {filtered.length === 0 && <p className={`text-center py-12 ${darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>No vehicles found</p>}
      </div>
    </section>
  )
}

const Packages = ({ t, onSelect, darkMode = true }) => (
  <section id="packages" className={`py-24 ${darkMode ? 'bg-zinc-950' : 'bg-white'}`}>
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12"><h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t.packages.title}</h2><p className={`text-lg ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{t.packages.subtitle}</p></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map(p => (
          <div key={p.id} className={`group rounded-2xl overflow-hidden transition-all duration-300 ${darkMode ? 'bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/50' : 'bg-gray-50 border border-gray-200 hover:border-amber-400 shadow-md'}`}>
            <div className="relative aspect-[4/3] overflow-hidden"><img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /><div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" /><div className="absolute bottom-4 left-4 text-white font-bold text-lg">{p.name}</div></div>
            <div className="p-5"><p className={`text-sm mb-4 ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{p.description}</p><div className="flex justify-between items-center mb-4"><span className={`text-sm ${darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>{t.packages.from}</span><span className="text-amber-500 font-bold text-xl">{formatPrice(p.price)}</span></div><button onClick={() => onSelect(p)} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all">{t.packages.bookPackage}</button></div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const Reviews = ({ t, reviews, darkMode = true }) => (
  <section id="reviews" className={`py-24 ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12"><h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t.reviews.title}</h2><p className={`text-lg ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{t.reviews.subtitle}</p></div>
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map(r => (
          <div key={r.id} className={`rounded-2xl p-6 ${darkMode ? 'bg-zinc-900/50 border border-zinc-800' : 'bg-white border border-gray-200 shadow-md'}`}>
            <div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">{r.customer.charAt(0)}</div><div><p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{r.customer}</p><div className="flex items-center gap-2"><div className="flex text-amber-400">{[...Array(5)].map((_,i) => <Icons.Star key={i} filled={i < r.rating} />)}</div>{r.verified && <span className="text-green-400 text-xs flex items-center gap-1"><Icons.Check />{t.reviews.verified}</span>}</div></div></div>
            <p className={darkMode ? 'text-zinc-300' : 'text-gray-600'}>{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const FAQ = ({ t, darkMode = true }) => {
  const [open, setOpen] = useState(null)
  return (
    <section id="faq" className={`py-24 ${darkMode ? 'bg-zinc-950' : 'bg-white'}`}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12"><h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t.faq.title}</h2><p className={`text-lg ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{t.faq.subtitle}</p></div>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className={`rounded-xl overflow-hidden ${darkMode ? 'bg-zinc-900/50 border border-zinc-800' : 'bg-gray-50 border border-gray-200'}`}>
              <button onClick={() => setOpen(open === i ? null : i)} className={`w-full flex items-center justify-between p-5 text-left ${darkMode ? 'text-white' : 'text-gray-900'}`}><span className="font-medium pr-4">{f.q}</span><Icons.ChevronDown /></button>
              {open === i && <div className={`px-5 pb-5 border-t pt-4 ${darkMode ? 'text-zinc-400 border-zinc-800' : 'text-gray-600 border-gray-200'}`}>{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Newsletter = ({ t, darkMode = true }) => {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const submit = (e) => { e.preventDefault(); if (email) { setDone(true); setEmail(''); setTimeout(() => setDone(false), 3000) } }
  return (
    <section className={`py-16 border-y ${darkMode ? 'bg-gradient-to-r from-amber-500/10 to-orange-600/10 border-amber-500/20' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'}`}>
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t.newsletter.title}</h3>
        <p className={`mb-6 ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{t.newsletter.subtitle}</p>
        {done ? <p className="text-green-400 flex items-center justify-center gap-2"><Icons.Check />{t.newsletter.success}</p> : (
          <form onSubmit={submit} className="flex gap-3 max-w-md mx-auto">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.newsletter.placeholder} required className={`flex-1 rounded-lg px-4 py-3 transition-colors ${darkMode ? 'bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-amber-500' : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-amber-500'}`} />
            <button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-600 text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all">{t.newsletter.subscribe}</button>
          </form>
        )}
      </div>
    </section>
  )
}

const Footer = ({ t, scrollTo, darkMode = true }) => (
  <footer id="contact" className={`py-16 border-t ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-100 border-gray-200'}`}>
    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12">
      <div><Logo darkMode={darkMode} /><p className={`text-sm mt-4 mb-6 ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{t.footer.about}</p><div className="flex gap-4"><a href="#" className={`transition-colors ${darkMode ? 'text-zinc-400 hover:text-amber-500' : 'text-gray-500 hover:text-amber-600'}`}><Icons.Instagram /></a><a href="#" className={`transition-colors ${darkMode ? 'text-zinc-400 hover:text-amber-500' : 'text-gray-500 hover:text-amber-600'}`}><Icons.Facebook /></a><a href="#" className={`transition-colors ${darkMode ? 'text-zinc-400 hover:text-amber-500' : 'text-gray-500 hover:text-amber-600'}`}><Icons.Twitter /></a></div></div>
      <div><h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t.footer.links}</h4><ul className="space-y-2">{['home','fleet','packages','reviews'].map(i => <li key={i}><button onClick={() => scrollTo(i)} className={`transition-colors ${darkMode ? 'text-zinc-400 hover:text-amber-500' : 'text-gray-600 hover:text-amber-600'}`}>{t.nav[i]}</button></li>)}</ul></div>
      <div><h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t.footer.contact}</h4><ul className={`space-y-3 ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}><li className="flex items-center gap-2"><Icons.Phone />+971 50 123 4567</li><li className="flex items-center gap-2"><Icons.WhatsApp />+971 50 123 4567</li><li className="flex items-center gap-2"><Icons.Location />Dubai Marina, UAE</li></ul></div>
      <div><h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>We Accept</h4><div className="flex flex-wrap gap-3"><PaymentIcons.Visa /><PaymentIcons.Mastercard /></div></div>
    </div>
    <div className={`border-t mt-12 pt-8 text-center text-sm max-w-7xl mx-auto px-4 ${darkMode ? 'border-zinc-800 text-zinc-500' : 'border-gray-200 text-gray-500'}`}>© {new Date().getFullYear()} APEX MOTORS. {t.footer.rights}</div>
  </footer>
)

// Calculator Modal
const Calculator = ({ t, vehicles, onClose }) => {
  const [vid, setVid] = useState(vehicles[0]?.id)
  const [days, setDays] = useState(1)
  const [exts, setExts] = useState([])
  const v = vehicles.find(x => x.id === vid)
  const extTotal = exts.reduce((s, id) => s + (extras.find(e => e.id === id)?.price || 0), 0) * days
  const total = v ? (v.price * days) + extTotal : 0
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-white flex items-center gap-2"><Icons.Calculator />{t.calculator.title}</h2><button onClick={onClose} className="text-zinc-400 hover:text-white"><Icons.X /></button></div>
        <div className="space-y-4">
          <select value={vid} onChange={(e) => setVid(Number(e.target.value))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white">{vehicles.map(v => <option key={v.id} value={v.id}>{v.name} - {formatPrice(v.price)}/day</option>)}</select>
          <div className="flex items-center justify-between"><span className="text-zinc-400">{t.calculator.days}</span><div className="flex items-center gap-4"><button onClick={() => setDays(Math.max(1, days - 1))} className="p-2 bg-zinc-800 rounded-lg"><Icons.Minus /></button><span className="text-2xl font-bold text-white w-12 text-center">{days}</span><button onClick={() => setDays(days + 1)} className="p-2 bg-zinc-800 rounded-lg"><Icons.Plus /></button></div></div>
          <div className="space-y-2">{extras.map(e => <label key={e.id} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg cursor-pointer"><div className="flex items-center gap-3"><input type="checkbox" checked={exts.includes(e.id)} onChange={(ev) => setExts(ev.target.checked ? [...exts, e.id] : exts.filter(x => x !== e.id))} className="accent-amber-500" /><span className="text-white">{e.name}</span></div><span className="text-amber-500">{formatPrice(e.price)}/day</span></label>)}</div>
          <div className="pt-4 border-t border-zinc-700 flex justify-between items-center"><span className="text-zinc-400">{t.calculator.total}</span><span className="text-3xl font-bold text-amber-500">{formatPrice(total)}</span></div>
        </div>
      </div>
    </div>
  )
}

// Vehicle Detail Modal
const VehicleDetail = ({ v, t, onClose, onBook }) => {
  const [img, setImg] = useState(0)
  if (!v) return null
  const images = v.images?.length ? v.images : [v.image]
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-4 px-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl my-auto" onClick={e => e.stopPropagation()}>
        <div className="relative">
          <img src={images[img] || v.image} alt={v.name} className="w-full aspect-video object-cover rounded-t-2xl" />
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"><Icons.X /></button>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setImg(i => i > 0 ? i - 1 : images.length - 1) }} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"><Icons.ChevronLeft /></button>
              <button onClick={(e) => { e.stopPropagation(); setImg(i => i < images.length - 1 ? i + 1 : 0) }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"><Icons.ChevronRight /></button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => <button key={i} onClick={(e) => { e.stopPropagation(); setImg(i) }} className={`w-2 h-2 rounded-full transition-all ${i === img ? 'bg-amber-500 w-6' : 'bg-white/50 hover:bg-white/80'}`} />)}
              </div>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 p-4 overflow-x-auto">
            {images.map((imgUrl, i) => (
              <button key={i} onClick={() => setImg(i)} className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === img ? 'border-amber-500' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <img src={imgUrl} alt={`${v.name} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div>
              <p className="text-amber-500 font-medium">{v.brand}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{v.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">{[...Array(5)].map((_,i) => <Icons.Star key={i} filled={i < Math.floor(v.rating)} />)}</div>
                <span className="text-zinc-400">{v.rating} ({v.reviews})</span>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-amber-500 font-bold text-2xl md:text-3xl">{formatPrice(v.price)}</p>
              <p className="text-zinc-500">{t.fleet.perDay}</p>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Specs</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
              {[
                {i:<Icons.Speed />,l:'Speed',v:v.specs?.speed || '-'},
                {i:<Icons.Speed />,l:'0-100',v:v.specs?.acceleration || '-'},
                {i:<Icons.Users />,l:'Seats',v:v.specs?.seats || '-'},
                {i:<Icons.Gear />,l:'Fuel',v:v.specs?.fuel || '-'},
                {i:<Icons.Gear />,l:'Trans',v:v.specs?.transmission || '-'}
              ].map((s,i) => (
                <div key={i} className="bg-zinc-800/50 rounded-lg p-2 md:p-3 text-center">
                  <div className="text-amber-500 flex justify-center mb-1">{s.i}</div>
                  <p className="text-zinc-500 text-xs">{s.l}</p>
                  <p className="text-white font-semibold text-xs md:text-sm">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
          {v.features?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {v.features.map((f,i) => <span key={i} className="bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"><Icons.Check />{f}</span>)}
              </div>
            </div>
          )}
          <button onClick={() => onBook(v)} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all">{t.fleet.bookNow}</button>
        </div>
      </div>
    </div>
  )
}

// Checkout Modal
const Checkout = ({ item, t, coupons, onClose, onSuccess }) => {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [loc, setLoc] = useState('')
  const [exts, setExts] = useState([])
  const [code, setCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' })
  
  const days = getDays(pickup, dropoff)
  const base = item?.price ? item.price * (days || 1) : 0
  const extPrice = exts.reduce((s, id) => s + (extras.find(e => e.id === id)?.price || 0), 0) * (days || 1)
  const subtotal = base + extPrice
  const discount = coupon ? (coupon.type === 'percent' || coupon.type === 'PERCENT' ? subtotal * coupon.discount / 100 : coupon.discount) : 0
  const total = Math.max(0, subtotal - discount)
  
  const applyCoupon = async () => {
    if (!code.trim()) return
    setErr('')
    try {
      // Try API first
      const result = await api.validateCoupon(code, subtotal)
      if (result.valid) {
        setCoupon({ code: result.coupon.code, discount: result.coupon.discount, type: result.coupon.type, minOrder: result.coupon.minOrder })
        setErr('')
      } else {
        setErr(result.message || 'Invalid coupon')
        setCoupon(null)
      }
    } catch (error) {
      // Fallback to local coupons
      const c = coupons.find(x => x.code.toLowerCase() === code.toLowerCase() && x.active)
      if (!c) { setErr('Invalid coupon'); setCoupon(null) }
      else if (subtotal < c.minOrder) { setErr(`Min order: ${formatPrice(c.minOrder)}`); setCoupon(null) }
      else { setCoupon(c); setErr('') }
    }
  }
  
  const submit = async (e) => {
    e.preventDefault()
    if (!customer.name || !customer.email) return alert('Please fill all required fields')
    if (!pickup || !dropoff) return alert('Please select dates')
    if (!loc) return alert('Please select a location')
    
    setLoading(true)
    
    try {
      // Try API booking
      const bookingData = {
        vehicleId: item.id,
        pickupDate: pickup,
        dropoffDate: dropoff,
        pickupLocation: loc,
        dropoffLocation: loc,
        extras: exts,
        couponCode: coupon?.code || null,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone || '',
      }
      
      const result = await api.createBooking(bookingData)
      
      // For now, simulate payment success (Stripe integration would go here)
      setLoading(false)
      onSuccess({ 
        ...item, 
        customer, 
        total: result.booking?.totalPrice || total,
        bookingRef: result.booking?.reference || `APEX-${Date.now()}`
      })
    } catch (error) {
      console.error('Booking error:', error)
      // Fallback to local booking
      setLoading(false)
      onSuccess({ ...item, customer, total, bookingRef: `APEX-${Date.now()}` })
    }
  }
  
  if (!item) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full my-8" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-white">{t.checkout.title}</h2><button onClick={onClose} className="text-zinc-400 hover:text-white"><Icons.X /></button></div>
          <div className="flex gap-4 p-4 bg-zinc-800/50 rounded-xl mb-6"><img src={item.image} alt={item.name} className="w-24 h-16 object-cover rounded-lg" /><div><p className="text-white font-semibold">{item.name}</p><p className="text-amber-500 font-bold">{formatPrice(item.price)} {t.fleet.perDay}</p></div></div>
          <form onSubmit={submit} className="space-y-4">
            <input type="text" placeholder="Full Name *" value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500" />
            <input type="email" placeholder="Email *" value={customer.email} onChange={(e) => setCustomer({...customer, email: e.target.value})} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500" />
            <input type="tel" placeholder="Phone" value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500" />
            <div className="grid grid-cols-2 gap-4"><input type="date" value={pickup} onChange={(e) => setPickup(e.target.value)} min={new Date().toISOString().split('T')[0]} required className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white" /><input type="date" value={dropoff} onChange={(e) => setDropoff(e.target.value)} min={pickup} required className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white" /></div>
            <select value={loc} onChange={(e) => setLoc(e.target.value)} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white"><option value="">Select location...</option>{locations.map(l => <option key={l} value={l}>{l}</option>)}</select>
            <div className="space-y-2">{extras.map(e => <label key={e.id} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg cursor-pointer"><div className="flex items-center gap-3"><input type="checkbox" checked={exts.includes(e.id)} onChange={(ev) => setExts(ev.target.checked ? [...exts, e.id] : exts.filter(x => x !== e.id))} className="accent-amber-500" /><span className="text-white text-sm">{e.name}</span></div><span className="text-amber-500 text-sm">{formatPrice(e.price)}/day</span></label>)}</div>
            <div className="flex gap-2"><input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon" className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm" /><button type="button" onClick={applyCoupon} className="bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm">{t.checkout.apply}</button></div>
            {err && <p className="text-red-500 text-sm">{err}</p>}{coupon && <p className="text-green-500 text-sm">✓ {coupon.code} applied!</p>}
            {days > 0 && <div className="bg-zinc-800/50 rounded-xl p-4 space-y-2"><div className="flex justify-between text-zinc-400 text-sm"><span>{days} {t.checkout.days} × {formatPrice(item.price)}</span><span>{formatPrice(base)}</span></div>{extPrice > 0 && <div className="flex justify-between text-zinc-400 text-sm"><span>{t.checkout.extras}</span><span>{formatPrice(extPrice)}</span></div>}{discount > 0 && <div className="flex justify-between text-green-400 text-sm"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}<div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-zinc-700"><span>{t.checkout.total}</span><span className="text-amber-500">{formatPrice(total)}</span></div></div>}
            <div className="flex justify-center gap-3"><PaymentIcons.Visa /><PaymentIcons.Mastercard /></div>
            <button type="submit" disabled={loading || days === 0} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black py-4 rounded-xl font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2">{loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <><Icons.Shield />{t.checkout.confirm}</>}</button>
            <p className="text-center text-zinc-500 text-sm flex items-center justify-center gap-1"><Icons.Shield />{t.checkout.secure}</p>
          </form>
        </div>
      </div>
    </div>
  )
}

// Success Modal
const Success = ({ t, booking, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center max-w-sm w-full" onClick={e => e.stopPropagation()}>
      <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><Icons.Check /></div>
      <h2 className="text-2xl font-bold text-white mb-2">{t.checkout.success}</h2>
      <p className="text-zinc-400 mb-6">Confirmation sent to {booking?.customer?.email}</p>
      <div className="flex gap-3"><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"><Icons.WhatsApp />WhatsApp</a><button onClick={onClose} className="flex-1 border border-zinc-700 text-white py-3 rounded-xl font-semibold">Close</button></div>
    </div>
  </div>
)

// Favorites Panel
const Favorites = ({ t, vehicles, favorites, onClose, onSelect, onFav }) => {
  const favs = vehicles.filter(v => favorites.includes(v.id))
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-zinc-900 border-l border-zinc-800 overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6"><div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-white">Favorites</h2><button onClick={onClose} className="text-zinc-400 hover:text-white"><Icons.X /></button></div>
        {favs.length === 0 ? <p className="text-zinc-500 text-center py-8">No favorites yet</p> : <div className="space-y-4">{favs.map(v => <div key={v.id} className="flex gap-4 p-4 bg-zinc-800/50 rounded-xl"><img src={v.image} alt={v.name} className="w-24 h-16 object-cover rounded-lg" /><div className="flex-1"><h3 className="text-white font-semibold">{v.name}</h3><p className="text-amber-500 font-bold">{formatPrice(v.price)}/day</p></div><div className="flex flex-col gap-2"><button onClick={() => onFav(v.id)} className="p-2 text-red-500"><Icons.Trash /></button><button onClick={() => { onSelect(v, true); onClose() }} className="p-2 text-amber-500"><Icons.Calendar /></button></div></div>)}</div>}
        </div>
      </div>
    </div>
  )
}

// Compare Panel
const Compare = ({ t, vehicles, compareList, onClose, onComp }) => {
  const cars = vehicles.filter(v => compareList.includes(v.id))
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen py-8 px-4"><div className="max-w-6xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6"><div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-white">Compare</h2><button onClick={onClose} className="text-zinc-400 hover:text-white"><Icons.X /></button></div>
        {cars.length === 0 ? <p className="text-zinc-500 text-center py-8">Add vehicles to compare</p> : <div className="overflow-x-auto"><table className="w-full"><thead><tr><th className="p-4"></th>{cars.map(v => <th key={v.id} className="p-4 min-w-[200px]"><div className="relative"><button onClick={() => onComp(v.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs">×</button><img src={v.image} alt={v.name} className="w-full h-32 object-cover rounded-lg mb-2" /><p className="text-white font-bold">{v.name}</p><p className="text-amber-500 font-semibold">{formatPrice(v.price)}/day</p></div></th>)}</tr></thead><tbody>{['speed','acceleration','seats','fuel','transmission'].map(k => <tr key={k} className="border-t border-zinc-800"><td className="text-zinc-400 p-4 capitalize">{k}</td>{cars.map(v => <td key={v.id} className="text-white p-4 text-center">{v.specs[k]}</td>)}</tr>)}</tbody></table></div>}
        </div>
      </div></div>
    </div>
  )
}

// Live Chat
const Chat = ({ t }) => {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([{ from: 'bot', text: t.chat.welcome }])
  const [input, setInput] = useState('')
  const send = () => { if (!input.trim()) return; setMsgs([...msgs, { from: 'user', text: input }]); setInput(''); setTimeout(() => setMsgs(prev => [...prev, { from: 'bot', text: 'Thanks! Our team will respond shortly. For immediate help, use WhatsApp.' }]), 1000) }
  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40"><Icons.Chat /></button>
      {open && <div className="fixed bottom-24 right-6 w-80 h-96 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl z-50 flex flex-col">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 flex justify-between items-center"><div><h3 className="text-black font-bold">{t.chat.title}</h3><p className="text-black/70 text-sm flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full"></span>Online</p></div><button onClick={() => setOpen(false)} className="text-black"><Icons.X /></button></div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">{msgs.map((m, i) => <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] p-3 rounded-lg ${m.from === 'user' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-white'}`}>{m.text}</div></div>)}</div>
        <div className="p-3 border-t border-zinc-800"><div className="flex gap-2"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && send()} placeholder={t.chat.placeholder} className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm" /><button onClick={send} className="p-2 bg-amber-500 text-black rounded-lg"><Icons.Send /></button></div></div>
      </div>}
    </>
  )
}

// Admin Login
const AdminLogin = ({ onSuccess, onClose }) => {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const submit = (e) => { e.preventDefault(); if (pw === ADMIN_PASSWORD) onSuccess(); else setErr('Wrong password') }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-6"><div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4"><Icons.Shield /></div><h2 className="text-2xl font-bold text-white">Admin Access</h2></div>
        <form onSubmit={submit}><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" autoFocus className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 mb-4" />{err && <p className="text-red-500 text-sm mb-4">{err}</p>}<button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black py-3 rounded-xl font-bold">Access</button></form>
        <button onClick={onClose} className="w-full mt-3 text-zinc-400 text-sm">Cancel</button>
      </div>
    </div>
  )
}

// Admin Panel
const VehicleForm = ({ vehicle, onSave, onCancel }) => {
  const [form, setForm] = useState(vehicle || {
    name: '', brand: '', category: 'supercar', price: '', image: '', images: [],
    specs: { speed: '', acceleration: '', seats: 2, fuel: 'Petrol', transmission: 'Automatic' },
    features: [], rating: 5.0, reviews: 0, available: true
  })
  const [featureInput, setFeatureInput] = useState('')
  const [imageInput, setImageInput] = useState('')
  
  // Ensure images array exists
  const images = form.images || []
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.brand || !form.price) return alert('Please fill all required fields')
    if (!form.image && images.length === 0) return alert('Please add at least one image')
    const mainImage = form.image || images[0]
    const allImages = form.image ? [form.image, ...images.filter(i => i !== form.image)] : images
    onSave({ ...form, id: vehicle?.id || Date.now(), price: parseFloat(form.price), image: mainImage, images: allImages })
  }
  
  const addImage = () => {
    if (imageInput.trim() && !images.includes(imageInput.trim())) {
      const newImages = [...images, imageInput.trim()]
      setForm(prev => ({ ...prev, images: newImages, image: prev.image || imageInput.trim() }))
      setImageInput('')
    }
  }
  
  const removeImage = (idx) => {
    const newImages = images.filter((_, i) => i !== idx)
    const removedWasMain = images[idx] === form.image
    setForm(prev => ({ 
      ...prev, 
      images: newImages, 
      image: removedWasMain ? (newImages[0] || '') : prev.image 
    }))
  }
  
  const setMainImage = (imgUrl) => setForm(prev => ({ ...prev, image: imgUrl }))
  
  const addFeature = () => {
    if (featureInput.trim()) {
      setForm(prev => ({ ...prev, features: [...(prev.features || []), featureInput.trim()] }))
      setFeatureInput('')
    }
  }
  
  const removeFeature = (idx) => setForm(prev => ({ ...prev, features: (prev.features || []).filter((_, i) => i !== idx) }))
  
  const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
  const labelClass = "block text-zinc-400 text-sm mb-2"
  
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-900 z-10">
          <h3 className="text-xl font-bold text-white">{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
          <button onClick={onCancel} className="text-zinc-400 hover:text-white"><Icons.X /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={labelClass}>Vehicle Name *</label><input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className={inputClass} placeholder="e.g. Lamborghini Huracán EVO" required /></div>
            <div><label className={labelClass}>Brand *</label><input type="text" value={form.brand} onChange={(e) => setForm({...form, brand: e.target.value})} className={inputClass} placeholder="e.g. Lamborghini" required /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={labelClass}>Category *</label><select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className={inputClass}><option value="supercar">Supercar</option><option value="luxury">Luxury</option><option value="suv">SUV</option><option value="sports">Sports</option></select></div>
            <div><label className={labelClass}>Price per Day (AED) *</label><input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className={inputClass} placeholder="e.g. 3500" required /></div>
          </div>
          
          {/* Multiple Images Section */}
          <div className="border-t border-zinc-800 pt-6">
            <h4 className="text-white font-semibold mb-4">Vehicle Images *</h4>
            <div className="flex gap-2 mb-4">
              <input type="url" value={imageInput} onChange={(e) => setImageInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())} className={inputClass} placeholder="Paste image URL and click Add..." />
              <button type="button" onClick={addImage} className="bg-amber-500 text-black px-4 rounded-lg font-semibold hover:bg-amber-400 flex items-center gap-1"><Icons.Plus /> Add</button>
            </div>
            {images.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className={`relative group rounded-lg overflow-hidden border-2 ${form.image === img ? 'border-amber-500' : 'border-zinc-700'}`}>
                    <img src={img} alt={`Image ${i + 1}`} className="w-full h-24 object-cover" onError={(e) => e.target.src='https://via.placeholder.com/200x150?text=Error'} />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {form.image !== img && (
                        <button type="button" onClick={() => setMainImage(img)} className="p-1.5 bg-amber-500 rounded text-black text-xs" title="Set as main">
                          <Icons.Star filled={false} />
                        </button>
                      )}
                      <button type="button" onClick={() => removeImage(i)} className="p-1.5 bg-red-500 rounded text-white text-xs" title="Remove">
                        <Icons.Trash />
                      </button>
                    </div>
                    {form.image === img && <span className="absolute top-1 left-1 bg-amber-500 text-black text-[10px] px-1.5 py-0.5 rounded font-bold">MAIN</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-sm text-center py-8 border border-dashed border-zinc-700 rounded-lg">No images added yet. Add at least one image URL above.</p>
            )}
            <p className="text-zinc-500 text-xs mt-2">💡 Tip: Add multiple images to show different angles. Click the star to set main image.</p>
          </div>
          
          <div className="border-t border-zinc-800 pt-6"><h4 className="text-white font-semibold mb-4">Specifications</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div><label className={labelClass}>Top Speed</label><input type="text" value={form.specs?.speed || ''} onChange={(e) => setForm({...form, specs: {...(form.specs || {}), speed: e.target.value}})} className={inputClass} placeholder="e.g. 325 km/h" /></div>
              <div><label className={labelClass}>0-100 km/h</label><input type="text" value={form.specs?.acceleration || ''} onChange={(e) => setForm({...form, specs: {...(form.specs || {}), acceleration: e.target.value}})} className={inputClass} placeholder="e.g. 2.9s" /></div>
              <div><label className={labelClass}>Seats</label><input type="number" value={form.specs?.seats || 2} onChange={(e) => setForm({...form, specs: {...(form.specs || {}), seats: parseInt(e.target.value) || 2}})} className={inputClass} min="1" max="10" /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div><label className={labelClass}>Fuel Type</label><select value={form.specs?.fuel || 'Petrol'} onChange={(e) => setForm({...form, specs: {...(form.specs || {}), fuel: e.target.value}})} className={inputClass}><option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option></select></div>
              <div><label className={labelClass}>Transmission</label><select value={form.specs?.transmission || 'Automatic'} onChange={(e) => setForm({...form, specs: {...(form.specs || {}), transmission: e.target.value}})} className={inputClass}><option>Automatic</option><option>Manual</option><option>PDK</option><option>SSG</option></select></div>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-6"><h4 className="text-white font-semibold mb-4">Features</h4>
            <div className="flex gap-2 mb-3"><input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} className={inputClass} placeholder="Add a feature..." /><button type="button" onClick={addFeature} className="bg-amber-500 text-black px-4 rounded-lg font-semibold hover:bg-amber-400"><Icons.Plus /></button></div>
            <div className="flex flex-wrap gap-2">{(form.features || []).map((f, i) => <span key={i} className="bg-zinc-800 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">{f}<button type="button" onClick={() => removeFeature(i)} className="text-zinc-400 hover:text-red-400"><Icons.X /></button></span>)}</div>
          </div>
          <div className="flex items-center gap-3"><input type="checkbox" id="available" checked={form.available !== false} onChange={(e) => setForm({...form, available: e.target.checked})} className="w-5 h-5 rounded bg-zinc-800 border-zinc-700 text-amber-500" /><label htmlFor="available" className="text-white">Available for rent</label></div>
          <div className="flex gap-4 pt-4"><button type="button" onClick={onCancel} className="flex-1 border border-zinc-700 text-white py-3 rounded-lg font-semibold hover:bg-zinc-800">Cancel</button><button type="submit" className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-black py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/30">{vehicle ? 'Update Vehicle' : 'Add Vehicle'}</button></div>
        </form>
      </div>
    </div>
  )
}

const CouponForm = ({ coupon, onSave, onCancel }) => {
  const [form, setForm] = useState(coupon || { code: '', discount: '', type: 'percent', minOrder: '', active: true })
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.code || !form.discount) return alert('Please fill all required fields')
    onSave({ ...form, id: coupon?.id || Date.now(), discount: parseFloat(form.discount), minOrder: parseFloat(form.minOrder) || 0 })
  }
  const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
  
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center"><h3 className="text-xl font-bold text-white">{coupon ? 'Edit Coupon' : 'Add New Coupon'}</h3><button onClick={onCancel} className="text-zinc-400 hover:text-white"><Icons.X /></button></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="block text-zinc-400 text-sm mb-2">Coupon Code *</label><input type="text" value={form.code} onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})} className={inputClass} placeholder="e.g. SUMMER25" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-zinc-400 text-sm mb-2">Discount *</label><input type="number" value={form.discount} onChange={(e) => setForm({...form, discount: e.target.value})} className={inputClass} placeholder="e.g. 20" required /></div>
            <div><label className="block text-zinc-400 text-sm mb-2">Type</label><select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className={inputClass}><option value="percent">Percentage (%)</option><option value="fixed">Fixed (AED)</option></select></div>
          </div>
          <div><label className="block text-zinc-400 text-sm mb-2">Minimum Order (AED)</label><input type="number" value={form.minOrder} onChange={(e) => setForm({...form, minOrder: e.target.value})} className={inputClass} placeholder="e.g. 1000" /></div>
          <div className="flex items-center gap-3"><input type="checkbox" id="couponActive" checked={form.active} onChange={(e) => setForm({...form, active: e.target.checked})} className="w-5 h-5 rounded bg-zinc-800 border-zinc-700 text-amber-500" /><label htmlFor="couponActive" className="text-white">Active</label></div>
          <div className="flex gap-4 pt-4"><button type="button" onClick={onCancel} className="flex-1 border border-zinc-700 text-white py-3 rounded-lg font-semibold hover:bg-zinc-800">Cancel</button><button type="submit" className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-black py-3 rounded-lg font-semibold">{coupon ? 'Update' : 'Add Coupon'}</button></div>
        </form>
      </div>
    </div>
  )
}

const Admin = ({ t, data, onClose, onUpdate, onRefresh }) => {
  const [tab, setTab] = useState('dashboard')
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [showCouponForm, setShowCouponForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [saving, setSaving] = useState(false)
  const { vehicles, bookings, coupons, reviews } = data
  const stats = { revenue: bookings.reduce((s, b) => s + b.total, 0), bookings: bookings.length, vehicles: vehicles.length, customers: [...new Set(bookings.map(b => b.email))].length }
  
  const saveVehicle = async (v) => {
    setSaving(true)
    try {
      // Transform to API format
      const apiData = {
        name: v.name,
        brand: v.brand,
        category: v.category?.toUpperCase() || 'LUXURY',
        pricePerDay: parseFloat(v.price),
        mainImage: v.image,
        images: v.images || [v.image],
        topSpeed: v.specs?.speed || '',
        acceleration: v.specs?.acceleration || '',
        seats: parseInt(v.specs?.seats) || 4,
        fuelType: v.specs?.fuel || 'Petrol',
        transmission: v.specs?.transmission || 'Automatic',
        features: v.features || [],
        isActive: v.available !== false
      }
      
      if (editingVehicle) {
        await api.updateVehicle(v.id, apiData)
      } else {
        await api.createVehicle(apiData)
      }
      await onRefresh()
      setShowVehicleForm(false)
      setEditingVehicle(null)
    } catch (error) {
      alert('Error saving vehicle: ' + error.message)
    } finally {
      setSaving(false)
    }
  }
  
  const editVehicle = (v) => { setEditingVehicle(v); setShowVehicleForm(true) }
  
  const deleteVehicle = async (id) => {
    if (confirm('Delete this vehicle?')) {
      try {
        await api.deleteVehicle(id)
        await onRefresh()
      } catch (error) {
        alert('Error deleting vehicle: ' + error.message)
      }
    }
  }
  
  const saveCoupon = async (c) => {
    setSaving(true)
    try {
      const apiData = {
        code: c.code,
        discountType: c.type === 'percent' ? 'PERCENTAGE' : 'FIXED',
        discountValue: parseFloat(c.discount),
        minOrderAmount: parseFloat(c.minOrder) || 0,
        isActive: c.active !== false
      }
      
      if (editingCoupon) {
        await api.updateCoupon(c.id, apiData)
      } else {
        await api.createCoupon(apiData)
      }
      await onRefresh()
      setShowCouponForm(false)
      setEditingCoupon(null)
    } catch (error) {
      alert('Error saving coupon: ' + error.message)
    } finally {
      setSaving(false)
    }
  }
  
  const editCoupon = (c) => { setEditingCoupon(c); setShowCouponForm(true) }
  
  const deleteCoupon = async (id) => {
    if (confirm('Delete this coupon?')) {
      try {
        await api.deleteCoupon(id)
        await onRefresh()
      } catch (error) {
        alert('Error deleting coupon: ' + error.message)
      }
    }
  }
  
  const toggleCoupon = async (id) => {
    const coupon = coupons.find(c => c.id === id)
    if (coupon) {
      try {
        await api.updateCoupon(id, { isActive: !coupon.active })
        await onRefresh()
      } catch (error) {
        alert('Error updating coupon: ' + error.message)
      }
    }
  }
  
  const updateBookingStatus = async (id, status) => {
    try {
      await api.updateBookingStatus(id, status.toUpperCase())
      await onRefresh()
    } catch (error) {
      // Fallback to local update if API fails
      onUpdate('bookings', bookings.map(b => b.id === id ? {...b, status} : b))
    }
  }
  const deleteReview = (id) => { if (confirm('Delete this review?')) onUpdate('reviews', reviews.filter(r => r.id !== id)) }
  
  const exportCSV = (type) => {
    const d = type === 'bookings' ? bookings : type === 'vehicles' ? vehicles : []
    if (!d.length) return
    const csv = Object.keys(d[0]).join(',') + '\n' + d.map(r => Object.values(r).map(v => typeof v === 'object' ? JSON.stringify(v) : v).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${type}.csv`; a.click()
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black overflow-y-auto">
      <div className="bg-zinc-900 border-b border-zinc-800 p-4 sticky top-0 z-10"><div className="max-w-7xl mx-auto flex justify-between items-center"><div className="flex items-center gap-4"><Logo /><span className="text-amber-500 font-semibold">{t.admin.title}</span></div><button onClick={onClose} className="text-zinc-400 hover:text-white flex items-center gap-2"><Icons.X />Exit</button></div></div>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">{['dashboard','vehicles','bookings','coupons','reviews'].map(x => <button key={x} onClick={() => setTab(x)} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${tab === x ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>{t.admin[x]}</button>)}</div>
        
        {tab === 'dashboard' && <div><div className="grid md:grid-cols-4 gap-6 mb-8">{[{l:t.admin.revenue,v:formatPrice(stats.revenue),c:'from-green-500 to-emerald-600'},{l:t.admin.bookings,v:stats.bookings,c:'from-blue-500 to-cyan-600'},{l:t.admin.vehicles,v:stats.vehicles,c:'from-amber-500 to-orange-600'},{l:t.admin.customers,v:stats.customers,c:'from-purple-500 to-pink-600'}].map((s,i) => <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"><div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${s.c} flex items-center justify-center mb-4`}><Icons.Chart /></div><p className="text-zinc-400 text-sm">{s.l}</p><p className="text-3xl font-bold text-white">{s.v}</p></div>)}</div>
          <div className="grid md:grid-cols-2 gap-6"><div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"><h3 className="text-white font-bold mb-4">Recent Bookings</h3>{bookings.slice(0, 5).map(b => <div key={b.id} className="flex justify-between items-center py-3 border-b border-zinc-800 last:border-0"><div><p className="text-white">{b.vehicleName}</p><p className="text-zinc-500 text-sm">{b.customer}</p></div><span className={`px-2 py-1 rounded text-xs ${b.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{b.status}</span></div>)}</div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"><h3 className="text-white font-bold mb-4">Quick Actions</h3><div className="space-y-3"><button onClick={() => { setTab('vehicles'); setShowVehicleForm(true) }} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-lg flex items-center gap-3"><Icons.Plus />Add New Vehicle</button><button onClick={() => { setTab('coupons'); setShowCouponForm(true) }} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-lg flex items-center gap-3"><Icons.Plus />Create Coupon</button><button onClick={() => exportCSV('bookings')} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-lg flex items-center gap-3"><Icons.Download />Export Bookings</button></div></div></div>
        </div>}
        
        {tab === 'vehicles' && <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"><div className="p-4 border-b border-zinc-800 flex justify-between items-center"><h3 className="text-white font-bold">Vehicles ({vehicles.length})</h3><div className="flex gap-2"><button onClick={() => exportCSV('vehicles')} className="bg-zinc-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-zinc-700"><Icons.Download />Export</button><button onClick={() => setShowVehicleForm(true)} className="bg-amber-500 text-black px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-amber-400"><Icons.Plus />Add Vehicle</button></div></div><div className="overflow-x-auto"><table className="w-full"><thead className="bg-zinc-800"><tr><th className="text-left text-zinc-400 p-4">Vehicle</th><th className="text-left text-zinc-400 p-4">Category</th><th className="text-left text-zinc-400 p-4">Price/Day</th><th className="text-left text-zinc-400 p-4">Status</th><th className="text-right text-zinc-400 p-4">Actions</th></tr></thead><tbody>{vehicles.map(v => <tr key={v.id} className="border-t border-zinc-800 hover:bg-zinc-800/50"><td className="p-4"><div className="flex items-center gap-3"><img src={v.image} alt={v.name} className="w-20 h-12 object-cover rounded" /><div><p className="text-white font-medium">{v.name}</p><p className="text-zinc-500 text-sm">{v.brand}</p></div></div></td><td className="p-4"><span className="bg-zinc-800 px-2 py-1 rounded text-sm capitalize text-white">{v.category}</span></td><td className="p-4 text-amber-500 font-semibold">{formatPrice(v.price)}</td><td className="p-4"><span className={`px-2 py-1 rounded text-sm ${v.available !== false ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{v.available !== false ? 'Available' : 'Unavailable'}</span></td><td className="p-4 text-right"><button onClick={() => editVehicle(v)} className="text-zinc-400 hover:text-amber-500 p-2"><Icons.Edit /></button><button onClick={() => deleteVehicle(v.id)} className="text-zinc-400 hover:text-red-500 p-2"><Icons.Trash /></button></td></tr>)}</tbody></table></div></div>}
        
        {tab === 'bookings' && <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"><div className="p-4 border-b border-zinc-800 flex justify-between"><h3 className="text-white font-bold">Bookings ({bookings.length})</h3><button onClick={() => exportCSV('bookings')} className="bg-zinc-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-zinc-700"><Icons.Download />{t.admin.export}</button></div><div className="overflow-x-auto"><table className="w-full"><thead className="bg-zinc-800"><tr><th className="text-left text-zinc-400 p-4">ID</th><th className="text-left text-zinc-400 p-4">Vehicle</th><th className="text-left text-zinc-400 p-4">Customer</th><th className="text-left text-zinc-400 p-4">Date</th><th className="text-left text-zinc-400 p-4">Total</th><th className="text-left text-zinc-400 p-4">Status</th><th className="text-right text-zinc-400 p-4">Actions</th></tr></thead><tbody>{bookings.map(b => <tr key={b.id} className="border-t border-zinc-800 hover:bg-zinc-800/50"><td className="p-4 text-zinc-400 font-mono text-sm">#{b.id}</td><td className="p-4 text-white">{b.vehicleName}</td><td className="p-4"><p className="text-white">{b.customer}</p><p className="text-zinc-500 text-sm">{b.email}</p></td><td className="p-4 text-zinc-400">{b.date}</td><td className="p-4 text-amber-500 font-semibold">{formatPrice(b.total)}</td><td className="p-4"><select value={b.status} onChange={(e) => updateBookingStatus(b.id, e.target.value)} className={`px-2 py-1 rounded text-sm bg-transparent border cursor-pointer ${b.status === 'confirmed' ? 'border-green-500 text-green-400' : b.status === 'completed' ? 'border-blue-500 text-blue-400' : b.status === 'cancelled' ? 'border-red-500 text-red-400' : 'border-yellow-500 text-yellow-400'}`}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></td><td className="p-4 text-right"><a href={`mailto:${b.email}`} className="text-zinc-400 hover:text-amber-500 p-2 inline-block"><Icons.Mail /></a></td></tr>)}</tbody></table></div></div>}
        
        {tab === 'coupons' && <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"><div className="p-4 border-b border-zinc-800 flex justify-between items-center"><h3 className="text-white font-bold">Coupons ({coupons.length})</h3><button onClick={() => setShowCouponForm(true)} className="bg-amber-500 text-black px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-amber-400"><Icons.Plus />Add Coupon</button></div><div className="overflow-x-auto"><table className="w-full"><thead className="bg-zinc-800"><tr><th className="text-left text-zinc-400 p-4">Code</th><th className="text-left text-zinc-400 p-4">Discount</th><th className="text-left text-zinc-400 p-4">Min Order</th><th className="text-left text-zinc-400 p-4">Status</th><th className="text-right text-zinc-400 p-4">Actions</th></tr></thead><tbody>{coupons.map(c => <tr key={c.id} className="border-t border-zinc-800 hover:bg-zinc-800/50"><td className="p-4 text-white font-mono text-lg">{c.code}</td><td className="p-4 text-amber-500 font-semibold">{c.type === 'percent' ? `${c.discount}%` : formatPrice(c.discount)}</td><td className="p-4 text-zinc-400">{formatPrice(c.minOrder)}</td><td className="p-4"><button onClick={() => toggleCoupon(c.id)} className={`px-3 py-1 rounded text-sm ${c.active ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}>{c.active ? 'Active' : 'Inactive'}</button></td><td className="p-4 text-right"><button onClick={() => editCoupon(c)} className="text-zinc-400 hover:text-amber-500 p-2"><Icons.Edit /></button><button onClick={() => deleteCoupon(c.id)} className="text-zinc-400 hover:text-red-500 p-2"><Icons.Trash /></button></td></tr>)}</tbody></table></div></div>}
        
        {tab === 'reviews' && <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"><div className="p-4 border-b border-zinc-800"><h3 className="text-white font-bold">Reviews ({reviews.length})</h3></div><div className="p-4 space-y-4">{reviews.length === 0 ? <p className="text-zinc-500 text-center py-8">No reviews yet</p> : reviews.map(r => <div key={r.id} className="bg-zinc-800/50 rounded-lg p-4"><div className="flex justify-between items-start"><div><p className="text-white font-semibold">{r.customer}</p><div className="flex items-center gap-2"><div className="flex text-amber-400">{[...Array(5)].map((_,i) => <Icons.Star key={i} filled={i < r.rating} />)}</div>{r.verified && <span className="text-green-400 text-xs flex items-center gap-1"><Icons.Check />Verified</span>}</div></div><div className="flex items-center gap-2"><span className="text-zinc-500 text-sm">{r.date}</span><button onClick={() => deleteReview(r.id)} className="text-zinc-400 hover:text-red-500 p-1"><Icons.Trash /></button></div></div><p className="text-zinc-300 mt-2">{r.comment}</p></div>)}</div></div>}
      </div>
      
      {showVehicleForm && <VehicleForm vehicle={editingVehicle} onSave={saveVehicle} onCancel={() => { setShowVehicleForm(false); setEditingVehicle(null) }} />}
      {showCouponForm && <CouponForm coupon={editingCoupon} onSave={saveCoupon} onCancel={() => { setShowCouponForm(false); setEditingCoupon(null) }} />}
    </div>
  )
}

// ============================================================================
// MAIN APP
// ============================================================================
export default function App() {
  const [lang, setLang] = useState('en')
  const [darkMode, setDarkMode] = useState(() => { const s = localStorage.getItem('apex-darkMode'); return s !== null ? JSON.parse(s) : true })
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [checkoutItem, setCheckoutItem] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastBooking, setLastBooking] = useState(null)
  const [favorites, setFavorites] = useState(() => { const s = localStorage.getItem('apex-favorites'); return s ? JSON.parse(s) : [] })
  const [compareList, setCompareList] = useState([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [showCompare, setShowCompare] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [vehicles, setVehicles] = useState(defaultVehicles)
  const [bookings, setBookings] = useState(() => { const s = localStorage.getItem('apex-bookings'); return s ? JSON.parse(s) : defaultBookings })
  const [coupons, setCoupons] = useState(defaultCoupons)
  const [reviews, setReviews] = useState(() => { const s = localStorage.getItem('apex-reviews'); return s ? JSON.parse(s) : defaultReviews })
  
  const t = translations[lang]
  const isRTL = lang === 'ar'
  
  // Function to fetch all data from API
  const fetchData = async () => {
    try {
      // Fetch vehicles
      const vehicleData = await api.getVehicles()
      if (vehicleData.vehicles && vehicleData.vehicles.length > 0) {
        const transformedVehicles = vehicleData.vehicles.map(v => ({
          id: v.id,
          name: v.name,
          brand: v.brand,
          category: v.category?.toLowerCase() || 'luxury',
          price: v.pricePerDay,
          image: v.mainImage || v.images?.[0] || 'https://via.placeholder.com/800x600',
          images: v.images || [v.mainImage],
          specs: {
            speed: v.topSpeed || '-',
            acceleration: v.acceleration || '-',
            seats: v.seats || 4,
            fuel: v.fuelType || 'Petrol',
            transmission: v.transmission || 'Automatic'
          },
          features: v.features || [],
          rating: v.rating || 5.0,
          reviews: v.reviewCount || 0,
          available: v.isActive !== false
        }))
        setVehicles(transformedVehicles)
      }
      
      // Fetch coupons
      try {
        const couponData = await api.getCoupons()
        if (couponData && couponData.length > 0) {
          const transformedCoupons = couponData.map(c => ({
            id: c.id,
            code: c.code,
            discount: c.discountValue,
            type: c.discountType === 'PERCENTAGE' ? 'percent' : 'fixed',
            minOrder: c.minOrderAmount || 0,
            active: c.isActive !== false
          }))
          setCoupons(transformedCoupons)
        }
      } catch (e) {
        console.log('Using default coupons')
      }
      
    } catch (error) {
      console.log('Using cached/default data:', error.message)
    } finally {
      setLoading(false)
    }
  }
  
  // Refresh data from API
  const refreshData = async () => {
    await fetchData()
  }
  
  // Fetch data on mount
  useEffect(() => {
    fetchData()
  }, [])
  
  useEffect(() => { const p = new URLSearchParams(window.location.search); if (p.get('admin') === 'true') setShowAdminLogin(true) }, [])
  useEffect(() => { localStorage.setItem('apex-darkMode', JSON.stringify(darkMode)) }, [darkMode])
  useEffect(() => { localStorage.setItem('apex-bookings', JSON.stringify(bookings)) }, [bookings])
  useEffect(() => { localStorage.setItem('apex-reviews', JSON.stringify(reviews)) }, [reviews])
  useEffect(() => { localStorage.setItem('apex-favorites', JSON.stringify(favorites)) }, [favorites])
  
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const onSelect = (v, book = false) => book ? setCheckoutItem(v) : setSelectedVehicle(v)
  const onFav = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const onComp = (id) => setCompareList(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= 3 ? prev : [...prev, id])
  const onBookingSuccess = (b) => { setCheckoutItem(null); setLastBooking(b); setShowSuccess(true); setBookings(prev => [...prev, { ...b, id: Date.now(), date: new Date().toISOString().split('T')[0], status: 'pending', vehicleName: b.name }]) }
  const onAdminLogin = () => { setShowAdminLogin(false); setIsAdmin(true) }
  const onAdminClose = () => { setIsAdmin(false); const url = new URL(window.location); url.searchParams.delete('admin'); window.history.replaceState({}, '', url) }
  const onUpdate = (type, data) => { if (type === 'vehicles') setVehicles(data); else if (type === 'bookings') setBookings(data); else if (type === 'coupons') setCoupons(data); else if (type === 'reviews') setReviews(data) }
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-black' : 'bg-gray-50'} ${isRTL ? 'rtl' : ''}`} data-theme={darkMode ? 'dark' : 'light'}>
      <Header lang={lang} setLang={setLang} t={t} scrollTo={scrollTo} favorites={favorites} compareList={compareList} setShowFavorites={setShowFavorites} setShowCompare={setShowCompare} setShowCalculator={setShowCalculator} darkMode={darkMode} setDarkMode={setDarkMode} />
      <Hero t={t} scrollTo={scrollTo} darkMode={darkMode} />
      <Fleet t={t} vehicles={vehicles} onSelect={onSelect} favorites={favorites} compareList={compareList} onFav={onFav} onComp={onComp} darkMode={darkMode} />
      <Packages t={t} onSelect={(p) => setCheckoutItem(p)} darkMode={darkMode} />
      <Reviews t={t} reviews={reviews} darkMode={darkMode} />
      <FAQ t={t} darkMode={darkMode} />
      <Newsletter t={t} darkMode={darkMode} />
      <Footer t={t} scrollTo={scrollTo} darkMode={darkMode} />
      
      {selectedVehicle && <VehicleDetail v={selectedVehicle} t={t} onClose={() => setSelectedVehicle(null)} onBook={(v) => { setSelectedVehicle(null); setCheckoutItem(v) }} />}
      {checkoutItem && <Checkout item={checkoutItem} t={t} coupons={coupons} onClose={() => setCheckoutItem(null)} onSuccess={onBookingSuccess} />}
      {showSuccess && <Success t={t} booking={lastBooking} onClose={() => setShowSuccess(false)} />}
      {showFavorites && <Favorites t={t} vehicles={vehicles} favorites={favorites} onClose={() => setShowFavorites(false)} onSelect={onSelect} onFav={onFav} />}
      {showCompare && <Compare t={t} vehicles={vehicles} compareList={compareList} onClose={() => setShowCompare(false)} onComp={onComp} />}
      {showCalculator && <Calculator t={t} vehicles={vehicles} onClose={() => setShowCalculator(false)} />}
      {showAdminLogin && !isAdmin && <AdminLogin onSuccess={onAdminLogin} onClose={() => { setShowAdminLogin(false); const url = new URL(window.location); url.searchParams.delete('admin'); window.history.replaceState({}, '', url) }} />}
      {isAdmin && <Admin t={t} data={{ vehicles, bookings, coupons, reviews }} onClose={onAdminClose} onUpdate={onUpdate} onRefresh={refreshData} />}
      
      <Chat t={t} />
      <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40"><Icons.WhatsApp /></a>
    </div>
  )
}
