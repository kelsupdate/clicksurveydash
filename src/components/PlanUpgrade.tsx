import React, { useState } from 'react';
import MpesaVerification from './MpesaVerification';

const PlanUpgrade: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<{ id: number; name: string; price: number } | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const plans = [
    { id: 1, name: 'Basic', price: 100 },
    { id: 2, name: 'Standard', price: 500 },
    { id: 3, name: 'Premium', price: 1000 }
  ];

  const handleVerificationComplete = (success: boolean) => {
    setIsVerified(success);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerified && selectedPlan) {
      // Submit logic here
      console.log('Plan upgraded to:', selectedPlan);
      alert('Plan upgraded successfully!');
    }
  };

  return (
    <div className="plan-upgrade">
      <h2>Upgrade Your Plan</h2>
      
      <div className="plan-selection">
        <h3>Select a Plan</h3>
        <div className="plans">
          {plans.map(plan => (
            <div 
              key={plan.id}
              className={`plan-card ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
              onClick={() => setSelectedPlan(plan)}
            >
              <h4>{plan.name}</h4>
              <p>Ksh {plan.price}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <MpesaVerification 
          selectedPlan={selectedPlan} 
          onVerificationComplete={handleVerificationComplete} 
        />
      )}

      <button 
        type="button" 
        onClick={handleSubmit}
        disabled={!isVerified}
        className={isVerified ? 'success' : ''}
      >
        {isVerified ? 'Complete Upgrade' : 'Verify Payment First'}
      </button>
    </div>
  );
};

export default PlanUpgrade;
