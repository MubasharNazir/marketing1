'use client';

import { useState, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import Chatbot from './components/Chatbot';
import TypewriterEffect from './components/TypewriterEffect';
import RotatingWords from './components/RotatingHeadline';
import emailjs from '@emailjs/browser';
import LogoCloud from '@/components/logo-cloud';
import { ArrowRightIcon, Building2Icon, Mail, MapPin, MessageCircle, Phone, Play, TrendingUpIcon, ZapIcon } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string; visible: boolean }>({ type: 'success', message: '', visible: false });
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const [showCoffeeInvite, setShowCoffeeInvite] = useState(false);
  const [showCoffeePreface, setShowCoffeePreface] = useState(false);
  const [coffeeAnim, setCoffeeAnim] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const words = [ "generate 10x faster leads",
    "build high-converting landing pages", 
    "create premium property websites",
    "drive qualified buyer traffic",
    "develop AI-powered CRM systems"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowCoffeePreface(true);
  //     const openModal = setTimeout(() => {
  //       setShowCoffeePreface(false);
  //       setShowCoffeeInvite(true);
  //     }, 1200);
  //     return () => clearTimeout(openModal);
  //   }, 5000);
  //   return () => clearTimeout(timer);
  // }, []);

  // useEffect(() => {
  //   if (showCoffeeInvite) {
  //     const anim = setTimeout(() => setCoffeeAnim(true), 20);
  //     return () => clearTimeout(anim);
  //   } else {
  //     setCoffeeAnim(false);
  //   }
  // }, [showCoffeeInvite]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const emailBody = `
      <h2>New contact request</h2>
      <p><strong>Name:</strong> ${formData.name || '-'} </p>
      <p><strong>Email:</strong> ${formData.email || '-'} </p>
      <p><strong>Phone:</strong> ${formData.phone || '-'} </p>
      <p><strong>Company:</strong> ${formData.company || '-'} </p>
      <p><strong>Service:</strong> ${formData.service || '-'} </p>
      <p><strong>Budget:</strong> ${formData.budget || '-'} </p>
      <p><strong>Message / Description:</strong><br/>${(formData.message || '-').replace(/\n/g, '<br/>')}</p>
    `;

    const fullMessage = `Name: ${formData.name || '-'}\nEmail: ${formData.email || '-'}\nPhone: ${formData.phone || '-'}\nCompany: ${formData.company || '-'}\nService: ${formData.service || '-'}\nBudget: ${formData.budget || '-'}\n\nDescription:\n${formData.message || '-'}`;

    const templateParams = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      service: formData.service,
      message: fullMessage,
      budget: formData.budget,
      email_body: emailBody,
      reply_to: formData.email,
      subject: `New contact request from ${formData.name || 'Website Visitor'}`,
      plain_text: fullMessage,
    };

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS environment variables (NEXT_PUBLIC_EMAILJS_*) are not set');
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      console.log('Form submitted and email sent via EmailJS:', templateParams);
      setSubmitStatus('success');
      setToast({ type: 'success', message: 'Message sent — we will contact you shortly.', visible: true });

      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4500);

      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: '',
        budget: ''
      });

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('EmailJS send error:', error);
      setSubmitStatus('error');
      const errMsg = (error as any)?.text || (error as any)?.message || 'Failed to send message. Please try again later.';
      setToast({ type: 'error', message: errMsg, visible: true });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        {/* Navigation
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 dark:bg-slate-950/80 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Image
                  src="/images/ga-marketing.svg"
                  alt="Company Logo"
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </div>
              <div className="flex items-center space-x-4 md:space-x-8">
                <a
                  href="https://cal.com/growthaccess/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 md:px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/30 font-medium text-sm md:text-base"
                >
                  Book Consultation
                </a>
              </div>
            </div>
          </div>
        </nav> */}
        {/* Top Info Bar */}
        {/* <div className="fixed top-0 w-full z-50 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-between items-center py-2 text-xs sm:text-sm">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2 text-red-500">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Dubai</span>
                </div>
                <div className="flex items-center gap-2 text-red-500">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Abu Dhabi</span>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-6 mt-2 sm:mt-0">
                <a href="mailto:info@doodletech.ae" className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="hidden sm:inline">sales@growthaccess.ae</span>
                </a>
                <a href="tel:+971554379700" className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>+971 554379700</span>
                </a>
                <a href="tel:+971505452094" className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>+971 505452094</span>
                </a>
              </div>
            </div>
          </div>
        </div> */}

{/* Navigation */}
<nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 dark:bg-slate-950/80 dark:border-slate-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-14 sm:h-16">
      <div className="flex items-center">
        <Image
          src="/images/services/gaa-reale.svg"
          alt="Company Logo"
          width={120}
          height={32}
          className="h-8 w-auto sm:h-10 sm:w-auto"
          priority
        />
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-8">
        <a
          href="https://cal.com/growthaccess/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md sm:shadow-lg shadow-blue-500/30 font-medium text-xs sm:text-sm md:text-base"
        >
          Book Free Consultation
        </a>
      </div>
    </div>
  </div>
</nav>

<section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
  
  {/* Light, Atmospheric Background */}
  <div className="absolute inset-0">
    {/* Subtle light grid */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    
    {/* Gentle floating orbs - green and blue blur */}
    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[150px] animate-pulse"></div>
    <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '2s' }}></div>
    
    {/* Subtle gradient overlay from bottom to white for depth */}
    <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent"></div>
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
    <div className="text-center">
      
      {/* Trust badge - Green accent */}
      {/* <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-18 bg-green-100 backdrop-blur-sm rounded-full border border-green-200 shadow-md">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
        </span>
        <span className="text-sm font-medium text-green-700 tracking-wider">Trusted by 100+ Real Estate Professionals</span>
      </div> */}
      <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-18 bg-green-100 backdrop-blur-sm rounded-full border border-green-200 shadow-md">
  <span className="relative flex h-2.5 w-2.5">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
  </span>
  <span className="text-xs sm:text-sm font-medium text-green-700 tracking-wider">
    Trusted by 100+ Real Estate Professionals
  </span>
</div>

      {/* Main headline - Text dark, gradient uses Green/Blue */}
      <h1 className="text-3xl md:text-5xl lg:text-5xl font-extrabold mb-7 text-gray-900">
      More leads. Faster sales.
      
      </h1>

      {/* Subheadline - Dark text, prominent Blue accent */}
      <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto font-light">
      A fully customised lead generation and nurturing solution for real estate.
        <span className="block mt-1 text-blue-600 font-medium text-base md:text-lg">From strategy and landing pages to lead generation and closings.</span>
      </p>

      {/* Social proof stats - Green and Blue accents */}
<div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 mt-20 md:mt-30 mb-12 max-w-5xl mx-auto">
  {[
    { number: '100K+', label: 'Leads Generated', icon: TrendingUpIcon, color: 'green' },
    { number: '$500M+', label: 'In Client Sales', icon: Building2Icon, color: 'blue' },
    { number: '99%', label: 'Client Satisfaction', icon: ZapIcon, color: 'indigo' }
  ].map((stat, idx) => (
    <div 
      key={idx}
      className="flex items-center gap-3 group hover:scale-[1.05] transition-all duration-300 p-1 md:p-2 rounded-lg"
    >
            <div className={`${
              stat.color === 'green' ? 'bg-green-500/10 border-green-500/30' :
              stat.color === 'blue' ? 'bg-blue-500/10 border-blue-500/30' :
              'bg-indigo-500/10 border-indigo-500/30'
            } p-2 rounded-lg border transition-all group-hover:bg-opacity-20`}>
              <stat.icon className={`w-5 h-5 ${
                stat.color === 'green' ? 'text-green-600' :
                stat.color === 'blue' ? 'text-blue-600' :
                'text-indigo-600'
              }`} />
            </div>
            <div className="text-left">
              <div className="text-xl md:text-2xl font-bold text-gray-900">{stat.number}</div>
              <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      
     {/* CTAs - Green and Blue gradients */}
<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-16 mb-16">

{/* Primary CTA with form link */}
<a 
  href="#contact"
  className="group relative w-full sm:w-auto text-center px-6 py-3.5 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold text-base sm:text-lg shadow-xl shadow-green-300/50 inline-flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-400/60"
>
  Get Your Free Strategy Call
  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
</a>

{/* Secondary link button */}
<a 
  href="#services-web"
  className="group w-full sm:w-auto text-center px-6 py-3.5 bg-white backdrop-blur-sm hover:bg-gray-50 text-gray-800 rounded-xl font-medium text-base sm:text-lg border border-gray-300 inline-flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:border-green-400 shadow-sm"
>
  <Play className="w-4 h-4 text-green-500" />
  See our work
</a>

</div>
     
    </div>
  </div>

  
</section>


        {/* <LogoCloud /> */}

        {/* Services: Secure Website Development */}
        <section id="services-web" className="py-24 md:py-36 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/20 to-white dark:from-slate-900 dark:to-slate-950">
          <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-2xl md:text-4xl font-bold text-slate-800 dark:text-emerald-300">
      <span className="text-emerald-600 dark:text-emerald-400">Website & </span>Landing Pages
    </h1>
    <p className="text-center text-sm md:text-lg text-slate-600 dark:text-slate-400 mt-3 mb-10 max-w-3xl mx-auto hidden md:block">
    High-converting websites and landing pages designed to showcase and sell real estate properties effectively.
    </p>
            <div className="marquee mt-10">
              <div className="marquee-track gap-8 pr-8">
                {[
                  "/images/services/1.svg",
                  // "/images/services/2.svg",
                  "/images/services/image 2.svg",
                  "/images/services/image 3.svg",

                  // "/images/services/3.svg",
                  "/images/services/4.svg",
                  
                  "/images/services/Cover 1.svg",
                ].map((src, i) => (
                  <div key={i} className="relative h-40 w-[250px] md:h-80 md:w-[500px] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-lg">
<Image 
  src={src} 
  alt={`Marketing Showcase ${i+1}`} 
  fill 
  className="object-cover"
  sizes="(max-width: 768px) 250px, 500px"
  quality={90} // Increase quality
  priority={i < 2} // Load first images with priority
/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        


        


        

        {/* Services: Result Driven Marketing & Lead Generation */}
        <section id="services-marketing" className="py-24 md:py-36 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50/20 dark:from-slate-950 dark:to-slate-900">
          <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-2xl md:text-4xl font-bold text-slate-800 dark:text-emerald-300">
      <span className="text-emerald-600 dark:text-emerald-400">Lead generation</span> for Real estate
    </h1>
    <p className="text-center text-sm md:text-lg text-slate-600 dark:text-slate-400 mt-3 mb-10 max-w-3xl mx-auto hidden md:block">
    Generate qualified leads and connect with potential buyers to boost your real estate sales.
    </p>
    
            <div className="marquee mt-10">
              <div className="marquee-track gap-8 pr-8">
                {[
                  // "/images/services/n1.svg",
                  // "/images/services/n2.svg",
                  // "/images/services/n3.svg",
                  // "/images/services/n4.svg",
                  // "/images/services/n5.svg"
                  "/images/services/c2.svg",
                  "/images/services/c1.svg",
                  
                  "/images/services/c4.svg",
                  "/images/services/c2.svg",
                  "/images/services/c1.svg",
                  
                  "/images/services/c4.svg",
                ].map((src, i) => (
                  <div key={i} className="relative h-40 w-[250px] md:h-80 md:w-[500px] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-lg">
                    <Image 
  src={src} 
  alt={`Marketing Showcase ${i+1}`} 
  fill 
  className="object-cover"
  sizes="(max-width: 768px) 250px, 500px"
  quality={90} // Increase quality
  priority={i < 2} // Load first images with priority
/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services: AI & Automation Showcases */}
        <section id="services-automation" className="py-24 md:py-36 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/20 to-white dark:from-slate-900 dark:to-slate-950">
          <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-2xl md:text-4xl font-bold text-slate-800 dark:text-emerald-300">
      <span className="text-emerald-600 dark:text-emerald-400">CRM &</span> AI agents for Real estate
    </h1>
    <p className="text-center text-sm md:text-lg text-slate-600 dark:text-slate-400 mt-3 mb-10 max-w-3xl mx-auto hidden md:block">
    Automate client management and streamline real estate operations with intelligent CRM and AI agents.
    </p>
            <div className="marquee mt-10">
              <div className="marquee-track gap-8 pr-8">
                {[
                  //   "/images/services/t4.svg",
                  //   "/images/services/t5.svg",
                  // "/images/services/t1.svg",
                  // "/images/services/t2.svg",
                  // "/images/services/t3.svg",
                  "/images/services/e1.svg",
                  "/images/services/e2.svg",
                  "/images/services/e3.svg",
                  "/images/services/e1.svg",
                  "/images/services/e2.svg",
                  "/images/services/e3.svg",
                
                ].map((src, i) => (
                  <div key={i} className="relative h-40 w-[250px] md:h-80 md:w-[500px] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-lg">
                    <Image 
  src={src} 
  alt={`Marketing Showcase ${i+1}`} 
  fill 
  className="object-cover"
  sizes="(max-width: 768px) 250px, 500px"
  quality={90} // Increase quality
  priority={i < 2} // Load first images with priority
/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services: Mobile App Development */}
        <section id="services-mobile" className="py-24 md:py-36 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/20 to-white dark:from-slate-900 dark:to-slate-950">
          <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-2xl md:text-4xl font-bold text-slate-800 dark:text-emerald-300">
      <span className="text-emerald-600 dark:text-emerald-400">Mobile</span> apps for Real estate
    </h1>
    <p className="text-center text-sm md:text-lg text-slate-600 dark:text-slate-400 mt-3 mb-10 max-w-3xl mx-auto hidden md:block">
    Custom mobile apps to showcase properties, engage clients, and simplify real estate transactions.
    </p>
            <div className="marquee mt-10">
              <div className="marquee-track gap-8 pr-8">
                {[
                  
                   "/images/services/m1.svg",
                  
                  "/images/services/m2.svg",
                  // "/images/services/Desktop - 1 (3).svg",
                  "/images/services/m3.svg",
                  "/images/services/m4.svg",
                  "/images/services/Group 40.svg",
                  // "/images/services/Group 2.jpg",
                 
                  // "/images/services/dribble.svg",
                  // "/images/services/Thumbnail.svg",
                  // // "/images/services/Spa & Massage App.svg",
                  // // "/images/services/Vector (1).svg",
                  // "/images/services/image 20.svg",

                ].map((src, i) => (
                  <div key={i} className="relative h-40 w-[250px] md:h-80 md:w-[500px] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-lg">
                     <img 
    src={src} 
    alt={`Marketing Showcase ${i+1}`}
    className='w-full h-full object-cover transform-gpu' 
    loading={i < 2 ? "eager" : "lazy"}
    style={{
      WebkitBackfaceVisibility: 'hidden', // iOS fix
      WebkitPerspective: 1000, // iOS fix
      imageRendering: '-webkit-optimize-contrast', // Better quality on Safari
      
    }}
  />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

       

        {/* Testimonials Section */}
<section id="testimonials" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20">
  <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/10 rounded-full blur-xl animate-float"></div>
  <div className="absolute top-40 right-20 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
  <div className="absolute bottom-40 left-20 w-24 h-24 bg-purple-400/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
  <div className="absolute bottom-20 right-10 w-28 h-28 bg-pink-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
        What Our Clients Say
      </h2>
      <p className="text-lg text-slate-600 dark:text-slate-400">Trusted by 100+ businesses for digital transformation</p>
    </div>
    <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
      {[
        {
          quote: "We saw a 45% increase in qualified listing leads within the first two months. Their PPC strategy focused purely on ROI exactly what we needed.",
          name: "Sarah Chen",
          role: "Marketing Director, Prime Estates Group",
          location: "Dubai",
        },
        {
          quote: "The lead flow is now predictable and high-quality. We're spending less on advertising and closing more deals due to their precise targeting and follow-up system integration.",
          name: "Qasim Saeed",
          role: "CEO, Impala Real estate",
          location: "Abu Dhabi",
        },
        {
          quote: "They completely revamped our digital presence. The new landing pages convert prospects at double the previous rate. Best investment in lead generation this year.",
          name: "Muhammad Ayaz",
          role: "Sales Manager, Aja Properties",
          location: "Dubai",
        },
      ].map((testimonial, idx) => (
        <div key={idx} className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 px-8 py-10 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-2xl">
          {/* AVATAR IMAGE REMOVED HERE */}
          <div className="flex items-center justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10 13.347l-2.885 2.026c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L3.48 8.72c-.783-.57-.38-1.81.588-1.81H7.53a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">Google Rating</span>
          </div>
          <blockquote className="text-base md:text-lg font-normal text-slate-700 dark:text-slate-200 mb-6 leading-relaxed">
            <span className="text-blue-600 dark:text-blue-400 text-2xl font-bold mr-2">"</span>
            {testimonial.quote}
            <span className="text-blue-600 dark:text-blue-400 text-2xl font-bold ml-2">"</span>
          </blockquote>
          <div className="mb-2">
            <span className="font-semibold text-slate-900 dark:text-white text-lg">{testimonial.name}</span>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{testimonial.role}</div>
          <div className="text-xs text-slate-400 dark:text-slate-500">{testimonial.location}</div>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* New Real Estate Consultation Section */}
<section id="real-estate-consultation" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20">
  <div className="max-w-7xl mx-auto">
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
      <div className="grid md:grid-cols-2">
        <div className="relative h-64 md:h-full min-h-[400px]">
          <Image 
            src="/images/coffee.jpg" // <-- Placeholder for a relevant real estate image
            alt="Real Estate Strategy Session" 
            fill 
            className="object-cover" 
          />
          <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700">
            Discuss Your Next Big Listing 🔑
          </div>
        </div>

        <div className="p-8 md:p-10 lg:p-12">
          <p className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-semibold mb-2">
          Real Estate Growth Strategy
          </p>
          <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-4 leading-snug">
          Book a Free Consultation with Mudassar
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
          Work directly with our real estate expert to craft a high-impact digital strategy designed to attract high-value listings and qualified buyers across the UAE.
          </p>
         
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-blue-200 dark:ring-blue-900">
              <Image 
                src="/images/1752723677506.jpeg" 
                alt="Digital Strategist" 
                fill 
                className="object-cover" 
              />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">Mudassar Nazir</p>
              <p className="text-sm text-slate-500">Real Estate & Digital Strategist</p>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
          Mudassar specializes in leveraging AI automation and targeted digital campaigns to generate qualified real estate leads. He has helped regional agencies transition to scalable digital systems, with a sharp focus on ROI and conversion optimization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://wa.me/+971554379700?text=Hi%20GrowthAccess%2C%20I%27d%20like%20to%20schedule%20a%20real%20estate%20strategy%20meeting."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors text-center"
            >
              Consult via WhatsApp
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </a>
            <a
              href="https://cal.com/growthaccess/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors text-center"
            >
              Book 30-Min Zoom Call
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      
        {/* Contact Form Section */}
        <section id="contact" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
              <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:16px_16px]"></div>

              <div className="relative px-4 sm:px-8 lg:px-12 py-12 md:py-16">
                <div className="text-center mb-10 md:mb-12">
                  <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-3">Get a quote</h2>
                  <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
                  Let’s begin generating high-quality leads for you and automating your entire workflow.
                  </p>
                </div>

                <div className="mx-auto max-w-2xl">
                  <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 lg:p-10 shadow-xl border border-slate-200 dark:border-slate-700 pb-28 md:pb-0 relative z-10">
                    <div className="grid md:grid-cols-2 gap-5 md:gap-6 mb-6 md:mb-8">
                      <div>
                        <label htmlFor="name" className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full px-3.5 py-2.5 md:py-3 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-0 dark:focus:ring-blue-500 dark:bg-slate-700 dark:text-white transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full px-3.5 py-2.5 md:py-3 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 dark:bg-slate-700 dark:text-white transition-all text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-5 md:gap-6 mb-6 md:mb-8">
                      <div>
                        <label htmlFor="phone" className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+971 505 452094"
                          className="w-full px-3.5 py-2.5 md:py-3 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 dark:bg-slate-700 dark:text-white transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="company" className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Your Company"
                          className="w-full px-3.5 py-2.5 md:py-3 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 dark:bg-slate-700 dark:text-white transition-all text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6 md:mb-8">
                      <label htmlFor="service" className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Service Interest *
                      </label>
                      <div className="relative">
                        <select
                          id="service"
                          name="service"
                          required
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full appearance-none pr-10 px-3.5 py-2.5 md:py-3 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 dark:bg-slate-700 dark:text-white transition-all text-sm"
                        >
                          <option value="">Select a service...</option>
                          <option value="lead-generation-marketing">Real Estate Lead Generation & Marketing</option>
<option value="property-listing-platforms">Custom Property Listing Platforms</option>
<option value="crm-integration">CRM Setup & Integration (e.g., Salesforce, HubSpot)</option>
<option value="virtual-tours-vr">Virtual Tours & VR Solutions</option>
<option value="data-analytics-valuation">Property Data Analytics & Valuation Tools</option>
<option value="chatbot-automation">AI Chatbot & Lead Nurturing Automation</option>
<option value="agent-app-development">Mobile App Development for Agents/Clients</option>
<option value="website-optimization">Website Design & Conversion Optimization</option>
<option value="devops-hosting">Secure Hosting & Infrastructure Management</option>
<option value="cybersecurity-compliance">Cybersecurity & Data Compliance</option>
<option value="other-real-estate">Other Real Estate IT Needs</option>
                          <option value="other">Other</option>
                        </select>
                        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 11.92 1.18l-4.25 3.37a.75.75 0 01-.92 0L5.21 8.39a.75.75 0 01.02-1.18z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="mb-6 md:mb-8">
                      <label htmlFor="message" className="block text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your project and how we can help..."
                        className="w-full px-3.5 py-2.5 md:py-3 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 dark:bg-slate-700 dark:text-white transition-all resize-none text-sm"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 w-full px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>

                    <p className="text-[12px] text-slate-500 dark:text-slate-400 text-center mt-3">
                      By submitting this form, you agree to our privacy policy. We'll never share your information.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

   

       <footer className="relative bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50">
      {/* Decorative top border */}
     
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-3 lg:gap-16">

          {/* Logo & Description */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className=" ">
                 <div className="flex items-center mb-5">
  <Image 
    src="/images/logo.png" 
    alt="Company Logo" 
    width={150} 
    height={40} 
    className="h-9 w-auto" 
  />
</div>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed text-base">
            Empowering Real Estate Professionals  with digital innovation and automation excellence across the UAE.
            </p>
            {/* <div className="flex gap-3">
              {[
                { icon: '𝕏', href: '#' },
                { icon: 'in', href: '#' },
                { icon: 'f', href: '#' },
                { icon: '📷', href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-white border-2 border-slate-200 hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-600 flex items-center justify-center transition-all duration-300 hover:scale-110 text-slate-600 hover:text-white font-semibold shadow-sm hover:shadow-lg hover:shadow-blue-500/30"
                >
                  {social.icon}
                </a>
              ))}
            </div> */}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-slate-900 font-bold text-lg mb-6 relative inline-block">
              Get In Touch
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                {/* <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" /> */}
                {/* <span className="text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                  Office #308, Majid Al Futtaim Building, near Abu Dhabi Mall, Abu Dhabi, UAE
                </span> */}
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <a 
                  href="tel:+971505452094" 
                  className="text-slate-600 hover:text-indigo-600 transition-colors font-medium"
                >
                  +971 505452094
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <MessageCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <a 
                  href="https://wa.me/+971505452094" 
                  className="text-slate-600 hover:text-green-600 transition-colors font-medium"
                >
                  WhatsApp Us
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <a 
                  href="mailto:sales@growthaccess.ae" 
                  className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
                >
                  sales@growthaccess.ae
                </a>
              </li>
              <li className="pt-2">
                {/* <a
                  href="https://maps.google.com/?q=Majid%20Al%20Futtaim%20Building%20Abu%20Dhabi%20Mall"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 font-medium hover:from-blue-700 hover:to-indigo-700"
                >
                  <MapPin className="w-4 h-4" />
                  View on Maps
                </a> */}
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-slate-900 font-bold text-lg mb-6 relative inline-block">
              Address
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600"></span>
            </h3>
            {/* <ul className="space-y-3">
              {[
                { label: 'Office#308, Majid Al Futtaim Building, near Abu Dhabi Mall, Abu Dhabi, UAE', href: '#services-web' },
                // { label: 'Mobile Apps', href: '#services-mobile' },
                // { label: 'Digital Marketing', href: '#services-marketing' },
                // { label: 'AI & Automation', href: '#services-automation' },
                // { label: 'Testimonials', href: '#testimonials' },
                // { label: 'Contact Us', href: '#contact' },
              
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-2 group font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:bg-indigo-600 transition-colors"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul> */}
            <h3 className="text-slate-600 transition-colors font-medium"
                >
                 Office no 308, One Central - The Offices 4 - Dubai, UAE
                </h3>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-300 mt-12 pt-8 text-center">
          <p className="text-slate-500 text-sm">
            © 2025 <span className="text-slate-700 font-semibold">GrowthAccess Technologies</span>. All rights reserved. UAE.
          </p>
        </div>
      </div>
    </footer>

      </main>

      {/* Timed Coffee Invitation Popup */}
      {showCoffeePreface && (
        <div className="fixed inset-0 z-[59] pointer-events-none flex items-end justify-center p-6">
          <div className="pointer-events-auto bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-full px-5 py-2 shadow-lg hero-animate-1">
            Sorry to interrupt you — quick invite!
          </div>
        </div>
      )}

      {showCoffeeInvite && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCoffeeInvite(false)} />

          <div className={`relative z-[61] max-w-3xl w-[92%] md:w-[860px] rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl transform transition-all duration-300 ease-out ${coffeeAnim ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'}`}>
            <button
              aria-label="Close invitation"
              onClick={() => setShowCoffeeInvite(false)}
              className="absolute top-2 right-2 md:top-3.5 md:right-3.5 w-9 h-9 rounded-lg bg-white/95 dark:bg-slate-800/95 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-lg z-10"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative h-56 md:h-full">
                <Image src="/images/coffee.jpg" alt="Coffee invitation" fill className="object-cover" />
                <div className="absolute bottom-3 left-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700">Let's grab a coffee ☕️</div>
              </div>

              <div className="p-6 md:p-8 lg:p-10">
                <p className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-semibold mb-2">Personal invite</p>
                <h3 className="text-1xl md:text-2xl font-semibold text-slate-900 dark:text-white mb-3 leading-snug">Meet our Digital Strategist over coffee at our Abu Dhabi office and discuss your project.</h3>
               
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-200 dark:ring-blue-900">
                    <Image src="/images/1752723677506.jpeg" alt="Digital Strategist" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Mudassar Nazir</p>
                    <p className="text-xs text-slate-500">Digital & Technology Strategist</p>
                  </div>
                </div>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                  Mudassar has helped 30+ Abu Dhabi companies plan and launch projects, build websites and mobile apps, implement AI automation, and craft effective digital strategies — with experience in both government and private sectors.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/+971554379700?text=Hi%20GrowthAccess%2C%20I%27d%20like%20to%20schedule%20a%20coffee%20meeting%20at%20your%20office."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
                  >
                    Schedule coffee at our office
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                  </a>
                  <a
                    href="https://cal.com/growthaccess/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors"
                  >
                    Book an online Zoom meeting
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp FAB */}
      <a
        href="https://wa.me/+971554379700"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BA56] text-white shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center z-50"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Toast Notification */}
      {toast.visible && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed left-1/2 -translate-x-1/2 bottom-20 z-50 w-auto max-w-lg px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Chatbot */}
      <Chatbot />
    </>
  );
}