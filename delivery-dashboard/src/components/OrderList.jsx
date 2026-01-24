import React from 'react';
import { Package, Clock, MapPin, User, CheckCircle, XCircle, Truck, ShoppingBag } from 'lucide-react';

const OrderList = ({ orders, onOrderSelect, selectedOrderId }) => {
  const getStatusColor = (status) => {
    const colors = {
      PLACED: 'bg-blue-100 text-blue-700 border-blue-200',
      ACCEPTED: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      PICKED_UP: 'bg-purple-100 text-purple-700 border-purple-200',
      DELIVERED: 'bg-green-100 text-green-700 border-green-200',
      CANCELLED: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PLACED':
        return <ShoppingBag className="w-4 h-4" />;
      case 'ACCEPTED':
        return <CheckCircle className="w-4 h-4" />;
      case 'PICKED_UP':
        return <Truck className="w-4 h-4" />;
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Order History</h3>
        <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {orders.length} orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No orders yet</p>
          <p className="text-xs mt-1">Place an order to see it here</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => onOrderSelect && onOrderSelect(order)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                selectedOrderId === order.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">#{order.orderNumber.slice(0, 8)}</p>
                    <p className="text-xs text-slate-500">Order ID: {order.id}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Vendor #{order.vendorId}</span>
                </div>
                {order.assignedRiderId && (
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <User className="w-3.5 h-3.5" />
                    <span>Rider #{order.assignedRiderId} Assigned</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-bold text-green-600">${order.totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
