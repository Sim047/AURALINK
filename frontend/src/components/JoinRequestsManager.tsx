// frontend/src/components/JoinRequestsManager.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CheckCircle, XCircle, Calendar, User, CreditCard, Clock } from "lucide-react";

dayjs.extend(relativeTime);

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface JoinRequest {
  requestId: string;
  event: {
    _id: string;
    title: string;
    startDate: string;
    pricing: any;
  };
  user: {
    _id: string;
    username: string;
    avatar?: string;
    email?: string;
  };
  transactionCode: string;
  requestedAt: string;
}

export default function JoinRequestsManager({ token }: { token: string }) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, [token]);

  async function loadRequests() {
    if (!token) return;
    
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/events/my-events-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Error loading join requests:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(eventId: string, requestId: string) {
    try {
      await axios.post(
        `${API}/api/events/${eventId}/approve-request/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Join request approved!");
      loadRequests();
    } catch (err: any) {
      console.error("Approve error:", err);
      alert(err.response?.data?.error || "Failed to approve request");
    }
  }

  async function handleReject(eventId: string, requestId: string) {
    try {
      await axios.post(
        `${API}/api/events/${eventId}/reject-request/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Join request rejected");
      loadRequests();
    } catch (err: any) {
      console.error("Reject error:", err);
      alert(err.response?.data?.error || "Failed to reject request");
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
        <p className="text-slate-400 mt-2">Loading requests...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 bg-slate-800/50 rounded-2xl border border-slate-700">
        <Clock className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <p className="text-slate-400">No pending join requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
        Pending Join Requests ({requests.length})
      </h2>

      {requests.map((req) => (
        <div
          key={req.requestId}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-cyan-500/50 transition-all"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg mb-1">{req.event.title}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span>{dayjs(req.event.startDate).format("MMM D, YYYY")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Clock className="w-4 h-4" />
                <span>Requested {dayjs(req.requestedAt).fromNow()}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 mb-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {req.user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white">{req.user.username}</p>
                {req.user.email && (
                  <p className="text-xs text-slate-400">{req.user.email}</p>
                )}
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-3 border border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-slate-300">Transaction Code:</span>
              </div>
              <p className="text-white font-mono text-sm bg-slate-900/50 px-3 py-2 rounded border border-slate-700">
                {req.transactionCode}
              </p>
            </div>

            {req.event.pricing?.amount && (
              <p className="text-sm text-slate-400 mt-2">
                Event Fee: {req.event.pricing.amount} {req.event.pricing.currency || 'USD'}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleReject(req.event._id, req.requestId)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 rounded-lg font-medium transition-all"
            >
              <XCircle className="w-5 h-5" />
              Reject
            </button>
            <button
              onClick={() => handleApprove(req.event._id, req.requestId)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg font-medium transition-all"
            >
              <CheckCircle className="w-5 h-5" />
              Approve
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
