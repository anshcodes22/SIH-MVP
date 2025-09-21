import React, { useState } from 'react';
import { Smartphone, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const { signIn, sendOTP } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await sendOTP(mobileNumber);
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await signIn(mobileNumber, otp);
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Travel Survey</h1>
            <p className="text-gray-600">Secure OTP-based authentication</p>
          </div>

          {/* Demo Instructions */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Demo Instructions:</strong><br />
              • Enter any 10-digit mobile number<br />
              • Use OTP: <code className="bg-gray-200 px-1 rounded">123456</code><br />
              • Start with 9999 for scientist access
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {step === 'mobile' ? (
            <form onSubmit={handleSendOTP}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || mobileNumber.length !== 10}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  OTP sent to +91 {mobileNumber}
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit OTP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-wider"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Verify & Sign In'
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('mobile')}
                className="w-full mt-3 text-sm text-gray-600 hover:text-gray-800"
              >
                Change mobile number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};