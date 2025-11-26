"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  disabilityType?: string;
  skills?: string[];
  experience?: string;
  location?: string;
  phone?: string;
  bio?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    disabilityType: '',
    skills: '',
    experience: '',
    location: '',
    phone: '',
    bio: ''
  });
  const [updateMsg, setUpdateMsg] = useState('');
  const [loading, setLoading] = useState(true); // start with loading

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    console.log('[Profile] token present?', Boolean(token));
    if (!token) {
      console.warn('[Profile] No token found, redirecting to /login');
      logout();
      return;
    }

    console.log('[Profile] Fetching profile...');
    fetch('http://127.0.0.1:5000/api/auth/profile', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          console.error('[Profile] Non-OK response', res.status, res.statusText);
          try {
            const data = await res.json();
            setError(data?.message || `Failed to load profile (${res.status})`);
            return null;
          } catch {
            setError(`Failed to load profile (${res.status})`);
            return null;
          }
        }
        const data = await res.json();
        return data;
      })
      .then(data => {
        if (!data) return; // already redirected
        if (data.status === 'success') {
          console.log('[Profile] Profile loaded');
          setUser(data.data as User);
          setForm({
            name: data.data.name || '',
            email: data.data.email || '',
            disabilityType: data.data.disabilityType || '',
            skills: data.data.skills ? data.data.skills.join(', ') : '',
            experience: data.data.experience || '',
            location: data.data.location || '',
            phone: data.data.phone || '',
            bio: data.data.bio || ''
          });
        } else {
          console.error('[Profile] API error', data);
          setError(data.message || 'Failed to load profile');
        }
      })
      .catch((err) => {
        console.error('[Profile] Network error', err);
        setError('Network error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateMsg('');
    setLoading(true);

    const token = localStorage.getItem('token');
    const skillsArray = form.skills.split(',').map(s => s.trim()).filter(s => s);

    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          disabilityType: form.disabilityType,
          skills: skillsArray,
          experience: form.experience,
          location: form.location,
          phone: form.phone,
          bio: form.bio
        })
      });
      if (!res.ok) {
        console.error('[Profile] Update non-OK', res.status, res.statusText);
        if (res.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        try {
          const errData = await res.json();
          setUpdateMsg(errData?.message || `Update failed (${res.status})`);
        } catch {
          setUpdateMsg(`Update failed (${res.status})`);
        }
        return;
      }
      const data = await res.json();
      if (data.status === 'success') {
        setUser(u => u ? {
          ...u,
          name: form.name,
          email: form.email,
          disabilityType: form.disabilityType,
          skills: skillsArray,
          experience: form.experience,
          location: form.location,
          phone: form.phone,
          bio: form.bio
        } : null);
        setUpdateMsg('Profile updated successfully!');
        setEditMode(false);
      } else {
        setUpdateMsg(data.message || 'Update failed');
      }
    } catch (err) {
      setUpdateMsg('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 relative">
      {/* Always show logout button */}
      <div className="absolute top-4 right-4">
        <Button variant="outline" onClick={logout}>Logout</Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading your profile...</p>
          </div>
        ) : error ? (
          <Card className="p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
          </Card>
        ) : user && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card className="p-6 text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <Badge variant="secondary" className="mt-2">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Badge>
                {!editMode && (
                  <Button className="mt-4 w-full" onClick={() => setEditMode(true)}>Edit Profile</Button>
                )}
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                {editMode ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                      </div>
                    </div>

                    {/* Phone and Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                      </div>
                    </div>

                    {/* Disability Type */}
                    <div>
                      <Label htmlFor="disabilityType">Disability Type</Label>
                      <Input id="disabilityType" value={form.disabilityType} onChange={e => setForm(f => ({ ...f, disabilityType: e.target.value }))} />
                    </div>

                    {/* Skills */}
                    <div>
                      <Label htmlFor="skills">Skills</Label>
                      <Input id="skills" value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} />
                    </div>

                    {/* Experience and Bio */}
                    <div>
                      <Label htmlFor="experience">Experience</Label>
                      <Input id="experience" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <textarea id="bio" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className="w-full px-3 py-2 border rounded-md" rows={4} />
                    </div>

                    {updateMsg && <div className={`p-3 rounded-md ${updateMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{updateMsg}</div>}

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1">{loading ? 'Saving...' : 'Save Changes'}</Button>
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setEditMode(false)}>Cancel</Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Profile Information</h3>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
                    {user.location && <p><strong>Location:</strong> {user.location}</p>}
                    {user.disabilityType && <p><strong>Disability Type:</strong> {user.disabilityType}</p>}
                    {user.experience && <p><strong>Experience:</strong> {user.experience}</p>}
                    {user.skills && user.skills.length > 0 && <p><strong>Skills:</strong> {user.skills.join(', ')}</p>}
                    {user.bio && <p><strong>About Me:</strong> {user.bio}</p>}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
