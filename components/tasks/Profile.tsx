'use client';

import React, { useState, useEffect } from 'react';
import { UserIcon, Mail, Calendar, Edit, Save, X } from 'lucide-react';
import Sidebar from './SideBar';

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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile');
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      
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

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset edited values to original
    if (profile) {
      setEditedProfile({
        full_name: profile.full_name,
        email: profile.email,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProfile),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setProfile(prev => prev ? { ...prev, ...data.user } : null);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>
          
          {loading && !profile ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#db4c3f]"></div>
              </div>
              <p className="mt-4 text-gray-600">Loading your profile...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-red-500 mb-4">Error: {error}</div>
              <button 
                onClick={fetchProfile} 
                className="px-4 py-2 bg-[#db4c3f] text-white rounded hover:bg-[#c23c2e] transition"
              >
                Try Again
              </button>
            </div>
          ) : profile ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-[#db4c3f] to-[#e07a70] p-6 text-white relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-white">
                      {/* {profile.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt={profile.username} 
                          className="h-20 w-20 rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon size={40} />
                      )} */}
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold">{profile.full_name || 'User'}</h2>
                      <p className="text-white/80">{profile.email}</p>
                    </div>
                  </div>
                  
                  {!editing ? (
                    <button 
                      onClick={handleEdit}
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded flex items-center transition"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleSave}
                        className="bg-white text-[#db4c3f] px-3 py-1 rounded flex items-center transition hover:bg-white/90"
                        disabled={loading}
                      >
                        <Save size={16} className="mr-1" />
                        Save
                      </button>
                      <button 
                        onClick={handleCancel}
                        className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded flex items-center transition"
                      >
                        <X size={16} className="mr-1" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>Member since {formatDate(profile.created_at)}</span>
                </div>
              </div>
              
              {/* Profile Details */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-gray-500 text-sm mb-2">Personal Information</h3>
                  <div className="border rounded-md divide-y">
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                        {editing ? (
                          <input
                            type="text"
                            name="full_name"
                            value={editedProfile.full_name || ''}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 w-full"
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <p className="text-gray-800">{profile.full_name || '-'}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Email Address</label>
                        {editing ? (
                          <input
                            type="email"
                            name="email"
                            value={editedProfile.email || ''}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 w-full"
                            placeholder="Enter your email"
                          />
                        ) : (
                          <div className="flex items-center">
                            <Mail size={16} className="text-gray-400 mr-2" />
                            <p className="text-gray-800">{profile.email}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">User ID</label>
                        <p className="text-gray-800">#{profile.id}</p>
                      </div>
                      <div className="text-sm text-gray-500">Cannot be changed</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gray-500 text-sm mb-2">Account Information</h3>
                  <div className="border rounded-md divide-y">
                    <div className="p-4">
                      <label className="block text-sm text-gray-500 mb-1">Member Since</label>
                      <p className="text-gray-800">{formatDate(profile.created_at)}</p>
                    </div>
                    
                    <div className="p-4">
                      <label className="block text-sm text-gray-500 mb-1">Last Login</label>
                      <p className="text-gray-800">{profile.last_login ? formatDate(profile.last_login) : 'Never logged in'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p>No profile data available. Please log in again.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}