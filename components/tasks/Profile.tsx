'use client';

import React, { useState, useEffect } from 'react';
import { UserIcon, Mail, Calendar, Edit, Save, X, LogOut } from 'lucide-react';
import Sidebar from './SideBar';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: number;
  email: string;
  full_name: string | null;
  created_at: string;
  last_login: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile');
      if (!response.ok) throw new Error('Failed to fetch profile data');
      const data = await response.json();
      setProfile(data.user);
      setEditedProfile({
        full_name: data.user.full_name || '',
        email: data.user.email,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    setEditing(false);
    if (profile) {
      setEditedProfile({
        full_name: profile.full_name,
        email: profile.email,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProfile),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      const data = await response.json();
      setProfile(prev => prev ? { ...prev, ...data.user } : null);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main content with left margin to accommodate sidebar */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 pl-0 sm:pl-72">
        <div className="mx-auto max-w-4xl w-full">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Profile</h1>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {loading && !profile ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading profile...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8">
              <div className="text-red-500 mb-4 sm:mb-6 text-center text-sm sm:text-base">Error: {error}</div>
              <button
                onClick={fetchProfile}
                className="w-full py-2 sm:py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all text-sm sm:text-base"
              >
                Retry
              </button>
            </div>
          ) : profile ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 sm:p-6 md:p-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <UserIcon size={32} className="sm:size-40 md:size-48" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold">{profile.full_name || 'User'}</h2>
                      <p className="text-white/80 text-xs sm:text-sm break-all">{profile.email}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm">
                        <Calendar size={14} className="sm:size-16" />
                        <span>Member since {formatDate(profile.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3 sm:self-start">
                    {!editing ? (
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-xs sm:text-sm"
                      >
                        <Edit size={14} className="sm:size-16" />
                        <span className="hidden xs:inline">Edit</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-all text-xs sm:text-sm"
                          disabled={loading}
                        >
                          <Save size={14} className="sm:size-16" />
                          <span className="hidden xs:inline">Save</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-xs sm:text-sm"
                        >
                          <X size={14} className="sm:size-16" />
                          <span className="hidden xs:inline">Cancel</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Personal Information</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <label className="text-xs sm:text-sm font-medium text-gray-500 sm:w-24 md:w-32 shrink-0">Full Name</label>
                      {editing ? (
                        <input
                          type="text"
                          name="full_name"
                          value={editedProfile.full_name || ''}
                          onChange={handleChange}
                          className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <p className="flex-1 text-gray-800 text-sm sm:text-base">{profile.full_name || '-'}</p>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <label className="text-xs sm:text-sm font-medium text-gray-500 sm:w-24 md:w-32 shrink-0">Email</label>
                      {editing ? (
                        <input
                          type="email"
                          name="email"
                          value={editedProfile.email || ''}
                          onChange={handleChange}
                          className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Enter your email"
                        />
                      ) : (
                        <div className="flex-1 flex items-center gap-2">
                          <Mail size={14} className="sm:size-16 text-gray-400" />
                          <p className="text-gray-800 text-sm sm:text-base break-all">{profile.email}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <label className="text-xs sm:text-sm font-medium text-gray-500 sm:w-24 md:w-32 shrink-0">User ID</label>
                      <p className="flex-1 text-gray-800 text-sm sm:text-base">#{profile.id}</p>
                      <span className="text-xs sm:text-sm text-gray-400 sm:ml-auto">Read-only</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Account Information</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <label className="text-xs sm:text-sm font-medium text-gray-500 sm:w-24 md:w-32 shrink-0">Member Since</label>
                      <p className="flex-1 text-gray-800 text-sm sm:text-base">{formatDate(profile.created_at)}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <label className="text-xs sm:text-sm font-medium text-gray-500 sm:w-24 md:w-32 shrink-0">Last Login</label>
                      <p className="flex-1 text-gray-800 text-sm sm:text-base">
                        {profile.last_login ? formatDate(profile.last_login) : 'Never logged in'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Logout Button - Only visible on small screens */}
                <div className="pt-4 mt-8 border-t border-gray-100 sm:hidden">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 text-center">
              <p className="text-gray-600 text-sm sm:text-base">No profile data available. Please log in again.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}