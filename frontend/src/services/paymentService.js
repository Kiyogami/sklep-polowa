import { ordersApi } from './api';

const PAYMENT_METHODS = {
  STRIPE: 'stripe',
  PRZELEWY24: 'przelewy24',
  BLIK: 'blik',
  COD: 'cod' // Cash on Delivery
};

// Simulate payment processing delay (for payment gateway simulation)
const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique payment ID (Mock for payment gateway ID)
const generatePaymentId = () => `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Stripe Payment (Card)
export const processStripePayment = async (orderData, cardDetails) => {
  console.log('Processing Stripe payment...', { orderData, cardDetails: '***' });
  await simulateDelay(2000);
  const success = Math.random() > 0.1;
  
  if (success) {
    return {
      success: true,
      paymentId: generatePaymentId(),
      method: PAYMENT_METHODS.STRIPE,
      amount: orderData.total,
      currency: 'PLN',
      status: 'completed',
    };
  } else {
    return { success: false, error: 'Płatność odrzucona przez bank.', errorCode: 'CARD_DECLINED' };
  }
};

// Przelewy24 Payment
export const processPrzelewy24Payment = async (orderData, bankCode) => {
  console.log('Processing Przelewy24 payment...', { orderData, bankCode });
  await simulateDelay(1500);
  return {
    success: true,
    paymentId: generatePaymentId(),
    method: PAYMENT_METHODS.PRZELEWY24,
    amount: orderData.total,
    currency: 'PLN',
    status: 'pending', // Usually redirects
    redirectUrl: `https://secure.przelewy24.pl/demo?order=${orderData.id}&amount=${orderData.total}`
  };
};

// BLIK Payment
export const processBlikPayment = async (orderData, blikCode) => {
  console.log('Processing BLIK payment...', { orderData, blikCode: '***' });
  if (!/^\d{6}$/.test(blikCode)) {
    return { success: false, error: 'Nieprawidłowy kod BLIK.', errorCode: 'INVALID_BLIK_CODE' };
  }
  await simulateDelay(3000);
  const success = Math.random() > 0.05;
  
  if (success) {
    return {
      success: true,
      paymentId: generatePaymentId(),
      method: PAYMENT_METHODS.BLIK,
      amount: orderData.total,
      currency: 'PLN',
      status: 'completed',
    };
  } else {
    return { success: false, error: 'Kod BLIK wygasł lub odrzucony.', errorCode: 'BLIK_EXPIRED' };
  }
};

// Telegram Payment
export const processTelegramPayment = async (orderData, webApp) => {
   // TODO: Implement real Telegram Invoice
   return { success: false, error: 'Not implemented yet' };
};


// Main function to create order and process payment
export const createOrderWithPayment = async (orderData, paymentMethod, paymentDetails, webApp = null) => {
  try {
      // 1. Process Payment (Mocked or Real)
      // In a real app, we might create the order first as "pending_payment", then process payment.
      // But here we do it together for simplicity or as per previous flow.
      
      let paymentResult;
      
      // Basic validation
      if (!orderData) return { success: false, error: "Brak danych zamówienia" };

      // Pre-process payment (Mock)
      switch (paymentMethod) {
        case PAYMENT_METHODS.STRIPE:
          paymentResult = await processStripePayment(orderData, paymentDetails);
          break;
        case PAYMENT_METHODS.PRZELEWY24:
          paymentResult = await processPrzelewy24Payment(orderData, paymentDetails?.bankCode);
          break;
        case PAYMENT_METHODS.BLIK:
          paymentResult = await processBlikPayment(orderData, paymentDetails?.blikCode);
          break;
        case 'cod':
           paymentResult = { success: true, method: 'cod', status: 'pending', paymentId: 'COD-' + Date.now() };
           break;
        case 'telegram':
           paymentResult = await processTelegramPayment(orderData, webApp);
           break;
        default:
          return { success: false, error: 'Nieznana metoda płatności.' };
      }

      if (!paymentResult.success) {
          return { success: false, error: paymentResult.error, errorCode: paymentResult.errorCode };
      }

      // 2. Prepare Order Data for Backend
      // Map frontend structure to OrderIn model
      // Backend expects: customer, items, delivery, payment, verification
      
      const payload = {
          customer: {
              name: orderData.customer.name,
              email: orderData.customer.email,
              phone: orderData.customer.phone,
              telegramUsername: orderData.customer.telegram?.replace('@', '') || null,
              // telegramUserId/ChatId handled by backend via token if available or empty
          },
          items: orderData.items.map(item => ({
              productId: item.productId || item.id, // Handle both
              name: item.name,
              variant: item.variant,
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: item.price * item.quantity
          })),
          delivery: {
              method: orderData.deliveryMethod,
              lockerCode: orderData.deliveryAddress?.locker || null,
              pickupLocation: orderData.pickupLocation || null,
              // pickupTimeSlot and Alias should be passed if available
          },
          payment: {
              method: paymentMethod,
              status: paymentResult.status, // "completed" or "pending"
              paymentId: paymentResult.paymentId,
              currency: "PLN",
              subtotal: orderData.subtotal,
              deliveryCost: orderData.deliveryCost,
              total: orderData.total
          },
          verification: {
              required: orderData.requiresVerification,
              status: "pending" // Initial status
          }
      };

      // 3. Call Backend
      const orderOut = await ordersApi.create(payload);

      return {
          success: true,
          orderId: orderOut.id,
          payment: paymentResult,
          order: orderOut
      };

  } catch (error) {
      console.error("Order creation failed:", error);
      return { 
          success: false, 
          error: error.response?.data?.detail || "Błąd tworzenia zamówienia w systemie." 
      };
  }
};

export default {
  createOrderWithPayment,
  PAYMENT_METHODS
};
