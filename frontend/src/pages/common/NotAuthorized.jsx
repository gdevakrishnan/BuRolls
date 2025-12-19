import React from 'react';

export default function NotAuthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">403 — Not Authorized</h1>
        <p className="mt-4 text-gray-600">You don’t have permission to access this page.</p>
      </div>
    </div>
  );
}
