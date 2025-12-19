import React, { useEffect, useState } from 'react';
import { getInvoices } from '../../serviceWorkers/adminServices';

export default function SuperAdminInvoicesPage(){
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ load(); }, []);
  const load = async ()=>{
    setLoading(true);
    try{ const res = await getInvoices(); setInvoices(res.invoices || []); }catch(e){ console.error(e); }
    setLoading(false);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      {loading && <p>Loading...</p>}
      <div className="space-y-3">
        {invoices.map(inv => (
          <div key={inv._id} className="border p-3 rounded">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">Invoice #{inv.number} - {inv.type}</div>
                <div className="text-sm text-gray-500">Status: {inv.status}</div>
                <div className="text-sm text-gray-500">Manager: {inv.manager?.name}</div>
              </div>
              <div>
                <a className="text-sm text-blue-600" href={`/admin/invoices/${inv._id}`}>View</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}