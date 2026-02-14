import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [userType, setUserType] = useState('client'); // 'client' or 'lawyer'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        if (error) setError('');
    };

    const validateForm = () => {
        if (formData.name.trim().length < 2) {
            setError('Name must be at least 2 characters long');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: userType
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create account');
            }

            // Successful signup
            console.log('Account created successfully');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden font-sans text-primary">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-accent/10 blur-[100px] animate-blob"></div>
                <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-secondary/10 blur-[100px] animate-blob" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[100px] animate-blob" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-6 py-12">
                <div className="bg-surface/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/30 p-8 md:p-10">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block mb-4">
                            <span className="text-3xl font-bold text-accent">
                                LexFlow
                            </span>
                        </Link>
                        <h2 className="text-2xl font-bold text-primary">Create Account</h2>
                        <p className="text-secondary mt-2">Join us to streamline your legal workflow</p>
                    </div>

                    {/* User Type Toggle */}
                    <div className="flex p-1 bg-surface-highlight rounded-xl mb-8 relative">
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-surface rounded-lg shadow-sm transition-all duration-300 ease-in-out ${userType === 'lawyer' ? 'left-[calc(50%+2px)]' : 'left-1'}`}
                        ></div>
                        <button
                            onClick={() => setUserType('client')}
                            className={`flex-1 relative z-10 py-2 text-sm font-semibold transition-colors duration-300 ${userType === 'client' ? 'text-accent' : 'text-secondary hover:text-primary'}`}
                        >
                            Client
                        </button>
                        <button
                            onClick={() => setUserType('lawyer')}
                            className={`flex-1 relative z-10 py-2 text-sm font-semibold transition-colors duration-300 ${userType === 'lawyer' ? 'text-accent' : 'text-secondary hover:text-primary'}`}
                        >
                            Lawyer
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1.5" htmlFor="name">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-surface border border-slate-200 dark:border-slate-700 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none text-primary placeholder-secondary/50"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1.5" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-surface border border-slate-200 dark:border-slate-700 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none text-primary placeholder-secondary/50"
                                placeholder={userType === 'lawyer' ? "attorney@firm.com" : "name@example.com"}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1.5" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-surface border border-slate-200 dark:border-slate-700 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none text-primary placeholder-secondary/50"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1.5" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-surface border border-slate-200 dark:border-slate-700 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none text-primary placeholder-secondary/50"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 px-4 rounded-lg text-white font-semibold shadow-lg hover:opacity-90 transform hover:-translate-y-0.5 transition-all duration-200 mt-2 btn-primary"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-secondary">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-accent hover:underline transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
