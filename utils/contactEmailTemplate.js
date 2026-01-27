function contactEmailTemplate({ name, email, phone, country, message }) {
  return `
  <div style="background:#f3f4f6; padding:30px; font-family:Arial, Helvetica, sans-serif;">
    
    <div style="
      max-width:600px;
      margin:auto;
      background:#ffffff;
      border-radius:10px;
      overflow:hidden;
      box-shadow:0 10px 25px rgba(0,0,0,0.08);
    ">
      
      <!-- HEADER -->
      <div style="background:#111827; color:#ffffff; padding:20px;">
        <h2 style="margin:0; font-size:20px;">📩 New Contact Form Submission</h2>
      </div>

      <!-- BODY -->
      <div style="padding:24px; color:#111827; font-size:14px;">
        <p style="margin-bottom:20px;">
          You have received a new message from your website contact form.
        </p>

        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0; font-weight:bold; width:120px;">Name</td>
            <td style="padding:8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; font-weight:bold;">Email</td>
            <td style="padding:8px 0;">
              <a href="mailto:${email}" style="color:#2563eb; text-decoration:none;">
                ${email}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0; font-weight:bold;">Phone</td>
            <td style="padding:8px 0;">${phone || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; font-weight:bold;">Country</td>
            <td style="padding:8px 0;">${country || "N/A"}</td>
          </tr>
        </table>

        <hr style="margin:24px 0; border:none; border-top:1px solid #e5e7eb;" />

        <h3 style="margin-bottom:8px;">Message</h3>
        <div style="
          background:#f9fafb;
          padding:14px;
          border-radius:6px;
          font-size:14px;
          line-height:1.6;
        ">
          ${message}
        </div>
      </div>

      <!-- FOOTER -->
      <div style="
        background:#f3f4f6;
        padding:12px 20px;
        font-size:12px;
        color:#6b7280;
        text-align:center;
      ">
        This email was generated from your website contact form.
      </div>

    </div>
  </div>
  `;
}

module.exports = contactEmailTemplate;
