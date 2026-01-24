import React, { useState, useEffect } from 'react';
import { ShoppingBag, Navigation, CheckCircle, AlertCircle, MapPin, Users, Activity, Zap, Package } from 'lucide-react';
import MapView from './components/MapView';
import OrderList from './components/OrderList';
import OrderDetails from './components/OrderDetails';
import { placeOrder, getRiderLocations, getAllOrders, updateOrderStatus } from './api/orderApi';
import { showToast } from './utils/toast';

function App() {
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [riders, setRiders] = useState([]);
  const [meshActivity, setMeshActivity] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  // Mock Data (In a real app, this comes from your Catalog Service)
  const vendorLocation = [39.1031, -84.5120]; // Cincinnati, OH

  // Fetch rider locations on component mount and set up polling
  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const riderData = await getRiderLocations();
        const formattedRiders = riderData.map(r => ({
          id: r.riderId,
          lat: r.lat,
          lng: r.lng
        }));
        setRiders(formattedRiders);
        setLastUpdate(new Date());
        setMeshActivity(prev => [
          ...prev.slice(-4), // Keep last 5 messages
          `> ${formattedRiders.length} active rider(s) found at ${new Date().toLocaleTimeString()}`
        ]);
      } catch (err) {
        console.error('Failed to fetch rider locations:', err);
        setMeshActivity(prev => [
          ...prev.slice(-4),
          `> Error fetching riders: ${err.message}`
        ]);
        showToast(`Failed to fetch riders: ${err.message}`, 'error');
      }
    };

    // Fetch immediately
    fetchRiders();
    
    // Poll every 3 seconds for live updates
    const interval = setInterval(fetchRiders, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch orders on component mount and set up polling
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderData = await getAllOrders();
        // Sort by created date (newest first)
        const sortedOrders = orderData.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        showToast(`Failed to fetch orders: ${err.message}`, 'error');
      }
    };

    // Fetch immediately
    fetchOrders();
    
    // Poll every 5 seconds for order updates
    const interval = setInterval(fetchOrders, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const data = await placeOrder({
        customerId: 1,
        vendorId: 55,
        totalAmount: 450.00,
        vendorLat: vendorLocation[0],
        vendorLng: vendorLocation[1]
      });
      setOrderStatus({ type: 'success', msg: `Order ${data.orderNumber} Placed!` });
      showToast(`Order ${data.orderNumber} placed successfully!`, 'success');
      // Refresh orders list
      const updatedOrders = await getAllOrders();
      setOrders(updatedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error('Order placement error:', err);
      let errorMsg = 'Failed to place order';
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          errorMsg = 'Authentication failed. Please check your credentials.';
        } else if (err.response.status === 500) {
          errorMsg = 'Server error. Please check if order service is running.';
        } else if (err.response.status >= 400) {
          errorMsg = `Error: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMsg = 'Failed to connect to Gateway. Is the API Gateway running?';
      } else {
        // Something else happened
        errorMsg = err.message || 'An unexpected error occurred';
      }
      
      setOrderStatus({ type: 'error', msg: errorMsg });
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
      
      // Refresh orders
      const updatedOrders = await getAllOrders();
      setOrders(updatedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      
      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder.id === orderId) {
        const updated = updatedOrders.find(o => o.id === orderId);
        if (updated) setSelectedOrder(updated);
      }
    } catch (err) {
      showToast(`Failed to update order status: ${err.message}`, 'error');
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans text-slate-900 flex flex-col overflow-hidden">
      {/* Enhanced Navbar */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              Multi Vendor Micro Delivery
            </h1>
            <p className="text-xs text-slate-500">Real-time delivery mesh network</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full shadow-sm border border-green-200/50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> 
            <span>Gateway Online</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-full">
            <Activity className="w-3 h-3" />
            <span>{riders.length} Active Riders</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-blue-600">{riders.length}</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">Active Riders</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">Vendor Location</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-purple-600">{orders.length}</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">Total Orders</p>
            </div>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-2 h-[600px] bg-white rounded-3xl shadow-2xl shadow-slate-300/50 border border-slate-200/50 overflow-hidden relative">
            <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-slate-200/50">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-700 font-medium">Vendor</span>
                </div>
                <div className="w-px h-4 bg-slate-300"></div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-slate-700 font-medium">Riders</span>
                </div>
              </div>
            </div>
            <MapView vendorLoc={vendorLocation} riders={riders} />
          </div>

          {/* Control Panel */}
          <div className="flex flex-col gap-6">
            {/* Order Card */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">New Delivery Order</h2>
                  <p className="text-xs text-slate-500">Place order and find nearby riders</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6 p-4 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Vendor ID
                  </span>
                  <span className="font-mono font-bold text-blue-600 bg-white px-3 py-1 rounded-lg">#V-055</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Location
                  </span>
                  <span className="font-semibold text-slate-900">Cincinnati, OH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Amount</span>
                  <span className="font-bold text-green-600">$450.00</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg ${
                  loading 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/50'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    Place Order & Find Riders
                  </span>
                )}
              </button>
            </div>

            {/* Status Notifications */}
            {orderStatus && (
              <div className={`p-4 rounded-2xl border-2 backdrop-blur-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-4 shadow-lg ${
                orderStatus.type === 'success' 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800' 
                  : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800'
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  orderStatus.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {orderStatus.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                <p className="text-sm font-semibold flex-1">{orderStatus.msg}</p>
              </div>
            )}

            {/* Live Activity Monitor */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Live Mesh Activity</h3>
                </div>
                <Activity className="w-4 h-4 text-slate-400 animate-pulse" />
              </div>
              <div className="space-y-2 font-mono text-xs max-h-64 overflow-y-auto custom-scrollbar">
                <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                  <span className="text-green-400">{">"}</span>
                  <span className="text-green-300">Order Service initialized...</span>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                  <span className="text-blue-400">{">"}</span>
                  <span className="text-blue-300">Kafka broker connected...</span>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                  <span className="text-purple-400">{">"}</span>
                  <span className="text-purple-300">Geofence consumer active...</span>
                </div>
                {meshActivity.map((msg, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors animate-fade-in">
                    <span className="text-yellow-400">{">"}</span>
                    <span className="text-yellow-300">{msg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/50 shadow-xl">
              <OrderList 
                orders={orders} 
                onOrderSelect={handleOrderSelect}
                selectedOrderId={selectedOrder?.id}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4 min-w-[300px]">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-semibold text-slate-900">Placing Order...</p>
            <p className="text-sm text-slate-600 text-center">Please wait while we process your order</p>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && (
        <OrderDetails
          order={selectedOrder}
          riders={riders}
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

export default App;