require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function createCurrencyUpiSystem() {
  try {
    console.log('💰 Creating Multi-Currency and UPI Payment System...');
    
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL not found in environment variables');
      return;
    }
    
    console.log('📊 Connecting to database...');
    const sql = neon(databaseUrl);
    
    // 1. Add currency support to courses table
    console.log('📝 Adding currency support to courses...');
    try {
      await sql`
        ALTER TABLE courses 
        ADD COLUMN IF NOT EXISTS price_usd DECIMAL(10,2),
        ADD COLUMN IF NOT EXISTS price_inr DECIMAL(10,2),
        ADD COLUMN IF NOT EXISTS currency_primary TEXT DEFAULT 'USD',
        ADD COLUMN IF NOT EXISTS currency_supported TEXT[] DEFAULT ARRAY['USD', 'INR'];
      `;
      console.log('   ✅ Currency columns added to courses table');
    } catch (error) {
      console.log('   ⚠️ Currency columns may already exist');
    }
    
    // 2. Create UPI payment methods table
    console.log('📝 Creating tutor_payment_methods table...');
    await sql`
      CREATE TABLE IF NOT EXISTS tutor_payment_methods (
        id TEXT PRIMARY KEY,
        tutor_id TEXT NOT NULL,
        payment_type TEXT NOT NULL,
        upi_id TEXT,
        qr_code_url TEXT,
        bank_details JSONB,
        paypal_email TEXT,
        status TEXT DEFAULT 'pending',
        admin_approved BOOLEAN DEFAULT false,
        admin_notes TEXT,
        approved_by TEXT,
        approved_at TIMESTAMP,
        rejected_at TIMESTAMP,
        rejection_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // 3. Create currency exchange rates table
    console.log('📝 Creating currency_rates table...');
    await sql`
      CREATE TABLE IF NOT EXISTS currency_rates (
        id TEXT PRIMARY KEY,
        from_currency TEXT NOT NULL,
        to_currency TEXT NOT NULL,
        rate DECIMAL(10,6) NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        source TEXT DEFAULT 'manual',
        is_active BOOLEAN DEFAULT true,
        UNIQUE(from_currency, to_currency)
      );
    `;
    
    // 4. Create donation tracking table
    console.log('📝 Creating donations table...');
    await sql`
      CREATE TABLE IF NOT EXISTS donations (
        id TEXT PRIMARY KEY,
        donor_name TEXT,
        donor_email TEXT,
        amount DECIMAL(10,2) NOT NULL,
        currency TEXT DEFAULT 'USD',
        payment_method TEXT,
        payment_id TEXT,
        message TEXT,
        is_anonymous BOOLEAN DEFAULT false,
        status TEXT DEFAULT 'completed',
        donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // 5. Create payment approval requests table
    console.log('📝 Creating payment_approval_requests table...');
    await sql`
      CREATE TABLE IF NOT EXISTS payment_approval_requests (
        id TEXT PRIMARY KEY,
        tutor_id TEXT NOT NULL,
        request_type TEXT NOT NULL,
        payment_method_data JSONB NOT NULL,
        status TEXT DEFAULT 'pending',
        admin_notes TEXT,
        reviewed_by TEXT,
        reviewed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Create indexes
    console.log('📝 Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_tutor_payment_methods_tutor ON tutor_payment_methods (tutor_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tutor_payment_methods_status ON tutor_payment_methods (status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_currency_rates_active ON currency_rates (is_active);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_donations_date ON donations (donation_date);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_payment_approval_requests_tutor ON payment_approval_requests (tutor_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_payment_approval_requests_status ON payment_approval_requests (status);`;
    
    // Insert default currency rates
    console.log('📝 Inserting default currency rates...');
    const defaultRates = [
      { from: 'USD', to: 'INR', rate: 83.50 },
      { from: 'INR', to: 'USD', rate: 0.012 },
      { from: 'USD', to: 'USD', rate: 1.00 },
      { from: 'INR', to: 'INR', rate: 1.00 }
    ];
    
    for (const rateData of defaultRates) {
      const rateId = `rate_${rateData.from}_${rateData.to}`;
      await sql`
        INSERT INTO currency_rates (id, from_currency, to_currency, rate)
        VALUES (${rateId}, ${rateData.from}, ${rateData.to}, ${rateData.rate})
        ON CONFLICT (from_currency, to_currency) DO UPDATE SET
        rate = ${rateData.rate},
        last_updated = CURRENT_TIMESTAMP;
      `;
    }
    
    // Update existing courses with multi-currency pricing
    console.log('📝 Updating courses with multi-currency pricing...');
    const courses = await sql`SELECT id, price FROM courses WHERE price IS NOT NULL;`;
    
    for (const course of courses) {
      const priceUSD = parseFloat(course.price);
      const priceINR = Math.round(priceUSD * 83.50); // Convert USD to INR
      
      await sql`
        UPDATE courses 
        SET price_usd = ${priceUSD},
            price_inr = ${priceINR},
            currency_primary = 'USD',
            currency_supported = ARRAY['USD', 'INR']
        WHERE id = ${course.id};
      `;
    }
    
    // Insert sample UPI payment methods (pending approval)
    console.log('📝 Inserting sample UPI payment methods...');
    const sampleUpiMethods = [
      {
        id: 'upi_001',
        tutor_id: 'tutor_001',
        payment_type: 'upi',
        upi_id: 'tutor1@paytm',
        status: 'pending'
      },
      {
        id: 'upi_002',
        tutor_id: 'tutor_002',
        payment_type: 'upi',
        upi_id: 'instructor@phonepe',
        status: 'approved',
        admin_approved: true,
        approved_by: 'admin_001',
        approved_at: new Date().toISOString()
      }
    ];
    
    for (const method of sampleUpiMethods) {
      await sql`
        INSERT INTO tutor_payment_methods (
          id, tutor_id, payment_type, upi_id, status, admin_approved, approved_by, approved_at
        ) VALUES (
          ${method.id}, ${method.tutor_id}, ${method.payment_type}, ${method.upi_id},
          ${method.status}, ${method.admin_approved || false}, 
          ${method.approved_by || null}, ${method.approved_at || null}
        ) ON CONFLICT (id) DO NOTHING;
      `;
    }
    
    // Insert sample donations
    console.log('📝 Inserting sample donations...');
    const sampleDonations = [
      {
        id: 'donation_001',
        donor_name: 'Anonymous Supporter',
        amount: 5.00,
        currency: 'USD',
        payment_method: 'buymeacoffee',
        message: 'Great platform! Keep up the good work!',
        is_anonymous: true
      },
      {
        id: 'donation_002',
        donor_name: 'John Developer',
        donor_email: 'john@example.com',
        amount: 500.00,
        currency: 'INR',
        payment_method: 'upi',
        message: 'Thanks for the amazing courses!',
        is_anonymous: false
      }
    ];
    
    for (const donation of sampleDonations) {
      await sql`
        INSERT INTO donations (
          id, donor_name, donor_email, amount, currency, payment_method, message, is_anonymous
        ) VALUES (
          ${donation.id}, ${donation.donor_name}, ${donation.donor_email}, ${donation.amount},
          ${donation.currency}, ${donation.payment_method}, ${donation.message}, ${donation.is_anonymous}
        ) ON CONFLICT (id) DO NOTHING;
      `;
    }
    
    // Add system settings for donation
    console.log('📝 Adding donation system settings...');
    const donationSettings = [
      {
        id: 'setting_donation_001',
        key: 'buymeacoffee_url',
        value: 'https://www.buymeacoffee.com/akashbad',
        type: 'string',
        description: 'Buy Me a Coffee donation URL',
        public: true
      },
      {
        id: 'setting_donation_002',
        key: 'donation_enabled',
        value: 'true',
        type: 'boolean',
        description: 'Enable donation button in footer',
        public: true
      },
      {
        id: 'setting_currency_001',
        key: 'default_currency',
        value: 'USD',
        type: 'string',
        description: 'Default platform currency',
        public: true
      },
      {
        id: 'setting_currency_002',
        key: 'supported_currencies',
        value: 'USD,INR',
        type: 'string',
        description: 'Comma-separated list of supported currencies',
        public: true
      }
    ];
    
    for (const setting of donationSettings) {
      await sql`
        INSERT INTO system_settings (id, setting_key, setting_value, setting_type, description, is_public)
        VALUES (${setting.id}, ${setting.key}, ${setting.value}, ${setting.type}, ${setting.description}, ${setting.public})
        ON CONFLICT (setting_key) DO NOTHING;
      `;
    }
    
    console.log('🎉 Multi-Currency and UPI Payment System created successfully!');
    console.log('💰 Features implemented:');
    console.log('   ✅ Multi-currency support (USD, INR)');
    console.log('   ✅ UPI payment method integration');
    console.log('   ✅ Admin approval system for payment methods');
    console.log('   ✅ Currency exchange rate management');
    console.log('   ✅ Donation tracking system');
    console.log('   ✅ Buy Me a Coffee integration');
    console.log('   ✅ Payment approval workflow');
    
  } catch (error) {
    console.error('❌ Failed to create Currency and UPI system:', error);
  }
}

createCurrencyUpiSystem();
