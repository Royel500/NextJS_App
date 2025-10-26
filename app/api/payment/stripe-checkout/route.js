// app/api/payment/stripe/checkout/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { amount, currency, productName, customerEmail, successUrl } = await request.json();

    console.log('🔗 Mock Stripe API Called:', {
      amount, currency, productName, customerEmail
    });

    // Return proper JSON response
    return NextResponse.json({
      success: true,
      sessionId: `cs_test_${Date.now()}`,
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products/success?method=stripe&amount=${amount}&product=${encodeURIComponent(productName)}&transaction_id=${Date.now()}`,
      message: 'Mock Stripe payment initiated successfully'
    });

  } catch (error) {
    console.error('Mock Stripe error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Mock payment failed: ' + error.message 
      },
      { status: 500 }
    );
  }
}