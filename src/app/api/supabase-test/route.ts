import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  const configCheck = {
    hasUrl: Boolean(url.trim()),
    hasKey: Boolean(key.trim()),
    projectHost: url ? new URL(url).hostname : null,
  };

  if (!configCheck.hasUrl || !configCheck.hasKey) {
    return NextResponse.json(
      {
        success: false,
        error: 'Missing required Supabase environment variables in .env.local',
        configCheck,
      },
      { status: 500 }
    );
  }

  try {
    const startTime = Date.now();
    const supabase = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // 1. Test Auth Service reachability
    const { data: authData, error: authError } = await supabase.auth.getSession();
    const latencyMs = Date.now() - startTime;

    // 2. Direct ping to Supabase Auth Health endpoint
    let authServiceInfo = null;
    let authHealthStatusCode = 0;
    try {
      const res = await fetch(`${url}/auth/v1/health`, {
        headers: { apikey: key },
        cache: 'no-store',
      });
      authHealthStatusCode = res.status;
      authServiceInfo = await res.json().catch(() => null);
    } catch (netErr: any) {
      authHealthStatusCode = 0;
    }

    // 3. Database & PostgREST reachability test
    const { error: dbError } = await supabase.from('_health_check').select('*').limit(1);
    
    // PGRST205 means PostgREST accepted key and checked PostgreSQL schema cache (table just doesn't exist yet)
    const isPostgrestReachable = Boolean(
      !dbError || (dbError && dbError.code === 'PGRST205')
    );

    return NextResponse.json({
      success: true,
      configCheck,
      latencyMs,
      services: {
        authService: {
          reachable: authHealthStatusCode === 200,
          statusCode: authHealthStatusCode,
          details: authServiceInfo,
        },
        authClient: {
          sessionCallable: !authError,
          hasSession: Boolean(authData?.session),
          error: authError ? authError.message : null,
        },
        databasePostgREST: {
          reachable: isPostgrestReachable,
          status: isPostgrestReachable
            ? 'Connected to PostgreSQL schema cache (Key accepted)'
            : 'Unreachable / rejected',
          details: dbError ? { code: dbError.code, message: dbError.message } : 'Ready',
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Unexpected connection error',
        configCheck,
      },
      { status: 500 }
    );
  }
}
