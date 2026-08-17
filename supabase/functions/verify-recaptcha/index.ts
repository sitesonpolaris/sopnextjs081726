import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RecaptchaRequest {
  token: string;
  expectedAction?: string;
}

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  "error-codes"?: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { token, expectedAction }: RecaptchaRequest = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const recaptchaSecretKey = Deno.env.get("RECAPTCHA_SECRET_KEY");

    if (!recaptchaSecretKey) {
      console.error("RECAPTCHA_SECRET_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const verifyResponse = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${recaptchaSecretKey}&response=${token}`,
    });

    const verifyData: RecaptchaResponse = await verifyResponse.json();

    if (!verifyData.success) {
      return new Response(
        JSON.stringify({
          success: false,
          score: 0,
          error: "reCAPTCHA verification failed",
          errorCodes: verifyData["error-codes"],
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (expectedAction && verifyData.action !== expectedAction) {
      return new Response(
        JSON.stringify({
          success: false,
          score: verifyData.score,
          error: "Action mismatch",
          expectedAction,
          receivedAction: verifyData.action,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const THRESHOLD = 0.6;
    const passed = verifyData.score >= THRESHOLD;

    return new Response(
      JSON.stringify({
        success: passed,
        score: verifyData.score,
        action: verifyData.action,
        threshold: THRESHOLD,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
