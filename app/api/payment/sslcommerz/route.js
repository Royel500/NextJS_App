// app/api/payment/sslcommerz/initiate/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { total_amount, product_name, customer_name, customer_email } = await request.json();

    console.log('🔗 Mock SSL Commerz API Called:', {
      total_amount, product_name, customer_name, customer_email
    });

    // Return proper JSON response
    return NextResponse.json({
      success: true,
      payment_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products/success?method=sslcommerz&amount=${total_amount}&product=${encodeURIComponent(product_name)}&transaction_id=${Date.now()}`,
      tran_id: `TXN${Date.now()}`,
      message: 'Mock SSL Commerz payment initiated successfully'
    });

  } catch (error) {
    console.error('Mock SSL Commerz error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Mock payment failed: ' + error.message 
      },
      { status: 500 }
    );
  }
}