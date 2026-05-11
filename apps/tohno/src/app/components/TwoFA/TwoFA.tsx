import { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { usePostUsersTotpSetup, usePostUsersTotpVerify } from '../../api/generated/default/default';

export default function TwoFA() {
  const [code, setCode] = useState('');

  const setupMutation = usePostUsersTotpSetup();
  const verifyMutation = usePostUsersTotpVerify();

  useEffect(() => {
    setupMutation.mutate({ data: {} });
  }, []);

  const qrCode = (setupMutation.data as any)?.qrCode;

  const handleVerify = () => {
    if (!code || code.length !== 6) {
      alert('Please enter a valid 6-digit code');
      return;
    }
    verifyMutation.mutate(
      { data: { token: code } },
      {
        onSuccess: () => {
          alert('2FA enabled successfully!');
          window.location.href = '/account-settings';
        },
        onError: (error: any) => {
          alert(error?.error || 'Invalid code. Please try again.');
        },
      }
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Set Up Two-Factor Authentication</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Scan this QR code with your authenticator app (Google Authenticator, Microsoft Authenticator, etc.)
          </p>

          {setupMutation.isPending ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4 animate-pulse">⏳</div>
              <p className="text-gray-500">Loading QR code...</p>
            </div>
          ) : (
            <>
              <div className="bg-gray-100 rounded-lg p-4 mb-6 flex items-center justify-center min-h-[250px]">
                {qrCode ? (
                  <img src={qrCode} alt="2FA QR Code" className="w-full max-w-sm" />
                ) : (
                  <p className="text-gray-500">QR code unavailable</p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Enter 6-Digit Code</label>
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className="mt-1 border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest font-semibold"
                  />
                </div>

                <button
                  onClick={handleVerify}
                  disabled={verifyMutation.isPending || code.length !== 6}
                  className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {verifyMutation.isPending ? 'Verifying...' : 'Verify & Enable 2FA'}
                </button>
              </div>

              <p className="mt-6 text-center text-xs text-gray-400">
                Save your backup codes in a safe place. You'll need them if you lose access to your authenticator.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
