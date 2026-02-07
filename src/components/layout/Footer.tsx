import React from 'react';
import { Twitter, Github, Linkedin, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="sm:col-span-2 md:col-span-1 space-y-6">
            <div>
              <h3 className="font-urbanist font-bold text-xl text-slate-900 tracking-tight">Veridex</h3>
              <p className="mt-2 font-inter text-sm text-slate-500 leading-relaxed max-w-xs">
                The selective work platform for high-potential students.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-inter text-xs font-semibold text-slate-900 uppercase tracking-wider mb-6">Platform</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="font-inter text-sm text-slate-500 hover:text-slate-900 transition-colors">How it Works</a>
              </li>
              <li>
                <a href="#" className="font-inter text-sm text-slate-500 hover:text-slate-900 transition-colors">Selection Criteria</a>
              </li>
              <li>
                <a href="#" className="font-inter text-sm text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
              </li>
              <li>
                <a href="#" className="font-inter text-sm text-slate-500 hover:text-slate-900 transition-colors">Manifesto</a>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-inter text-xs font-semibold text-slate-900 uppercase tracking-wider mb-6">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="font-inter text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1">
                  Documentation
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#" className="font-inter text-sm text-slate-500 hover:text-slate-900 transition-colors">Student Handbook</a>
              </li>
              <li>
                <a href="#" className="font-inter text-sm text-slate-500 hover:text-slate-900 transition-colors">Company Guide</a>
              </li>
              <li>
                <a href="#" className="font-inter text-sm text-slate-500 hover:text-slate-900 transition-colors">Support</a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-inter text-xs font-semibold text-slate-900 uppercase tracking-wider mb-6">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="font-inter text-sm text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="font-inter text-sm text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="font-inter text-sm text-slate-500 hover:text-slate-900 transition-colors">Code of Conduct</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-inter text-xs text-slate-400 text-center md:text-left">
            © {new Date().getFullYear()} Veridex Inc. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="font-inter text-[10px] font-medium text-slate-400 uppercase tracking-tight">System Operational</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
