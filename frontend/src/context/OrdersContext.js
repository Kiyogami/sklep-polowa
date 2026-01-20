import { createContext, useContext, useState, useEffect } from 'react';

const OrdersContext = createContext(null);

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('prascy-orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  useEffect(() => {
    localStorage.setItem('prascy-orders', JSON.stringify(orders));
  }, [orders]);

  // Add new order
  const addOrder = (orderData) => {
    const baseId = orderData.orderId || `ORD-${Date.now().toString().slice(-6)}`;

    const newOrder = {
      id: baseId,
      ...orderData,
      // jeśli zamówienie wymaga weryfikacji, startujemy ze statusem "oczekuje" po stronie weryfikacji
      verificationStatus: orderData.requiresVerification ? 'pending' : orderData.verificationStatus ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };


  // Update order status
  const updateOrderStatus = (orderId, status, additionalData = {}) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status, 
            ...additionalData,
            updatedAt: new Date().toISOString() 
          }
        : order
    ));
  };

  // Get order by ID
  const getOrder = (orderId) => {
    return orders.find(o => o.id === orderId);
  };

  // Get all orders
  const getAllOrders = () => {
    return orders;
  };

  // Clear all orders (for testing)
  const clearOrders = () => {
    setOrders([]);
  };

  return (
    <OrdersContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      getOrder,
      getAllOrders,
      clearOrders
    }}>
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersContext;
