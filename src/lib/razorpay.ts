let razorpayScriptPromise: Promise<boolean> | null = null;

const loadRazorpayScript = (): Promise<boolean> => {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
};

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => { open: () => void };
  }
}

/** Loads the Razorpay Checkout widget script (if needed) and opens it. Returns
 * false if the script failed to load, so the caller can show a fallback error. */
export const openRazorpayCheckout = async (options: RazorpayCheckoutOptions): Promise<boolean> => {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) return false;

  const instance = new window.Razorpay(options);
  instance.open();
  return true;
};
