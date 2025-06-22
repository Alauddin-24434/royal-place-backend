"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const catchAsyncHandeller_1 = require("../../utils/catchAsyncHandeller");
const payment_services_1 = require("./payment.services");
// ======================================================================Payment Verify with Success======================================================================
const paymentSuccess = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.query;
    try {
        const payment = yield payment_services_1.paymentServices.paymentVerify(transactionId);
        const { status, pay_status, payment_type, status_title, transactionId: tran_id, amount } = payment;
        console.log({
            pay_status,
            status,
            payment_type,
            status_title,
            tran_id,
            amount
        });
        // Compact Royal Place payment success page
        res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Successful - Royal Place</title>
          <style>
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }

              body {
                  font-family: 'Georgia', serif;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 20px;
              }

              .container {
                  background: rgba(255, 255, 255, 0.95);
                  backdrop-filter: blur(10px);
                  border-radius: 15px;
                  padding: 25px;
                  max-width: 380px;
                  width: 100%;
                  text-align: center;
                  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
                  border: 1px solid rgba(255, 255, 255, 0.2);
              }

              .crown-icon {
                  width: 50px;
                  height: 50px;
                  margin: 0 auto 15px;
                  background: linear-gradient(45deg, #FFD700, #FFA500);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 25px;
                  color: #fff;
                  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
                  animation: pulse 2s infinite;
              }

              @keyframes pulse {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                  100% { transform: scale(1); }
              }

              .success-checkmark {
                  width: 40px;
                  height: 40px;
                  margin: 0 auto 15px;
                  background: #4CAF50;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  animation: checkmark 0.6s ease-in-out;
              }

              .success-checkmark::after {
                  content: '✓';
                  color: white;
                  font-size: 20px;
                  font-weight: bold;
              }

              @keyframes checkmark {
                  0% { transform: scale(0); }
                  50% { transform: scale(1.2); }
                  100% { transform: scale(1); }
              }

              h1 {
                  color: #2c3e50;
                  font-size: 1.8em;
                  margin-bottom: 8px;
                  font-weight: bold;
                  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
              }

              .subtitle {
                  color: #7f8c8d;
                  font-size: 1em;
                  margin-bottom: 20px;
                  font-style: italic;
              }

              .payment-details {
                  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                  border-radius: 10px;
                  padding: 15px;
                  margin: 15px 0;
                  border-left: 4px solid #FFD700;
              }

              .detail-row {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 10px;
                  padding: 5px 0;
                  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
              }

              .detail-row:last-child {
                  border-bottom: none;
                  margin-bottom: 0;
              }

              .detail-label {
                  font-weight: bold;
                  color: #34495e;
                  font-size: 0.9em;
              }

              .detail-value {
                  color: #2c3e50;
                  font-weight: 600;
                  font-size: 0.9em;
              }

              .amount {
                  color: #27ae60;
                  font-size: 1.1em;
                  font-weight: bold;
              }

              .status-badge {
                  display: inline-block;
                  padding: 4px 10px;
                  border-radius: 15px;
                  font-size: 0.7em;
                  font-weight: bold;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  background: linear-gradient(45deg, #4CAF50, #45a049);
                  color: white;
              }

              .action-buttons {
                  display: flex;
                  justify-content: center;
                  gap: 15px;
                  margin-top: 20px;
              }

              .print-button {
                  background: linear-gradient(45deg, #e74c3c, #c0392b);
                  color: white;
                  border: none;
                  padding: 12px;
                  border-radius: 50%;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: all 0.3s ease;
                  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
                  width: 45px;
                  height: 45px;
              }

              .print-button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
              }

              .home-button {
                  background: linear-gradient(45deg, #3498db, #2980b9);
                  color: white;
                  border: none;
                  padding: 12px;
                  border-radius: 50%;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: all 0.3s ease;
                  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
                  width: 45px;
                  height: 45px;
                  text-decoration: none;
              }

              .home-button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
              }

              .icon {
                  width: 20px;
                  height: 20px;
                  fill: currentColor;
              }

              .footer {
                  margin-top: 15px;
                  color: #7f8c8d;
                  font-size: 0.8em;
                  font-style: italic;
              }

              .royal-divider {
                  height: 1px;
                  background: linear-gradient(90deg, transparent, #FFD700, transparent);
                  margin: 15px 0;
              }

              @media (max-width: 600px) {
                  .container {
                      padding: 20px 15px;
                      margin: 10px;
                      max-width: 320px;
                  }
                  
                  h1 {
                      font-size: 1.5em;
                  }
                  
                  .detail-row {
                      flex-direction: column;
                      text-align: center;
                      gap: 3px;
                  }
              }

              /* Print Styles */
              @media print {
                  body {
                      background: white !important;
                      padding: 0;
                      margin: 0;
                  }
                  
                  .container {
                      background: white !important;
                      box-shadow: none !important;
                      border: 2px solid #333 !important;
                      border-radius: 0 !important;
                      backdrop-filter: none !important;
                      max-width: 100% !important;
                      margin: 0 !important;
                      padding: 20px !important;
                  }
                  
                  .action-buttons {
                      display: none !important;
                  }
                  
               
                  
              
                  
                  h1 {
                      color: #000 !important;
                      text-shadow: none !important;
                  }
                  
                  .payment-details {
                      background: #f8f9fa !important;
                      border: 1px solid #ddd !important;
                  }
                  
                  .status-badge {
                      background: #4CAF50 !important;
                      color: white !important;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container" id="receipt">
             
             
                <p class="subtitle">Royal Place</p>
              
              <h1>Payment Successful!</h1>
            
              <div class="royal-divider"></div>
              
              <div class="payment-details">
                  <div class="detail-row">
                      <span class="detail-label">Transaction ID:</span>
                      <span class="detail-value">${tran_id}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Amount:</span>
                      <span class="detail-value amount">৳${amount}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Payment Method:</span>
                      <span class="detail-value">${payment_type}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Status:</span>
                      <span class="status-badge">${status_title}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Date & Time:</span>
                      <span class="detail-value" id="datetime"></span>
                  </div>
              </div>
              
              <div class="action-buttons">
                  <a href="/" class="home-button" title="Go Home">
                      <svg class="icon" viewBox="0 0 24 24">
                          <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
                      </svg>
                  </a>
                  
                  <button class="print-button" onclick="printReceipt()" title="Print Receipt">
                      <svg class="icon" viewBox="0 0 24 24">
                          <path d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z"/>
                      </svg>
                  </button>
              </div>
              
              <div class="footer">
                  <p>Royal Place - Where Luxury Meets Excellence</p>
              </div>
          </div>

          <script>
              // Set current date and time
              document.getElementById('datetime').textContent = new Date().toLocaleString();
              
              function printReceipt() {
                  // Create a new window for printing
                  const printWindow = window.open('', '_blank');
                  const receiptContent = document.getElementById('receipt').outerHTML;
                  
                  printWindow.document.write(\`
                      <!DOCTYPE html>
                      <html>
                      <head>
                          <title>Payment Receipt - Royal Place</title>
                          <style>
                              * {
                                  margin: 0;
                                  padding: 0;
                                  box-sizing: border-box;
                              }
                              
                              body {
                                  font-family: 'Georgia', serif;
                                  background: white;
                                  padding: 20px;
                                  color: #333;
                              }
                              
                              .container {
                                  background: white;
                                  border: 2px solid #333;
                                  border-radius: 10px;
                                  padding: 25px;
                                  max-width: 500px;
                                  margin: 0 auto;
                                  text-align: center;
                              }
                              
                              .crown-icon {
                                  width: 50px;
                                  height: 50px;
                                  margin: 0 auto 15px;
                                  background: #FFD700;
                                  border-radius: 50%;
                                  display: flex;
                                  align-items: center;
                                  justify-content: center;
                                  font-size: 25px;
                                  color: #fff;
                              }
                              
                              .success-checkmark {
                                  width: 40px;
                                  height: 40px;
                                  margin: 0 auto 15px;
                                  background: #4CAF50;
                                  border-radius: 50%;
                                  display: flex;
                                  align-items: center;
                                  justify-content: center;
                              }
                              
                              .success-checkmark::after {
                                  content: '✓';
                                  color: white;
                                  font-size: 20px;
                                  font-weight: bold;
                              }
                              
                              h1 {
                                  color: #000;
                                  font-size: 1.8em;
                                  margin-bottom: 8px;
                                  font-weight: bold;
                              }
                              
                              .subtitle {
                                  color: #666;
                                  font-size: 1em;
                                  margin-bottom: 15px;
                                  font-style: italic;
                              }
                              
                              .payment-details {
                                  background: #f8f9fa;
                                  border: 1px solid #ddd;
                                  border-radius: 8px;
                                  padding: 15px;
                                  margin: 15px 0;
                                  text-align: left;
                              }
                              
                              .detail-row {
                                  display: flex;
                                  justify-content: space-between;
                                  align-items: center;
                                  margin-bottom: 10px;
                                  padding: 5px 0;
                                  border-bottom: 1px solid #eee;
                              }
                              
                              .detail-row:last-child {
                                  border-bottom: none;
                                  margin-bottom: 0;
                              }
                              
                              .detail-label {
                                  font-weight: bold;
                                  color: #333;
                                  font-size: 0.9em;
                              }
                              
                              .detail-value {
                                  color: #000;
                                  font-weight: 600;
                                  font-size: 0.9em;
                              }
                              
                              .amount {
                                  color: #27ae60;
                                  font-size: 1.1em;
                                  font-weight: bold;
                              }
                              
                              .status-badge {
                                  background: #4CAF50;
                                  color: white;
                                  padding: 4px 10px;
                                  border-radius: 12px;
                                  font-size: 0.7em;
                                  font-weight: bold;
                                  text-transform: uppercase;
                              }
                              
                              .royal-divider {
                                  height: 1px;
                                  background: #FFD700;
                                  margin: 15px 0;
                              }
                              
                              .footer {
                                  margin-top: 15px;
                                  color: #666;
                                  font-size: 0.8em;
                                  font-style: italic;
                                  border-top: 1px solid #eee;
                                  padding-top: 10px;
                              }
                              
                              .action-buttons {
                                  display: none;
                              }
                          </style>
                      </head>
                      <body>
                          \${receiptContent}
                      </body>
                      </html>
                  \`);
                  
                  printWindow.document.close();
                  
                  // Wait for content to load then print
                  setTimeout(() => {
                      printWindow.print();
                      printWindow.close();
                  }, 500);
              }
          </script>
      </body>
      </html>
    `);
    }
    catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).send("Internal Server Error");
    }
}));
// ===============================================================Payment Faild===================================================================
const paymentFail = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.query;
    try {
        const payment = yield payment_services_1.paymentServices.paymentFail(transactionId);
        const { payment_type, status_title, transactionId: tran_id, amount } = payment;
        // Compact Royal Place payment failure page
        res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Failed - Royal Place</title>
          <style>
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }

              body {
                  font-family: 'Georgia', serif;
                 
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 20px;
              }

              .container {
                
                  backdrop-filter: blur(10px);
                  border-radius: 15px;
                  padding: 25px;
                  max-width: 380px;
                  width: 100%;
                  text-align: center;
                  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
                  border: 1px solid rgba(255, 255, 255, 0.2);
                  border-top: 4px solid #e74c3c;
              }

              .warning-icon {
                  width: 50px;
                  height: 50px;
                  margin: 0 auto 15px;
                  background: linear-gradient(45deg, #f39c12, #e67e22);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 25px;
                  color: #fff;
                  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
                  animation: shake 1s ease-in-out;
              }

              @keyframes shake {
                  0%, 100% { transform: translateX(0); }
                  25% { transform: translateX(-5px); }
                  75% { transform: translateX(5px); }
              }

              .failure-cross {
                  width: 40px;
                  height: 40px;
                  margin: 0 auto 15px;
                  background: #e74c3c;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  animation: crossmark 0.6s ease-in-out;
              }

              .failure-cross::after {
                  content: '✕';
                  color: white;
                  font-size: 20px;
                  font-weight: bold;
              }

              @keyframes crossmark {
                  0% { transform: scale(0); }
                  50% { transform: scale(1.2); }
                  100% { transform: scale(1); }
              }

              h1 {
                  color: #c0392b;
                  font-size: 1.8em;
                  margin-bottom: 8px;
                  font-weight: bold;
                  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
              }

              .subtitle {
                  color: #e67e22;
                  font-size: 1em;
                  margin-bottom: 20px;
                  font-style: italic;
              }

              .payment-details {
                  background: linear-gradient(135deg, #fdf2f2, #fbeaea);
                  border-radius: 10px;
                  padding: 15px;
                  margin: 15px 0;
                  border-left: 4px solid #e74c3c;
              }

              .detail-row {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 10px;
                  padding: 5px 0;
                  border-bottom: 1px solid rgba(231, 76, 60, 0.1);
              }

              .detail-row:last-child {
                  border-bottom: none;
                  margin-bottom: 0;
              }

              .detail-label {
                  font-weight: bold;
                  color: #8b4513;
                  font-size: 0.9em;
              }

              .detail-value {
                  color: #c0392b;
                  font-weight: 600;
                  font-size: 0.9em;
              }

              .amount {
                  color: #e74c3c;
                  font-size: 1.1em;
                  font-weight: bold;
              }

              .status-badge {
                  display: inline-block;
                  padding: 4px 10px;
                  border-radius: 15px;
                  font-size: 0.7em;
                  font-weight: bold;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  background: linear-gradient(45deg, #e74c3c, #c0392b);
                  color: white;
              }

              .error-message {
                  background: linear-gradient(135deg, #e74c3c, #c0392b);
                  color: white;
                  padding: 15px;
                  border-radius: 10px;
                  margin: 15px 0;
                  font-size: 0.9em;
                  line-height: 1.4;
              }

              .action-buttons {
                  display: flex;
                  justify-content: center;
                  gap: 15px;
                  margin-top: 20px;
              }

              .retry-button {
                  background: linear-gradient(45deg, #f39c12, #e67e22);
                  color: white;
                  border: none;
                  padding: 12px;
                  border-radius: 50%;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: all 0.3s ease;
                  box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
                  width: 45px;
                  height: 45px;
                  text-decoration: none;
              }

              .retry-button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 6px 20px rgba(243, 156, 18, 0.4);
              }

              .home-button {
                  background: linear-gradient(45deg, #3498db, #2980b9);
                  color: white;
                  border: none;
                  padding: 12px;
                  border-radius: 50%;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: all 0.3s ease;
                  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
                  width: 45px;
                  height: 45px;
                  text-decoration: none;
              }

              .home-button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
              }

              .print-button {
                  background: linear-gradient(45deg, #95a5a6, #7f8c8d);
                  color: white;
                  border: none;
                  padding: 12px;
                  border-radius: 50%;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: all 0.3s ease;
                  box-shadow: 0 4px 15px rgba(149, 165, 166, 0.3);
                  width: 45px;
                  height: 45px;
              }

              .print-button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 6px 20px rgba(149, 165, 166, 0.4);
              }

              .icon {
                  width: 20px;
                  height: 20px;
                  fill: currentColor;
              }

              .footer {
                  margin-top: 15px;
                  color: #7f8c8d;
                  font-size: 0.8em;
                  font-style: italic;
              }

              .royal-divider {
                  height: 1px;
                  background: linear-gradient(90deg, transparent, #e74c3c, transparent);
                  margin: 15px 0;
              }

              @media (max-width: 600px) {
                  .container {
                      padding: 20px 15px;
                      margin: 10px;
                      max-width: 320px;
                  }
                  
                  h1 {
                      font-size: 1.5em;
                  }
                  
                  .detail-row {
                      flex-direction: column;
                      text-align: center;
                      gap: 3px;
                  }
              }

              /* Print Styles */
              @media print {
                  body {
                      background: white !important;
                      padding: 0;
                      margin: 0;
                  }
                  
                  .container {
                      background: white !important;
                      box-shadow: none !important;
                      border: 2px solid #e74c3c !important;
                      border-radius: 0 !important;
                      backdrop-filter: none !important;
                      max-width: 100% !important;
                      margin: 0 !important;
                      padding: 20px !important;
                  }
                  
                  .action-buttons {
                      display: none !important;
                  }
                  
                  .warning-icon {
                      animation: none !important;
                  }
                  
                  .failure-cross {
                      animation: none !important;
                  }
                  
                  h1 {
                      color: #c0392b !important;
                      text-shadow: none !important;
                  }
                  
                  .payment-details {
                      background: #fdf2f2 !important;
                      border: 1px solid #e74c3c !important;
                  }
                  
                  .status-badge {
                      background: #e74c3c !important;
                      color: white !important;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container" id="receipt">
            
              <div class="failure-cross"></div>
              
              <h1>Payment Failed!</h1>
              <p class="subtitle">Royal Place</p>
              
              <div class="royal-divider"></div>
              
              <div class="error-message">
                  <strong>Transaction could not be completed.</strong><br>
                  Please check your payment details and try again.
              </div>
              
              <div class="payment-details">
                  <div class="detail-row">
                      <span class="detail-label">Transaction ID:</span>
                      <span class="detail-value">${tran_id}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Amount:</span>
                      <span class="detail-value amount">৳${amount}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Payment Method:</span>
                      <span class="detail-value">${payment_type}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Status:</span>
                      <span class="status-badge">${status_title}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Date & Time:</span>
                      <span class="detail-value" id="datetime"></span>
                  </div>
              </div>
              
              <div class="action-buttons">
                  <a href="/" class="home-button" title="Go Home">
                      <svg class="icon" viewBox="0 0 24 24">
                          <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
                      </svg>
                  </a>
                  
               
                  
                  <button class="print-button" onclick="printReceipt()" title="Print Receipt">
                      <svg class="icon" viewBox="0 0 24 24">
                          <path d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z"/>
                      </svg>
                  </button>
              </div>
              
              <div class="footer">
                  <p>Royal Place - Where Luxury Meets Excellence</p>
              </div>
          </div>

          <script>
              // Set current date and time
              document.getElementById('datetime').textContent = new Date().toLocaleString();
              
              function printReceipt() {
                  // Create a new window for printing
                  const printWindow = window.open('', '_blank');
                  const receiptContent = document.getElementById('receipt').outerHTML;
                  
                  printWindow.document.write(\`
                      <!DOCTYPE html>
                      <html>
                      <head>
                          <title>Payment Failed Receipt - Royal Place</title>
                          <style>
                              * {
                                  margin: 0;
                                  padding: 0;
                                  box-sizing: border-box;
                              }
                              
                              body {
                                  font-family: 'Georgia', serif;
                                  background: white;
                                  padding: 20px;
                                  color: #333;
                              }
                              
                              .container {
                                  background: white;
                                  border: 2px solid #e74c3c;
                                  border-radius: 10px;
                                  padding: 25px;
                                  max-width: 500px;
                                  margin: 0 auto;
                                  text-align: center;
                              }
                              
                              .warning-icon {
                                  width: 50px;
                                  height: 50px;
                                  margin: 0 auto 15px;
                                  background: #f39c12;
                                  border-radius: 50%;
                                  display: flex;
                                  align-items: center;
                                  justify-content: center;
                                  font-size: 25px;
                                  color: #fff;
                              }
                              
                              .failure-cross {
                                  width: 40px;
                                  height: 40px;
                                  margin: 0 auto 15px;
                                  background: #e74c3c;
                                  border-radius: 50%;
                                  display: flex;
                                  align-items: center;
                                  justify-content: center;
                              }
                              
                              .failure-cross::after {
                                  content: '✕';
                                  color: white;
                                  font-size: 20px;
                                  font-weight: bold;
                              }
                              
                              h1 {
                                  color: #c0392b;
                                  font-size: 1.8em;
                                  margin-bottom: 8px;
                                  font-weight: bold;
                              }
                              
                              .subtitle {
                                  color: #e67e22;
                                  font-size: 1em;
                                  margin-bottom: 15px;
                                  font-style: italic;
                              }
                              
                              .error-message {
                                  background: #fdf2f2;
                                  color: #c0392b;
                                  padding: 15px;
                                  border: 1px solid #e74c3c;
                                  border-radius: 8px;
                                  margin: 15px 0;
                                  font-size: 0.9em;
                              }
                              
                              .payment-details {
                                  background: #fdf2f2;
                                  border: 1px solid #e74c3c;
                                  border-radius: 8px;
                                  padding: 15px;
                                  margin: 15px 0;
                                  text-align: left;
                              }
                              
                              .detail-row {
                                  display: flex;
                                  justify-content: space-between;
                                  align-items: center;
                                  margin-bottom: 10px;
                                  padding: 5px 0;
                                  border-bottom: 1px solid rgba(231, 76, 60, 0.2);
                              }
                              
                              .detail-row:last-child {
                                  border-bottom: none;
                                  margin-bottom: 0;
                              }
                              
                              .detail-label {
                                  font-weight: bold;
                                  color: #8b4513;
                                  font-size: 0.9em;
                              }
                              
                              .detail-value {
                                  color: #c0392b;
                                  font-weight: 600;
                                  font-size: 0.9em;
                              }
                              
                              .amount {
                                  color: #e74c3c;
                                  font-size: 1.1em;
                                  font-weight: bold;
                              }
                              
                              .status-badge {
                                  background: #e74c3c;
                                  color: white;
                                  padding: 4px 10px;
                                  border-radius: 12px;
                                  font-size: 0.7em;
                                  font-weight: bold;
                                  text-transform: uppercase;
                              }
                              
                              .royal-divider {
                                  height: 1px;
                                  background: #e74c3c;
                                  margin: 15px 0;
                              }
                              
                              .footer {
                                  margin-top: 15px;
                                  color: #666;
                                  font-size: 0.8em;
                                  font-style: italic;
                                  border-top: 1px solid #eee;
                                  padding-top: 10px;
                              }
                              
                              .action-buttons {
                                  display: none;
                              }
                          </style>
                      </head>
                      <body>
                          \${receiptContent}
                      </body>
                      </html>
                  \`);
                  
                  printWindow.document.close();
                  
                  // Wait for content to load then print
                  setTimeout(() => {
                      printWindow.print();
                      printWindow.close();
                  }, 500);
              }
          </script>
      </body>
      </html>
    `);
    }
    catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).send("Internal Server Error");
    }
}));
// ===============================================================Payment Cancel===================================================================
const paymentCancel = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.query;
    const payment = yield payment_services_1.paymentServices.paymentCancel(transactionId);
    const { payment_type, status_title, transactionId: tran_id, amount, pay_status, status, } = payment;
    res.status(200).json({
        success: true,
        message: "Payment cancelled successfully.",
        data: {
            transactionId: tran_id,
            status,
            pay_status,
            status_title,
            payment_type,
            amount,
        },
    });
}));
// ======================Export controller=============================
exports.paymentController = {
    paymentSuccess,
    paymentFail,
    paymentCancel
};
