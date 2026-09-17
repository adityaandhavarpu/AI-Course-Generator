import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register(formData.name, formData.email, formData.password);
      const { token, _id, name, email } = response.data;
      login({ id: _id, name, email }, token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131314] text-[#e3e3e3] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#9b51e0]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[#4285f4]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md rounded-2xl glass-card border border-[#2d2f31] p-8 shadow-2xl my-8">
        <div className="flex flex-col items-center gap-3 text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4285f4] via-[#9b51e0] to-[#e91e63] flex items-center justify-center p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-[#131314] rounded-[14px] flex items-center justify-center">
              <span className="text-2xl animate-spark-pulse">✨</span>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Create Your <span className="gemini-text-gradient">AI Workspace</span>
          </h1>

          <p className="text-xs text-[#80868b]">Join to start building structured AI learning courses</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs mb-4">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#c4c7c5] uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#1e1f20] border border-[#2d2f31] text-[#e3e3e3] placeholder-[#80868b] focus:outline-none focus:border-[#4285f4] text-sm transition"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#c4c7c5] uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#1e1f20] border border-[#2d2f31] text-[#e3e3e3] placeholder-[#80868b] focus:outline-none focus:border-[#4285f4] text-sm transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#c4c7c5] uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#1e1f20] border border-[#2d2f31] text-[#e3e3e3] placeholder-[#80868b] focus:outline-none focus:border-[#4285f4] text-sm transition"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#c4c7c5] uppercase tracking-wider mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#1e1f20] border border-[#2d2f31] text-[#e3e3e3] placeholder-[#80868b] focus:outline-none focus:border-[#4285f4] text-sm transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4285f4] via-[#9b51e0] to-[#e91e63] text-white font-semibold text-sm hover:opacity-95 transition shadow-lg shadow-purple-500/20 disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating Account...' : 'Get Started ✨'}
          </button>
        </form>

        <p className="text-center text-xs text-[#80868b] mt-6">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-[#4285f4] font-semibold hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
