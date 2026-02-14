import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col font-sans text-primary">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                LexFlow
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-8 items-center">
                            <a href="#features" className="nav-link">Features</a>
                            <a href="#pricing" className="nav-link">Pricing</a>
                            <a href="#testimonials" className="nav-link">Testimonials</a>
                            <ThemeToggle />
                            <div className="flex items-center space-x-4 ml-4">
                                <Link to="/login" className="text-primary font-medium hover:text-accent transition-colors">Log In</Link>
                                <Link to="/signup" className="btn-primary py-2 px-4 shadow-none">Get Started</Link>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center space-x-4">
                            <ThemeToggle />
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-secondary hover:text-primary focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-surface border-b border-slate-100 dark:border-slate-800 py-2">
                        <div className="px-4 space-y-2">
                            <a href="#features" className="block py-2 nav-link">Features</a>
                            <a href="#pricing" className="block py-2 nav-link">Pricing</a>
                            <a href="#testimonials" className="block py-2 nav-link">Testimonials</a>
                            <div className="pt-4 flex flex-col space-y-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                                <Link to="/login" className="w-full py-2 text-center text-primary font-medium hover:text-accent">Log In</Link>
                                <Link to="/signup" className="w-full py-2 btn-primary text-center">Get Started</Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-40"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Manage Your Law Practice <br className="hidden md:block" />
                        <span className="text-accent">Without the Chaos</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 mb-10">
                        Streamline cases, automate documents, and delight clients with the all-in-one platform built for modern legal professionals.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="btn-primary text-lg">Start Free Trial</button>
                        <button className="btn-secondary text-lg">Book a Demo</button>
                    </div>

                    {/* Dashboard Preview Placeholder */}
                    <div className="mt-16 relative mx-auto max-w-5xl">
                        <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-800 p-2 aspect-[16/9] flex items-center justify-center overflow-hidden">
                            <div className="text-center">
                                <div className="text-slate-500 mb-2 uppercase tracking-wider text-sm font-semibold">Dashboard Preview</div>
                                <div className="animate-pulse bg-slate-800 h-64 w-[800px] rounded-lg mx-auto"></div>
                            </div>
                        </div>
                        {/* Decorative blobs */}
                        <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-surface-highlight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-accent font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-primary sm:text-4xl">
                            Everything you need to run your firm
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="feature-card">
                            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-accent">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-primary">Case Management</h3>
                            <p className="text-secondary">Track every detail of your cases, from intake to billing, in one secure, organized workspace.</p>
                        </div>

                        <div className="feature-card">
                            <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4 text-indigo-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-primary">Automated Scheduling</h3>
                            <p className="text-secondary">Sync with your calendar, send automated reminders, and let clients book time slots directly.</p>
                        </div>

                        <div className="feature-card">
                            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 text-purple-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-primary">Client Portal</h3>
                            <p className="text-secondary">Share documents, messages, and invoices securely with clients through a dedicated portal.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust/Stats Section */}
            <section className="py-20 bg-primary text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-12">Trusted by modern firms worldwide</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="p-4">
                            <div className="text-4xl font-extrabold text-accent mb-2">500+</div>
                            <div className="text-slate-400">Law Firms</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl font-extrabold text-accent mb-2">10k+</div>
                            <div className="text-slate-400">Cases Managed</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl font-extrabold text-accent mb-2">99.9%</div>
                            <div className="text-slate-400">Uptime</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl font-extrabold text-accent mb-2">24/7</div>
                            <div className="text-slate-400">Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your practice?</h2>
                            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                                Join hundreds of successful law firms using LexFlow to scale their operations.
                            </p>
                            <Link to="/signup" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg inline-block">
                                Get Started for Free
                            </Link>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-surface-highlight border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <span className="text-2xl font-bold text-primary mb-4 block">LexFlow</span>
                            <p className="text-secondary">
                                Making legal management simple, secure, and efficient for everyone.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-primary mb-4">Product</h4>
                            <ul className="space-y-2 text-secondary">
                                <li><a href="#" className="hover:text-accent">Features</a></li>
                                <li><a href="#" className="hover:text-accent">Pricing</a></li>
                                <li><a href="#" className="hover:text-accent">Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-primary mb-4">Resources</h4>
                            <ul className="space-y-2 text-secondary">
                                <li><a href="#" className="hover:text-accent">Blog</a></li>
                                <li><a href="#" className="hover:text-accent">Case Studies</a></li>
                                <li><a href="#" className="hover:text-accent">Help Center</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-primary mb-4">Company</h4>
                            <ul className="space-y-2 text-secondary">
                                <li><a href="#" className="hover:text-accent">About Us</a></li>
                                <li><a href="#" className="hover:text-accent">Careers</a></li>
                                <li><a href="#" className="hover:text-accent">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center text-slate-400">
                        <p>&copy; {new Date().getFullYear()} LexFlow. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
