export const generatePaymentHtml = (
  status: "success" | "failed" | "cancelled",
  transactionId?: string
) => {
  let title = "", message = "", color = "", emoji = "";

  switch (status) {
    case "success":
      emoji = "🎉";
      title = "Payment Successful";
      message = `Your transaction${transactionId ? ` (ID: ${transactionId})` : ""} was completed successfully.`;
      color = "#22c55e"; // green-500
      break;
    case "failed":
      emoji = "❌";
      title = "Payment Failed";
      message = "Unfortunately, your payment could not be processed.";
      color = "#ef4444"; // red-500
      break;
    case "cancelled":
      emoji = "⚠️";
      title = "Payment Cancelled";
      message = "Your payment was cancelled. Please try again if this was unintentional.";
      color = "#f97316"; // orange-500
      break;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
      <style>
        body {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          animation: fadeIn 1s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .container {
          text-align: center;
          padding: 40px;
          border: 1px solid #ddd;
          border-top: 8px solid ${color};
          border-radius: 16px;
          background-color: #fff;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          max-width: 500px;
          width: 90%;
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        h1 {
          color: ${color};
          font-size: 28px;
          margin-bottom: 12px;
        }

        .emoji {
          font-size: 48px;
        }

        p {
          font-size: 18px;
          color: #444;
          margin-bottom: 24px;
        }

        a.button {
          display: inline-block;
          padding: 12px 24px;
          background-color: ${color};
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          border-radius: 8px;
          transition: background-color 0.3s ease;
        }

        a.button:hover {
          background-color: #000000aa;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="emoji">${emoji}</div>
        <h1>${title}</h1>
        <p>${message}</p>
        <a class="button" href="https://royal-place.vercel.app">⬅️ Back to Home</a>
      </div>
    </body>
    </html>
  `;
};
