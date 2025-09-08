import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [language, setLanguage] = useState('en');
  const navigate = useNavigate();

  const API_BASE_URL = 'https://yuvasaathi-backend-v2.vercel.app';

  const isEmailOrMobile = (input) => {
    const emailRegex = /\S+@\S+\.\S+/;
    const mobileRegex = /^[0-9]{10}$/;
    return emailRegex.test(input) || mobileRegex.test(input);
  };

  const handleGenerateOtp = async () => {
    setMessage(null);
    setLoading(true);

    if (!identifier.trim() || !isEmailOrMobile(identifier)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address or 10-digit mobile number.' });
      setLoading(false);
      return;
    }
    
    const isEmailInput = /\S+@\S+\.\S+/.test(identifier);
    const payload = isEmailInput ? { email: identifier } : { mobile: identifier };

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        // Correct logic: Only set state and show success message AFTER a successful response
        setMessage({ type: 'success', text: result.message || 'OTP has been sent to your email.' });
        setOtpSent(true); 
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to send OTP. Please try again.' });
        setOtpSent(false);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check your connection.' });
      setOtpSent(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setMessage(null);
    setLoading(true);

    if (!identifier.trim() || !otp.trim()) {
      setMessage({ type: 'error', text: 'Please enter both email/mobile and OTP.' });
      setLoading(false);
      return;
    }

    const isEmailInput = /\S+@\S+\.\S+/.test(identifier);
    const payload = isEmailInput ? { email: identifier, otp } : { mobile: identifier, otp };

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message || 'Login successful!' });
        console.log('User data:', result.user);
        navigate('/dashboard', { state: { language } });
      } else {
        setMessage({ type: 'error', text: result.message || 'Invalid credentials or OTP.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (otpSent) {
        handleLogin();
      } else {
        handleGenerateOtp();
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      <div className="absolute inset-0 flex overflow-hidden">
        <div aria-hidden="true" className="w-full h-full bg-[url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center animate-slideLeftRight" style={{ flexShrink: 0 }} />
        <div aria-hidden="true" className="w-full h-full bg-[url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center animate-slideRightLeft" style={{ flexShrink: 0 }} />
        <div aria-hidden="true" className="w-full h-full bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center animate-slideLeftRight" style={{ flexShrink: 0 }} />
        <div aria-hidden="true" className="w-full h-full bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center animate-slideRightLeft" style={{ flexShrink: 0 }} />
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      <div className="relative z-10 bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-2xl p-8 w-full max-w-sm mx-4 sm:mx-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Login
          </h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 border border-gray-300 rounded-md text-sm bg-gray-50"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>
        
        {message && (
          <div className={`p-3 rounded-lg text-sm text-center mb-4 font-semibold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form className="space-y-4" onKeyPress={handleKeyPress}>
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address / Mobile Number
            </label>
            <div className="flex space-x-2">
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                placeholder="Enter email or mobile"
              />
              <button
                type="button"
                onClick={handleGenerateOtp}
                disabled={loading}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading && message?.type !== 'success' ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </div>

          {otpSent && (
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                placeholder="Enter OTP"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleLogin}
            disabled={!otpSent || loading}
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700">
          Don't have an account?{' '}
          <a href="/register" className="text-orange-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;