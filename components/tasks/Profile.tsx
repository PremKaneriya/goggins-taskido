'use client';

import React, { useState, useEffect } from 'react';
import { UserIcon, Mail, Edit, Save, X, LogOut } from 'lucide-react';
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
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data.user);
      setEditedProfile({
        full_name: data.user.full_name || '',
        email: data.user.email,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
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
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/login');
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-b-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-400">No profile data found.</p>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-800">
      <Sidebar />
      <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
        <div className="max-w-5xl mx-auto space-y-6">
  
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white text-sm px-3 py-2 rounded hover:bg-red-600"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
  
          {/* Profile + Account Info in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  
            {/* Profile Card */}
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <UserIcon className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{profile.full_name || 'No Name'}</h2>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
              </div>
  
              {/* Editable fields */}
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  {editing ? (
                    <input
                      name="full_name"
                      type="text"
                      value={editedProfile.full_name || ''}
                      onChange={handleChange}
                      className="px-3 py-2 border rounded-md text-sm w-full"
                    />
                  ) : (
                    <p className="text-gray-800 text-sm">{profile.full_name || '-'}</p>
                  )}
                </div>
  
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  {editing ? (
                    <input
                      name="email"
                      type="email"
                      value={editedProfile.email || ''}
                      onChange={handleChange}
                      className="px-3 py-2 border rounded-md text-sm w-full"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-gray-400" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                </div>
              </div>
  
              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                {editing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
                    >
                      <Save size={14} /> Save
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-1 bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300"
                    >
                      <X size={14} /> Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-4 py-2 rounded text-sm hover:bg-indigo-200"
                  >
                    <Edit size={14} /> Edit
                  </button>
                )}
              </div>
            </div>
  
            {/* Account Info Card */}
            <div className="bg-white shadow rounded-lg p-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Info</h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>User ID:</span> <span>#{profile.id}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Member Since:</span> <span>{formatDate(profile.created_at)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Last Login:</span>
                <span>{profile.last_login ? formatDate(profile.last_login) : 'Never'}</span>
              </div>
            </div>
  
          </div>
        </div>
      </main>
    </div>
  );
  
}
