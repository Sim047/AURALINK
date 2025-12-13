import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Calendar, Clock, MapPin, RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react";

dayjs.extend(relativeTime);

const API = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";

interface Booking {
  _id: string;
  client: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  provider: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  bookingType: string;
  event?: {
    _id: string;
    title: string;
  };
  service?: {
    _id: string;
    name: string;
  };
  status: string;
  approvalStatus: string;
  paymentVerified: boolean;
  scheduledDate: string;
  scheduledTime: string;
  location?: string;
  pricing: {
    amount: number;
    currency: string;
    transactionCode?: string;
    transactionDetails?: string;
  };
  clientNotes?: string;
  rejectionReason?: string;
  createdAt: string;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get<{ bookings: Booking[] }>(`${API}/api/bookings?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter to only show bookings where current user is the client
      const myBookings = data.bookings.filter(b => b.client && typeof b.client === 'object');
      setBookings(myBookings);
    } catch (err: any) {
      console.error("Load bookings error:", err);
      setError(err.response?.data?.error || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(booking: Booking) {
    if (booking.approvalStatus === "rejected") {
      return (
        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
          <XCircle className="w-4 h-4" />
          <span className="font-medium">Rejected</span>
        </div>
      );
    }
    
    if (booking.approvalStatus === "pending") {
      return (
        <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
          <AlertCircle className="w-4 h-4" />
          <span className="font-medium">Pending Approval</span>
        </div>
      );
    }
    
    if (booking.approvalStatus === "approved") {
      if (booking.pricing.amount === 0) {
        return (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Confirmed</span>
          </div>
        );
      }
      
      if (booking.paymentVerified) {
        return (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Confirmed & Paid</span>
          </div>
        );
      }
      
      return (
        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
          <AlertCircle className="w-4 h-4" />
          <span className="font-medium">Awaiting Payment Verification</span>
        </div>
      );
    }
    
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
            My Bookings
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={loadBookings}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No bookings yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Book an event or service to see it here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {booking.event?.title || booking.service?.name || "Booking"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Provider: {booking.provider.username}
                  </p>
                </div>
                {getStatusBadge(booking)}
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {dayjs(booking.scheduledDate).format("MMM D, YYYY")}
                </span>
                {booking.scheduledTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {booking.scheduledTime}
                  </span>
                )}
                {booking.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {booking.location}
                  </span>
                )}
                <span className="font-medium text-teal-600 dark:text-teal-400">
                  ${booking.pricing.amount} {booking.pricing.currency}
                </span>
              </div>

              {booking.pricing.transactionCode && booking.pricing.transactionCode !== "FREE_EVENT" && (
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Transaction Code:</p>
                  <p className="text-sm font-mono text-teal-600 dark:text-teal-400">{booking.pricing.transactionCode}</p>
                </div>
              )}

              {booking.rejectionReason && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-600 dark:text-red-400">{booking.rejectionReason}</p>
                </div>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Booked {dayjs(booking.createdAt).fromNow()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
