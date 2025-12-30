import React, { useState, useEffect } from 'react';
import { ChevronDown, Sparkles, CheckCircle2, ArrowRight, Menu, X, ChevronRight } from 'lucide-react';
import ParticlesBackground from './components/ParticlesBackground';
import ServiceModal from './components/ServiceModal';
import CustomCursor from './components/CustomCursor';
import ProcessTimeline from './components/ProcessTimeline';
import ThankYouModal from './components/ThankYouModal';
import BookingSuccessModal from './components/BookingSuccessModal';
import Logo from './components/Logo';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollReveal from './components/ScrollReveal';
import { SERVICES, PAIN_POINTS, SOLUTIONS, TESTIMONIALS, GOOGLE_SHEETS_WEBHOOK_URL } from './constants';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', url: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleServiceClick = (id: string) => {
    setActiveModal(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setFormErrors({ name: !formData.name ? 'Required' : '', email: !formData.email ? 'Required' : '' });
      return;
    }
    
    setFormStatus('submitting');
    try {
      const data = new FormData();
      // Added type assertion to fix 'unknown' property access error on line 63
      Object.entries(formData).forEach(([key, value]) => data.append(key, (value as string).trim()));
      
      // Sending data to Google Sheets
      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, { 
        method: 'POST', 
        mode: 'no-cors', 
        body: data 
      });
      
      setFormStatus('success');
      setShowThankYou(true); // Leads to Cal.com booking
      setFormData({ name: '', email: '', phone: '', url: '', message: '' });
    } catch (error) {
      console.error("Submission Error:", error);
      setFormStatus('error');
    }
  };

  const getInputClass = (fieldName: string) => `
    w-full bg-[#0a0a0f] border ${formErrors[fieldName] ? 'border-red-500' : 'border-gray-800'} rounded-lg p-4 text-white outline-none transition-all focus:border-neon-blue/50
    disabled:opacity-50 font-sans
  `;

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-neon-blue selection:text-black bg-black">
      <CustomCursor />
      <ParticlesBackground />
      
      <ServiceModal isOpen={!!activeModal} onClose={() => setActiveModal(null)} serviceId={activeModal} />
      <ThankYouModal isOpen={showThankYou} onClose={() => { setShowThankYou(false); setFormStatus('idle'); }} />
      <BookingSuccessModal isOpen={showBookingSuccess} onClose={() => setShowBookingSuccess(false)} />
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled || mobileMenuOpen ? 'bg-black/95 backdrop-blur-md border-b border-gray-900 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Logo className="h-10 md:h-12 w-auto" />
          
          <div className="hidden md:flex items-center gap-10 text-[10px] font-mono font-bold text-gray-400 tracking-[0.2em] uppercase">
            <button onClick={() => handleNavClick('problem')} className="hover:text-neon-blue transition-colors">The Problem</button>
            <button onClick={() => handleNavClick('services')} className="hover:text-neon-blue transition-colors">Systems</button>
            <button onClick={() => handleNavClick('process')} className="hover:text-neon-blue transition-colors">Process</button>
            <button onClick={() => handleNavClick('contact')} className="text-white hover:text-neon-blue transition-colors">Start Project //</button>
          </div>

          <button className="md:hidden text-white p-2 z-[110]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-black flex flex-col items-center justify-center gap-10 text-2xl font-mono uppercase tracking-[0.3em] animate-fade-in-up">
          <button onClick={() => handleNavClick('problem')} className="hover:text-neon-blue transition-colors">The Problem</button>
          <button onClick={() => handleNavClick('services')} className="hover:text-neon-blue transition-colors">Systems</button>
          <button onClick={() => handleNavClick('process')} className="hover:text-neon-blue transition-colors">Process</button>
          <button onClick={() => handleNavClick('contact')} className="text-neon-blue hover:text-white transition-colors">Start Project //</button>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20">
        <div className="max-w-5xl mx-auto z-10">
          <ScrollReveal>
            <h1 className="text-5xl md:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1.1]">
              SCALE WITH<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#bc13fe] drop-shadow-[0_0_15px_rgba(0,243,255,0.4)] uppercase">INTELLIGENCE</span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal delay={200}>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              We replace outdated websites with AI-Powered SmartSites & High-Conversion Meta Ads. The future of client acquisition is here.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => handleNavClick('contact')}
                className="w-full sm:w-auto px-10 py-5 bg-transparent border border-[#00f3ff] text-[#00f3ff] font-mono text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#00f3ff]/10 transition-all shadow-[0_0_20px_rgba(0,243,255,0.15)] flex items-center justify-center gap-3 group"
              >
                BOOK DISCOVERY CALL <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
              <button 
                onClick={() => handleNavClick('services')}
                className="w-full sm:w-auto px-10 py-5 bg-transparent border border-gray-800 text-gray-400 font-mono text-xs font-bold uppercase tracking-[0.2em] hover:border-gray-500 hover:text-white transition-all flex items-center justify-center"
              >
                Explore Systems
              </button>
            </div>
          </ScrollReveal>
        </div>
        <div className="absolute bottom-10 animate-bounce text-gray-600 cursor-pointer hover:text-neon-blue transition-colors" onClick={() => handleNavClick('problem')}>
          <ChevronDown size={24} />
        </div>
      </header>

      {/* Problem Section */}
      <section id="problem" className="py-32 relative bg-black scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="mb-20">
              <h2 className="text-[10px] font-mono text-neon-blue mb-4 uppercase tracking-[0.4em] font-bold">System Failure</h2>
              <h3 className="text-4xl md:text-5xl font-bold">Why The Old Way Is Broken</h3>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {PAIN_POINTS.map((item, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="bg-[#050505] p-10 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all duration-300 transform hover:scale-[1.02] group">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-10 text-red-500 border border-red-500/20 group-hover:scale-110 transition-transform">
                    <item.icon size={20} />
                  </div>
                  <h4 className="text-2xl font-bold mb-5 tracking-tight group-hover:text-red-400 transition-colors">{item.title}</h4>
                  <p className="text-gray-500 leading-relaxed text-[15px]">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Upgrade Protocol */}
      <section id="upgrade" className="py-32 relative bg-[#020205] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-20">
              <h2 className="text-[10px] font-mono text-neon-blue mb-4 uppercase tracking-[0.4em] font-bold">System Architecture</h2>
              <h3 className="text-4xl md:text-5xl font-bold uppercase">The Upgrade Protocol</h3>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {SOLUTIONS.map((item, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="bg-[#050505] p-10 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-neon-blue/30 transition-all duration-300 transform hover:scale-[1.02]">
                  {item.badge && (
                    <div className="absolute top-6 right-6 bg-[#00f3ff] text-black text-[9px] font-black px-2 py-0.5 rounded tracking-tighter shadow-[0_0_15px_#00f3ff]">
                      {item.badge}
                    </div>
                  )}
                  <div className="w-12 h-12 bg-neon-blue/10 rounded-lg flex items-center justify-center mb-10 text-neon-blue border border-neon-blue/20 shadow-[0_0_15px_rgba(0,243,255,0.1)] group-hover:shadow-[0_0_25px_rgba(0,243,255,0.3)] transition-all">
                    <item.icon size={20} />
                  </div>
                  <h4 className="text-2xl font-bold mb-5 tracking-tight group-hover:text-white transition-colors">{item.title}</h4>
                  <p className="text-gray-500 leading-relaxed text-[15px]">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process Roadmap */}
      <section id="process" className="py-32 bg-black overflow-hidden scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-20">
              <h3 className="text-4xl font-bold uppercase tracking-tight">Execution Roadmap</h3>
            </div>
          </ScrollReveal>
          <ProcessTimeline />
        </div>
      </section>

      {/* Pricing / Systems */}
      <section id="services" className="py-32 relative bg-black scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-20">
              <h2 className="text-[10px] font-mono text-neon-purple mb-4 uppercase tracking-[0.4em] font-bold">Operational Modules</h2>
              <h3 className="text-5xl md:text-6xl font-bold mb-8 uppercase tracking-tighter">Choose Your Weapon</h3>
              <p className="text-gray-500 max-w-xl mx-auto text-lg font-light leading-relaxed">
                Modular growth systems designed to integrate seamlessly with your business.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Neural Sales Funnels Card */}
            <ScrollReveal delay={100}>
              <div onClick={() => handleServiceClick('addon')} className="bg-[#050505] p-10 rounded-3xl border border-white/5 hover:border-neon-blue/40 transition-all duration-500 cursor-pointer group transform hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(0,243,255,0.1)]">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-10 text-gray-500 group-hover:text-neon-blue group-hover:bg-neon-blue/10 transition-all">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight group-hover:text-white transition-colors">Neural Sales Funnels</h3>
                <p className="text-gray-500 mb-10 leading-relaxed text-sm">Psych-ops for your revenue stream. Automated, psychology-backed transmission sequences designed to rewrite lead behavior and trigger high-velocity purchasing decisions.</p>
                <div className="space-y-5 mb-12">
                  {['High-Impact Single Blasts', '3-Step Nurture Loops', '4-Day Cash Injection Campaigns', 'Psychological Triggers'].map(f => (
                    <div key={f} className="flex gap-4 items-center text-[13px] text-gray-400 group-hover:text-gray-300 transition-colors">
                      <CheckCircle2 size={16} className="text-gray-700 group-hover:text-neon-blue transition-colors" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-neon-blue transition-colors">View Packages</span>
                  <ArrowRight size={16} className="text-gray-700 group-hover:text-neon-blue group-hover:translate-x-2 transition-all" />
                </div>
              </div>
            </ScrollReveal>

            {/* Middle Highlighted Card */}
            <ScrollReveal delay={200}>
              <div onClick={() => handleServiceClick('upgrade')} className="bg-[#070b0e] p-10 rounded-3xl border border-[#00f3ff]/30 shadow-[0_0_50px_rgba(0,243,255,0.1)] relative min-h-[650px] cursor-pointer group transform hover:scale-[1.05] hover:shadow-[0_0_60px_rgba(0,243,255,0.2)] transition-all duration-500">
                <div className="absolute top-6 right-6 bg-neon-blue text-black text-[9px] font-black px-3 py-1 rounded uppercase tracking-wider animate-pulse">Most Popular</div>
                <div className="w-14 h-14 rounded-xl bg-[#00f3ff]/10 border border-[#00f3ff]/20 flex items-center justify-center mb-10 text-neon-blue group-hover:scale-110 transition-transform">
                  <Sparkles size={28} />
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">Full Multi-Page Upgrade</h3>
                <p className="text-gray-300 mb-10 leading-relaxed text-sm">Total digital sovereignty. A vast, SEO-fortified ecosystem designed for maximum authority. Dominate search indices and establish an unshakeable brand presence.</p>
                <div className="space-y-6 mb-12">
                  {['5+ Custom Pages', 'Custom AI Chatbot', 'Advanced SEO Setup', 'Blog/Content Hub'].map(f => (
                    <div key={f} className="flex gap-4 items-center text-[15px] text-gray-200 font-medium group-hover:translate-x-1 transition-transform">
                      <CheckCircle2 size={18} className="text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-black text-neon-blue uppercase tracking-[0.2em]">View Packages</span>
                  <ArrowRight size={18} className="text-neon-blue group-hover:translate-x-3 transition-transform" />
                </div>
              </div>
            </ScrollReveal>

            {/* AI SmartSite + Meta Ads Card */}
            <ScrollReveal delay={300}>
              <div onClick={() => handleServiceClick('core')} className="bg-[#050505] p-10 rounded-3xl border border-white/5 hover:border-neon-blue/40 transition-all duration-500 cursor-pointer group transform hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(0,243,255,0.1)]">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-10 text-gray-500 group-hover:text-neon-blue group-hover:bg-neon-blue/10 transition-all">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight group-hover:text-white transition-colors">AI SmartSite + Meta Ads</h3>
                <p className="text-gray-500 mb-10 leading-relaxed text-sm">The sovereign growth engine. A hyper-optimized conversion terminal fused with algorithmic traffic acquisition. We don't just get leads; we engineer market dominance.</p>
                <div className="space-y-5 mb-12">
                  {['Conversion-Focused "SmartSite"', 'Free Meta Ads Management', 'Automated Lead Nurturing', 'CRM Integration'].map(f => (
                    <div key={f} className="flex gap-4 items-center text-[13px] text-gray-400 group-hover:text-gray-300 transition-colors">
                      <CheckCircle2 size={16} className="text-gray-700 group-hover:text-neon-blue transition-colors" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-neon-blue transition-colors">View Packages</span>
                  <ArrowRight size={16} className="text-gray-700 group-hover:text-neon-blue group-hover:translate-x-2 transition-all" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Client Logs */}
      <section className="py-32 relative bg-black scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-20">
              <h2 className="text-[10px] font-mono text-neon-blue mb-4 uppercase tracking-[0.4em] font-bold">System Validation</h2>
              <h3 className="text-5xl font-bold uppercase tracking-tight">Client Logs</h3>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-10">
            {TESTIMONIALS.map((item, i) => (
              <ScrollReveal key={i} delay={i * 200}>
                <div className="bg-[#0a0a0f] p-10 rounded-3xl border border-white/5 flex flex-col justify-between group hover:border-neon-blue/20 transition-all duration-300">
                  <div>
                    <div className="text-gray-700 mb-8 group-hover:text-neon-blue transition-colors"><Sparkles size={40} /></div>
                    <p className="text-xl md:text-2xl text-gray-300 italic font-light leading-relaxed mb-10">
                      "{item.quote}"
                    </p>
                  </div>
                  <div>
                    <div className="h-px bg-white/5 mb-8" />
                    <h4 className="text-xl font-bold text-white mb-1 uppercase tracking-tight">{item.author}</h4>
                    <a href={item.url} target="_blank" className="text-xs font-mono text-gray-600 uppercase tracking-widest hover:text-neon-blue transition-colors">View Deployment Protocol</a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 relative bg-black border-t border-white/5 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-tight uppercase">
              Ready To <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#bc13fe]">Evolve?</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-gray-500 mb-16 text-lg max-w-2xl mx-auto">
              Join the agency that uses actual intelligence to grow your business. Limited spots available for this quarter.
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={200}>
            <form className="max-w-xl mx-auto space-y-8 text-left" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="block text-[10px] font-mono text-gray-600 mb-3 uppercase tracking-[0.3em]">Identification</label>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={getInputClass('name')} />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-600 mb-3 uppercase tracking-[0.3em]">Coordinates</label>
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={getInputClass('email')} />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-600 mb-3 uppercase tracking-[0.3em]">Signal Line (Phone)</label>
                <input type="tel" name="phone" placeholder="Phone Number (Optional)" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={getInputClass('phone')} />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-600 mb-3 uppercase tracking-[0.3em]">Target URL (Optional)</label>
                <input type="text" name="url" placeholder="Current Website (e.g. https://your-site.com)" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} className={getInputClass('url')} />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-600 mb-3 uppercase tracking-[0.3em]">Mission Brief (Message)</label>
                <textarea name="message" placeholder="Tell us about your project (Optional)" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className={`${getInputClass('message')} h-32 resize-none`} />
              </div>
              <button 
                className="w-full py-5 border border-neon-blue text-neon-blue font-mono text-xs font-bold uppercase tracking-[0.3em] hover:bg-neon-blue/10 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 shadow-[0_0_15px_rgba(0,243,255,0.1)] hover:shadow-[0_0_30px_rgba(0,243,255,0.3)]"
                disabled={formStatus === 'submitting'}
              >
                {formStatus === 'submitting' ? <LoadingSpinner /> : (
                  <>INITIATE STRATEGY PROTOCOL <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} /></>
                )}
              </button>
            </form>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
             <Logo className="h-10 w-auto opacity-50 grayscale" />
             <div className="text-gray-700 text-[9px] font-mono uppercase tracking-[0.4em]">System Online // Verified Protocol</div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-10">
             <a href="mailto:ali@afamedia.co.uk" className="text-gray-500 hover:text-white transition-colors font-mono text-[10px] uppercase tracking-widest">ali@afamedia.co.uk</a>
             <div className="text-gray-800 text-[10px] font-mono">© {new Date().getFullYear()} AFA MEDIA. ALL RIGHTS RESERVED.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;