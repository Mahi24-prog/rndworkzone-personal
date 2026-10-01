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
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL");

    if (!resendApiKey || !adminEmail || !fromEmail) {
      console.warn(
        "Missing environment variables. Skipping email notification.",
      );
      return new Response(
        JSON.stringify({ success: false, error: "Configuration missing" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    const { submissionDetails } = await req.json();

    // Generate signed URL if a file was uploaded
    let signedUrl = "";
    if (submissionDetails.file_path) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data, error } = await supabase
          .storage
          .from("requirements")
          .createSignedUrl(submissionDetails.file_path, 60 * 60 * 24 * 7); // Valid for 7 days
          
        if (data && !error) {
          signedUrl = data.signedUrl;
        } else {
          console.error("Failed to generate signed URL:", error);
        }
      }
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0051d5; padding: 20px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0;">New Research Requirement</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Reference ID: ${submissionDetails.reference_id}</p>
        </div>
        <div style="padding: 20px; background-color: #ffffff; color: #333333;">
          <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; padding: 12px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
            <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold; color: #555555;">Please do not reply to this email. This is a system-generated message.</p>
            <p style="margin: 0; font-size: 13px; color: #666666;">If you want to connect, please email us at <a href="mailto:rndworkzone@gmail.com" style="color: #0051d5; text-decoration: underline;">rndworkzone@gmail.com</a></p>
          </div>
          <p><strong>Submission Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Customer Name:</strong> ${submissionDetails.full_name}</p>
          <p><strong>Organization:</strong> ${submissionDetails.organization || "N/A"}</p>
          <p><strong>Email:</strong> ${submissionDetails.email}</p>
          <p><strong>Phone:</strong> ${submissionDetails.phone || "N/A"}</p>
          <p><strong>Industry:</strong> ${submissionDetails.industry}</p>
          <p><strong>Preferred Format:</strong> ${submissionDetails.format}</p>
          <p><strong>Current Status:</strong> ${submissionDetails.status}</p>
          
          <h3 style="border-bottom: 2px solid #0051d5; padding-bottom: 5px; margin-top: 30px;">Requirement Details</h3>
          <p style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${submissionDetails.requirement}</p>
          
          ${submissionDetails.file_name ? `
          <h3 style="border-bottom: 2px solid #0051d5; padding-bottom: 5px; margin-top: 30px;">Supporting Document</h3>
          <p style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
            <strong>Uploaded File:</strong> ${submissionDetails.file_name}<br>
            ${signedUrl ? `<a href="${signedUrl}" style="display: inline-block; margin-top: 10px; background-color: #ffffff; border: 1px solid #0051d5; padding: 8px 16px; text-decoration: none; color: #0051d5; border-radius: 4px; font-weight: bold;">Download Document</a><br><em style="font-size: 0.8em; color: #666; margin-top: 5px; display: inline-block;">Link valid for 7 days</em>` : `<em style="font-size: 0.9em; color: #666;">(Available securely in the Dashboard)</em>`}
          </p>
          ` : ''}

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://onlineworkcentre.com/dashboard" style="background-color: #0051d5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View in Dashboard</a>
          </div>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: adminEmail,
        subject: `New Research Requirement — ${submissionDetails.reference_id}`,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Resend API Error: ${errorText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Log the error securely in Edge Function logs
    console.error("Email Notification Failed:", error.message);

    // Return a 200 response with success: false so the frontend doesn't crash
    // and doesn't rollback the successful database insert.
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  }
});
