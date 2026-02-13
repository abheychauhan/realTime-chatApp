import React, { useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';

const AuthTabs = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();


    //  handle login
    const signInHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userData = {
            email,
            password,
        };

        try {
            const res = await axios.post('/user/login', userData);
            console.log(res.data);


            setTimeout(() => {
                let token = res.data.token;
                sessionStorage.setItem("user", JSON.stringify(res.data.user));
                sessionStorage.setItem("token", token);
                if (!token) {
                    sessionStorage.removeItem("user");
                    sessionStorage.removeItem("token");
                    alert("Login failed. Please try again.");
                    return;
                }
                setLoading(false);
                navigate('/home');

            }, 1000);

        } catch (err) {
            console.log(err);
            setLoading(false);
        }

    }


    // handle register

    const registerHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userData = {
            name,
            email,
            password,
        };

        try {
            const res = await axios.post('/user/register', userData);
            console.log(res.data);
            sessionStorage.setItem("user", JSON.stringify(res.data.user));
            sessionStorage.setItem("token", res.data.token);

            setLoading(false);
            setTimeout(() => {
                navigate('/home');
            }, 1000);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }




    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-8">


                {/* loading */}
                {loading && (
                   <Loading/>
                )}

                {/* Tab Toggle */}
                <div className="relative bg-slate-100 p-1 rounded-xl flex mb-8">
                    {/* Animated Background Slider */}
                    <div
                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-indigo-600 rounded-lg shadow-md transition-transform duration-300 ease-in-out ${isLogin ? 'translate-x-0' : 'translate-x-full'
                            }`}
                    />

                    <button
                        onClick={() => setIsLogin(true)}
                        className={`relative z-10 w-1/2 py-2 text-sm font-semibold transition-colors duration-300 ${isLogin ? 'text-white' : 'text-slate-500'
                            }`}
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`relative z-10 w-1/2 py-2 text-sm font-semibold transition-colors duration-300 ${!isLogin ? 'text-white' : 'text-slate-500'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Forms Container */}
                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: isLogin ? 'translateX(0%)' : 'translateX(-100%)' }}
                    >
                        {/* Login Form */}
                        <div className="w-full shrink-0 p-2">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                            <p className="text-slate-500 text-sm mb-6">Please enter your details to sign in.</p>

                            <form className="space-y-4" onSubmit={signInHandler}>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="name@company.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="••••••••" />
                                </div>
                                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors shadow-lg shadow-indigo-200">
                                    Sign In
                                </button>
                            </form>
                        </div>

                        {/* Sign Up Form */}
                        <div className="w-full shrink-0 p-2">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Create Account</h2>

                            <form className="space-y-4" onSubmit={registerHandler}>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="name@company.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="••••••••" />
                                </div>
                                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors shadow-lg shadow-indigo-200">
                                    Register
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthTabs;