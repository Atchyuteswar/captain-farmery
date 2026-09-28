const Razorpay = require("razorpay");

async function run() {
  try {
    const razorpay = new Razorpay({
      key_id: "dummy_key",
      key_secret: "dummy_secret",
    });
    
    const options = {
      amount: 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    console.log("Calling Razorpay with dummy keys...");
    const razorpayOrder = await razorpay.orders.create(options);
    console.log("Success:", razorpayOrder);
  } catch (e) {
    console.error("Razorpay Error:", e);
  }
}

run();
