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
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />
  
      <main className="flex-1 p-4 sm:p-6 md:p-8 pl-0 sm:pl-72">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
  
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow">
              <div className="w-10 h-10 border-4 border-indigo-500 border-b-transparent rounded-full animate-spin" />
              <p className="mt-4 text-gray-500">Loading profile...</p>
            </div>
          ) : error ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-red-500 mb-4">Error: {error}</p>
              <button
                onClick={fetchProfile}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          ) : profile ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center">
                    <UserIcon size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{profile.full_name || 'User'}</h2>
                    <p className="text-sm opacity-80">{profile.email}</p>
                    <p className="text-xs mt-1 opacity-70">
                      Member since {formatDate(profile.created_at)}
                    </p>
                  </div>
                  <div className="sm:ml-auto flex gap-2">
                    {!editing ? (
                      <button
                        onClick={handleEdit}
                        className="text-sm bg-white/20 px-3 py-1.5 rounded hover:bg-white/30"
                      >
                        <Edit size={14} className="inline mr-1" /> Edit
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSave}
                          className="text-sm bg-white text-indigo-700 px-3 py-1.5 rounded hover:bg-gray-100"
                          disabled={loading}
                        >
                          <Save size={14} className="inline mr-1" /> Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-sm bg-white/20 px-3 py-1.5 rounded hover:bg-white/30"
                        >
                          <X size={14} className="inline mr-1" /> Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
  
              <div className="p-6 space-y-6">
                {/* Personal Info */}
                <section>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Personal Info</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <label className="sm:w-32 text-sm text-gray-500 font-medium">Full Name</label>
                      {editing ? (
                        <input
                          type="text"
                          name="full_name"
                          value={editedProfile.full_name || ''}
                          onChange={handleChange}
                          className="flex-1 px-3 py-2 border rounded-lg text-sm w-full sm:w-auto"
                        />
                      ) : (
                        <p className="text-sm text-gray-800">{profile.full_name || '-'}</p>
                      )}
                    </div>
  
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <label className="sm:w-32 text-sm text-gray-500 font-medium">Email</label>
                      {editing ? (
                        <input
                          type="email"
                          name="email"
                          value={editedProfile.email || ''}
                          onChange={handleChange}
                          className="flex-1 px-3 py-2 border rounded-lg text-sm w-full sm:w-auto"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          <p className="text-sm text-gray-800 break-all">{profile.email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
  
                {/* Account Info */}
                <section>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Account Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>User ID</span>
                      <span>#{profile.id}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Member Since</span>
                      <span>{formatDate(profile.created_at)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Last Login</span>
                      <span>{profile.last_login ? formatDate(profile.last_login) : 'Never logged in'}</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
              No profile data found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
  
}