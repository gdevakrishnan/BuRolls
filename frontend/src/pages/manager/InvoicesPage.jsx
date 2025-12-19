import React, { useEffect, useState } from 'react';
import { getManagerInvoices } from '../../serviceWorkers/managerServices';
import { Link } from 'react-router-dom';

export default function ManagerInvoicesPage(){
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ load(); }, []);
  const load = async ()=>{
    setLoading(true);
    try{ const res = await getManagerInvoices(); setInvoices(res.invoices || []); }catch(e){ console.error(e); }
    setLoading(false);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Invoices</h1>
        <Link className="text-sm text-blue-600" to={"/manager/invoices/create"}>Create Invoice</Link>
      </div>
      {loading && <p>Loading...</p>}
      <div className="space-y-3">
        {invoices.map(inv => (
          <div key={inv._id} className="border p-3 rounded">
            <div className="font-semibold">Invoice #{inv.number} - {inv.type}</div>
            <div className="text-sm text-gray-500">Status: {inv.status}</div>
            <div className="text-sm text-gray-500">Total Amount: {inv.totalAmount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}