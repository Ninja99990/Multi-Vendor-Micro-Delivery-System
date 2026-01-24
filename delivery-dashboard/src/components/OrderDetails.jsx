import React from 'react';
import { X, Package, MapPin, User, Clock, DollarSign, Truck, CheckCircle, Navigation } from 'lucide-react';
import { calculateDistance, calculateETA, formatDistance, formatETA } from '../utils/distance';

const OrderDetails = ({ order, onClose, onStatusUpdate, riders = [] }) => {
  if (!order) return null;

  // Calculate distance and ETA if rider is assigned
  let distance = null;
  let eta = null;
  if (order.assignedRiderId && riders.length > 0 && order.vendorLat && order.vendorLng) {
    const rider = riders.find(r => r.id === order.assignedRiderId);
    if (rider) {
      distance = calculateDistance(
        order.vendorLat,
        order.vendorLng,
        rider.lat,
        rider.lng
      );
      eta = calculateETA(distance);
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      PLACED: 'bg-blue-500',
      ACCEPTED: 'bg-yellow-500',
      PICKED_UP: 'bg-purple-500',
      DELIVERED: 'bg-green-500',
      CANCELLED: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusSteps = [
    { key: 'PLACED', label: 'Order Placed', icon: Package },
    { key: 'ACCEPTED', label: 'Rider Assigned', icon: CheckCircle },
    { key: 'PICKED_UP', label: 'Picked Up', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
  ];

  const currentStatusIndex = statusSteps.findIndex(s => s.key === order.status);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-3xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Order Details</h2>
            <p className="text-blue-100 text-sm mt-1">#{order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Timeline */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Order Status
            </h3>
            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div key={step.key} className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted 
                        ? `${getStatusColor(step.key)} text-white shadow-lg` 
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      <StepIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-slate-500 mt-1">Current status</p>
                      )}
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div className={`w-0.5 h-8 ml-6 ${
                        isCompleted ? getStatusColor(step.key) : 'bg-slate-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <User className="w-4 h-4" />
                <span className="text-xs font-medium">Customer ID</span>
              </div>
              <p className="font-bold text-slate-900">#{order.customerId}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-medium">Vendor ID</span>
              </div>
              <p className="font-bold text-slate-900">#{order.vendorId}</p>
            </div>

            {order.assignedRiderId && (
              <div className="bg-white p-4 rounded-xl border border-green-200 bg-green-50/50 col-span-2">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <Truck className="w-4 h-4" />
                  <span className="text-xs font-medium">Assigned Rider</span>
                </div>
                <p className="font-bold text-green-700 mb-2">Rider #{order.assignedRiderId}</p>
                {distance !== null && eta !== null && (
                  <div className="mt-2 pt-2 border-t border-green-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        Distance
                      </span>
                      <span className="font-semibold text-slate-900">{formatDistance(distance)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Estimated Time</span>
                      <span className="font-semibold text-blue-600">{formatETA(eta)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium">Total Amount</span>
              </div>
              <p className="font-bold text-green-600">${order.totalAmount?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Created At</span>
                <span className="font-medium text-slate-900">{formatDate(order.createdAt)}</span>
              </div>
              {order.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Updated</span>
                  <span className="font-medium text-slate-900">{formatDate(order.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {onStatusUpdate && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              {order.status === 'PLACED' && (
                <button
                  onClick={() => onStatusUpdate(order.id, 'ACCEPTED')}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Mark as Accepted
                </button>
              )}
              {order.status === 'ACCEPTED' && (
                <button
                  onClick={() => onStatusUpdate(order.id, 'PICKED_UP')}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Mark as Picked Up
                </button>
              )}
              {order.status === 'PICKED_UP' && (
                <button
                  onClick={() => onStatusUpdate(order.id, 'DELIVERED')}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
