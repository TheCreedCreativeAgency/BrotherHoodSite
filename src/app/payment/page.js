'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [stripeError, setStripeError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState(1000); // $10.00 in cents
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'US'
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setStripeError('');

    if (!stripe || !elements) {
      setMessage('Stripe has not loaded yet. Please check your internet connection and try again.');
      setLoading(false);
      return;
    }

    try {
      // Create payment intent
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, billingInfo }),
      });
      
      const { clientSecret } = await res.json();

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        }
      });

      if (error) {
        setMessage(`Payment failed: ${error.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        setMessage('Payment succeeded! Thank you for your purchase.');
        // Redirect to dashboard or show success
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Payment Amount
        </label>
        <input
          type="range"
          min={100}
          max={10000}
          step={100}
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          className="w-full mb-2"
        />
        <div className="text-lg font-semibold text-center">
          ${(amount / 100).toFixed(2)}
        </div>
      </div>

      {/* Billing Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
        
        {/* Name and Email */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={billingInfo.name}
              onChange={e => setBillingInfo({...billingInfo, name: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={billingInfo.email}
              onChange={e => setBillingInfo({...billingInfo, email: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
              placeholder="john@example.com"
            />
          </div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Street Address *
          </label>
          <input
            type="text"
            required
            value={billingInfo.address}
            onChange={e => setBillingInfo({...billingInfo, address: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
            placeholder="123 Main St"
          />
        </div>

        {/* City, ZIP, Country */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              City *
            </label>
            <input
              type="text"
              required
              value={billingInfo.city}
              onChange={e => setBillingInfo({...billingInfo, city: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
              placeholder="New York"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              ZIP Code *
            </label>
            <input
              type="text"
              required
              value={billingInfo.zipCode}
              onChange={e => setBillingInfo({...billingInfo, zipCode: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
              placeholder="10001"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">
          Card Information
        </label>
        
        {/* Card Number */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Card Number
          </label>
          <div className="p-3 border border-gray-300 rounded-lg bg-white">
            <CardNumberElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
              onChange={(event) => {
                if (event.error) {
                  setStripeError(event.error.message);
                } else {
                  setStripeError('');
                }
              }}
            />
          </div>
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Expiry Date
            </label>
            <div className="p-3 border border-gray-300 rounded-lg bg-white">
              <CardExpiryElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              CVC
            </label>
            <div className="p-3 border border-gray-300 rounded-lg bg-white">
              <CardCvcElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>

      {/* Debug Information */}
      <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
        <div>Stripe loaded: {stripe ? '✅' : '❌'}</div>
        <div>Elements loaded: {elements ? '✅' : '❌'}</div>
        <div>Publishable key: {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}</div>
      </div>

      {stripeError && (
        <div className="mt-4 text-center text-sm text-red-600">
          {stripeError}
        </div>
      )}

      {message && (
        <div className={`mt-4 text-center text-sm ${
          message.includes('succeeded') ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </div>
      )}
    </form>
  );
}

export default function PaymentPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to make a payment</h1>
          <a href="/login" className="text-blue-600 hover:underline">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-foreground text-center">
          Custom Payment
        </h1>
        <p className="mb-6 text-zinc-600 dark:text-zinc-300 text-center">
          Enter your payment details below. All transactions are secure.
        </p>
        
        <Elements stripe={stripePromise}>
          <PaymentForm />
        </Elements>
      </div>
    </div>
  );
}
