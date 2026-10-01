import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL");

    if (!resendApiKey || !fromEmail) {
      console.warn("Missing environment variables. Skipping email notification.");
      return new Response(
        JSON.stringify({ success: false, error: "Configuration missing" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    const { updateDetails } = await req.json();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0051d5; padding: 20px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0;">Your Research Requirement Update</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Reference ID: ${updateDetails.reference_id}</p>
        </div>
        <div style="padding: 20px; background-color: #ffffff; color: #333333;">
          <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; padding: 12px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
            <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold; color: #555555;">Please do not reply to this email. This is a system-generated message.</p>
            <p style="margin: 0; font-size: 13px; color: #666666;">If you want to connect, please email us at <a href="mailto:rndworkzone@gmail.com" style="color: #0051d5; text-decoration: underline;">rndworkzone@gmail.com</a></p>
          </div>
          <p>Hello ${updateDetails.full_name},</p>
          <p>Your research requirement has been updated by our team.</p>
          <p><strong>Current Status:</strong> ${updateDetails.status}</p>
          
          ${updateDetails.admin_notes ? `
          <h3 style="border-bottom: 2px solid #0051d5; padding-bottom: 5px; margin-top: 30px;">Notes from our team</h3>
          <p style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${updateDetails.admin_notes}</p>
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
        to: updateDetails.email,
        subject: `Update on your Research Requirement — ${updateDetails.reference_id}`,
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
    console.error("Email Notification Failed:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  }
});
