import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    // Create a client with the user's token to verify they are authenticated
    const supabaseClient = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY") || "",
    );

    const jwt = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(jwt);
    if (userError || !user) {
      throw new Error(
        "Unauthorized: " + (userError?.message || "No user found"),
      );
    }

    // Create a service client for admin db operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { action, code } = await req.json();

    if (action === "send") {
      // 1. Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Expires in 15 minutes
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);

      // 2. Save OTP to profiles table
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          verification_code: otp,
          verification_code_expires_at: expiresAt.toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // 3. Send Email via Resend
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      const fromEmail = Deno.env.get("RESEND_FROM_EMAIL");

      if (!resendApiKey || !fromEmail) {
        throw new Error("Resend configuration missing");
      }

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0051d5; padding: 20px; text-align: center; color: #ffffff;">
            <h2 style="margin: 0;">Verify your Email</h2>
          </div>
          <div style="padding: 20px; background-color: #ffffff; color: #333333; text-align: center;">
            <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; padding: 12px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
              <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold; color: #555555;">Please do not reply to this email. This is a system-generated message.</p>
              <p style="margin: 0; font-size: 13px; color: #666666;">If you want to connect, please email us at <a href="mailto:rndworkzone@gmail.com" style="color: #0051d5; text-decoration: underline;">rndworkzone@gmail.com</a></p>
            </div>
            <p>Your email verification code is:</p>
            <div style="margin: 30px 0; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0051d5;">
              ${otp}
            </div>
            <p style="color: #666; font-size: 14px;">This code expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
          </div>
        </div>
      `;

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: user.email,
          subject: "Your Verification Code",
          html: htmlContent,
        }),
      });

      if (!emailRes.ok) {
        const err = await emailRes.text();
        console.error("Resend error:", err);
        throw new Error("Failed to send verification email");
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (action === "verify") {
      if (!code) throw new Error("Code is required");

      // 1. Fetch user's profile to check OTP
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("verification_code, verification_code_expires_at")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        throw new Error("Could not fetch profile");
      }

      if (profile.verification_code !== code) {
        throw new Error("Invalid verification code");
      }

      if (new Date(profile.verification_code_expires_at) < new Date()) {
        throw new Error("Verification code has expired");
      }

      // 2. Mark as verified
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          is_email_verified: true,
          verification_code: null,
          verification_code_expires_at: null,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      throw new Error("Invalid action");
    }
  } catch (error) {
    console.error("Verification error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  }
});
