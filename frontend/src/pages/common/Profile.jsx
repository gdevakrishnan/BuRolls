import React, { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import { changePassword } from '../../serviceWorkers/authServices';

export default function Profile(){
  const { user } = useContext(AppContext);
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });

  const handleChange = async () => {
    const res = await changePassword(form);
    if (res?.status === 200) alert('Password changed');
    else alert(res.message || 'Failed');
    setForm({ oldPassword: '', newPassword: '' });
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="border p-4 rounded max-w-md">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <hr className="my-4" />
        <h3 className="font-semibold mb-2">Change Password</h3>
        <input className="w-full mb-2 p-2 border" placeholder="Current password" type="password" value={form.oldPassword} onChange={(e)=>setForm({...form, oldPassword: e.target.value})} />
        <input className="w-full mb-2 p-2 border" placeholder="New password" type="password" value={form.newPassword} onChange={(e)=>setForm({...form, newPassword: e.target.value})} />
        <button className="bg-emerald-600 text-white px-3 py-1 rounded" onClick={handleChange}>Change Password</button>
      </div>
    </div>
  );
}