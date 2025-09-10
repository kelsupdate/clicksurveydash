import React, { useState, useEffect } from 'react';

interface MpesaVerificationProps {
  selectedPlan: { id: number; name: string; price: number } | null;
  onVerificationComplete: (success: boolean) => void;
}

const MpesaVerification: React.FC<MpesaVerificationProps> = ({ 
  selectedPlan, 
  onVerificationComplete 
}) => {
  const [mpesaMessage, setMpesaMessage] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Parse M-Pesa message
  const parseMpesaMessage = (message: string) => {
    // Extract amount (handles formats like "Ksh1,000.00" or "Ksh 1000")
    const amountRegex = /Ksh\s?([\d,]+(\.\d{2})?)/i;
    const amountMatch = message.match(amountRegex);
    
    // Extract till name (handles "to", "Paybill", or "Till Number" formats)
    const tillRegex = /(to|Paybill|Till Number):\s*([^\n,]+)/i;
    const tillMatch = message.match(tillRegex);
    
    if (!amountMatch || !tillMatch) return null;
    
    return {
      amount: parseFloat(amountMatch[1].replace(/,/g, '')),
      tillName: tillMatch[2].trim()
    };
  };

  const handleMpesaPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    setMpesaMessage(pastedText);
    verifyMpesaMessage(pastedText);
  };

  const verifyMpesaMessage = (message: string) => {
    if (!selectedPlan) {
      setVerificationStatus('error');
      setErrorMessage('Please select a plan first');
      onVerificationComplete(false);
      return;
    }

    const parsed = parseMpesaMessage(message);
    
    if (!parsed) {
      setVerificationStatus('error');
      setErrorMessage('Invalid M-Pesa message format');
      onVerificationComplete(false);
      return;
    }

    // Verify amount matches plan price
    const amountMatches = parsed.amount === selectedPlan.price;
    
    // Verify till name (replace with your actual till name)
    const tillMatches = parsed.tillName.toLowerCase() === 'clicksurvey';
    
    if (amountMatches && tillMatches) {
      setVerificationStatus('success');
      setErrorMessage('');
      onVerificationComplete(true);
    } else {
      setVerificationStatus('error');
      let errorMsg = 'Verification failed: ';
      if (!amountMatches) {
        errorMsg += `Amount mismatch. Expected Ksh ${selectedPlan.price}, found Ksh ${parsed.amount}. `;
      }
      if (!tillMatches) {
        errorMsg += 'Invalid till name. Expected "CLICKSURVEY".';
      }
      setErrorMessage(errorMsg);
      onVerificationComplete(false);
    }
  };

  // Reset verification when plan changes
  useEffect(() => {
    setVerificationStatus('idle');
    setErrorMessage('');
    setMpesaMessage('');
  }, [selectedPlan]);

  return (
    <div className="mpesa-verification">
      <h3>M-Pesa Payment Verification</h3>
      <div className="form-group">
        <label>Paste M-Pesa Confirmation Message</label>
        <textarea
          value={mpesaMessage}
          onChange={(e) => setMpesaMessage(e.target.value)}
          onPaste={handleMpesaPaste}
          placeholder="Paste your M-Pesa confirmation message here..."
          rows={4}
        />
      </div>
      
      {verificationStatus === 'success' && (
        <div className="verification-status success">
          Payment verified successfully!
        </div>
      )}
      
      {verificationStatus === 'error' && (
        <div className="verification-status error">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default MpesaVerification;
