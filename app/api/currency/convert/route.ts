import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { sanitizeInput } from "@/lib/security";
import { apiRateLimit } from "@/lib/rate-limit";

// Currency conversion utility
async function convertCurrency(amount: number, fromCurrency: string, toCurrency: string, sql: any): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Get exchange rate
  const rate = await sql`
    SELECT rate FROM currency_rates 
    WHERE from_currency = ${fromCurrency} 
    AND to_currency = ${toCurrency} 
    AND is_active = true;
  `;

  if (rate.length === 0) {
    throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
  }

  return Math.round(amount * parseFloat(rate[0].rate) * 100) / 100;
}

// Get currency conversion rates
async function handleGET(request: NextRequest) {
  try {
    console.log("[API] Getting currency conversion rates");
    
    const { searchParams } = new URL(request.url);
    const fromCurrency = searchParams.get('from');
    const toCurrency = searchParams.get('to');
    const amount = searchParams.get('amount');

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    if (fromCurrency && toCurrency && amount) {
      // Convert specific amount
      const sanitizedFrom = sanitizeInput(fromCurrency.toUpperCase());
      const sanitizedTo = sanitizeInput(toCurrency.toUpperCase());
      const numAmount = parseFloat(amount);

      if (isNaN(numAmount) || numAmount <= 0) {
        return NextResponse.json(
          { error: "Invalid amount", code: "INVALID_AMOUNT" },
          { status: 400 }
        );
      }

      try {
        const convertedAmount = await convertCurrency(numAmount, sanitizedFrom, sanitizedTo, sql);
        
        return NextResponse.json({
          success: true,
          conversion: {
            from: sanitizedFrom,
            to: sanitizedTo,
            originalAmount: numAmount,
            convertedAmount,
            rate: convertedAmount / numAmount
          }
        });
      } catch (error) {
        return NextResponse.json(
          { error: error.message, code: "CONVERSION_ERROR" },
          { status: 400 }
        );
      }
    } else {
      // Get all available rates
      const rates = await sql`
        SELECT from_currency, to_currency, rate, last_updated
        FROM currency_rates 
        WHERE is_active = true
        ORDER BY from_currency, to_currency;
      `;

      // Get supported currencies
      const supportedCurrencies = await sql`
        SELECT DISTINCT from_currency as currency FROM currency_rates WHERE is_active = true
        UNION
        SELECT DISTINCT to_currency as currency FROM currency_rates WHERE is_active = true
        ORDER BY currency;
      `;

      return NextResponse.json({
        success: true,
        rates,
        supportedCurrencies: supportedCurrencies.map(c => c.currency),
        lastUpdated: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error("[API] Error getting currency rates:", error);
    return NextResponse.json(
      { error: "Failed to get currency rates", code: "CURRENCY_FETCH_ERROR" },
      { status: 500 }
    );
  }
}

// Update currency rates (admin only)
async function handlePOST(request: NextRequest) {
  try {
    console.log("[API] Updating currency rates");
    
    // For now, allow manual rate updates
    // In production, this would be restricted to admin users
    
    const body = await request.json();
    const { fromCurrency, toCurrency, rate } = body;

    // Validate required fields
    if (!fromCurrency || !toCurrency || !rate) {
      return NextResponse.json(
        { error: "From currency, to currency, and rate are required", code: "MISSING_REQUIRED_FIELDS" },
        { status: 400 }
      );
    }

    const numRate = parseFloat(rate);
    if (isNaN(numRate) || numRate <= 0) {
      return NextResponse.json(
        { error: "Invalid exchange rate", code: "INVALID_RATE" },
        { status: 400 }
      );
    }

    const sanitizedFrom = sanitizeInput(fromCurrency.toUpperCase());
    const sanitizedTo = sanitizeInput(toCurrency.toUpperCase());

    // Connect to database
    const sql = neon(process.env.DATABASE_URL!);

    // Update or insert rate
    const rateId = `rate_${sanitizedFrom}_${sanitizedTo}`;
    
    await sql`
      INSERT INTO currency_rates (id, from_currency, to_currency, rate, source)
      VALUES (${rateId}, ${sanitizedFrom}, ${sanitizedTo}, ${numRate}, 'manual')
      ON CONFLICT (from_currency, to_currency) DO UPDATE SET
      rate = ${numRate},
      last_updated = CURRENT_TIMESTAMP,
      source = 'manual';
    `;

    console.log(`[API] Currency rate updated: ${sanitizedFrom} to ${sanitizedTo} = ${numRate}`);

    return NextResponse.json({
      success: true,
      message: "Currency rate updated successfully",
      rate: {
        from: sanitizedFrom,
        to: sanitizedTo,
        rate: numRate,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("[API] Error updating currency rate:", error);
    return NextResponse.json(
      { error: "Failed to update currency rate", code: "CURRENCY_UPDATE_ERROR" },
      { status: 500 }
    );
  }
}

// Get course pricing in multiple currencies
export async function getCoursePrice(courseId: string, targetCurrency: string = 'USD') {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Get course pricing
    const course = await sql`
      SELECT price_usd, price_inr, currency_primary, currency_supported
      FROM courses 
      WHERE id = ${courseId};
    `;

    if (course.length === 0) {
      throw new Error('Course not found');
    }

    const courseData = course[0];
    const supportedCurrencies = courseData.currency_supported || ['USD'];

    // If target currency is directly available
    if (targetCurrency === 'USD' && courseData.price_usd) {
      return { price: courseData.price_usd, currency: 'USD' };
    }
    if (targetCurrency === 'INR' && courseData.price_inr) {
      return { price: courseData.price_inr, currency: 'INR' };
    }

    // Convert from primary currency
    const primaryPrice = courseData.price_usd || courseData.price_inr;
    const primaryCurrency = courseData.price_usd ? 'USD' : 'INR';

    if (primaryCurrency === targetCurrency) {
      return { price: primaryPrice, currency: targetCurrency };
    }

    // Convert currency
    const convertedPrice = await convertCurrency(primaryPrice, primaryCurrency, targetCurrency, sql);
    return { price: convertedPrice, currency: targetCurrency };

  } catch (error) {
    console.error('Error getting course price:', error);
    throw error;
  }
}

// Export rate-limited handlers
export const GET = apiRateLimit(handleGET);
export const POST = apiRateLimit(handlePOST);
