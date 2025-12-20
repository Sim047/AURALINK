import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";

const API = import.meta.env.VITE_API_URL || "";

export default function FollowingList({
  token,
  currentUserId,
  onShowProfile,
  onOpenConversation,
}: any) {
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [listMode, setListMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (!token || !currentUserId) return;
    axios
      .get(`${API}/api/users/${currentUserId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => setFollowing(res.data.following || []))
      .finally(() => setLoading(false));
  }, [token, currentUserId]);

  function avatarUrl(u: any) {
    if (!u?.avatar) return "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff";
    if (u.avatar.startsWith("http")) return u.avatar;
    if (u.avatar.startsWith("/")) return API + u.avatar;
    return API + "/uploads/" + u.avatar;
  }

  async function toggleFollow(u: any) {
    const route = u.isFollowed ? "unfollow" : "follow";

    await axios.post(
      `${API}/api/users/${u._id}/${route}`,
      {},
      { headers: { Authorization: "Bearer " + token } }
    );

    setFollowing((prev) =>
      prev.map((x) =>
        x._id === u._id ? { ...x, isFollowed: !u.isFollowed } : x
      )
    );
  }

  return (
    <div className="p-6 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>Following</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100">{following.length}</span>
        </h2>
        
        <select
          value={listMode}
          onChange={(e) => setListMode(e.target.value as any)}
          className="px-4 py-2 rounded-md border bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="grid">Grid</option>
          <option value="list">List</option>
        </select>
      </div>

      {loading ? (
        <div className="text-slate-600 dark:text-slate-400">Loading…</div>
      ) : following.length === 0 ? (
        <div className="text-slate-600 dark:text-slate-400 text-center py-12">
          <div className="text-4xl mb-3">➕</div>
          <div>Not following anyone yet.</div>
        </div>
      ) : listMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {following.map((u) => (
            <UserCard
              key={u._id}
              user={u}
              mode="grid"
              isFollowingPage={true}
              onShowProfile={onShowProfile}
              onOpenConversation={onOpenConversation}
              onToggleFollow={toggleFollow}
              avatarUrl={avatarUrl}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {following.map((u) => (
            <UserCard
              key={u._id}
              user={u}
              mode="list"
              isFollowingPage={true}
              onShowProfile={onShowProfile}
              onOpenConversation={onOpenConversation}
              onToggleFollow={toggleFollow}
              avatarUrl={avatarUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
