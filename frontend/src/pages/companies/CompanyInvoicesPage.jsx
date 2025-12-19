import React, { useEffect, useState, useContext } from 'react';
import { getCompanyInvoices, acceptInvoice, payInvoice } from '../../serviceWorkers/companyServices';
import AppContext from '../../context/AppContext';
import { downloadInvoicePdf } from '../../utils/invoicePdfUtil';

export default function CompanyInvoicesPage() {
  const { user } = useContext(AppContext);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.company) load();
  }, [user]);

  const load = async () => {
    setLoading(true);
    try {
      const companyId = user.company?._id || user.company;
      const res = await getCompanyInvoices(companyId);
      setInvoices(res.invoices || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const accept = async (id) => {
    const companyId = user.company?._id || user.company;
    const res = await acceptInvoice(companyId, id);
    if (res?.invoice) {
      alert('Accepted');
      load();
    } else alert('Failed');
  };

  const companyId = user.company?._id || user.company;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Company Invoices</h1>

      {loading && <p>Loading...</p>}

      <div className="space-y-3">
        {invoices.map((inv, index) => {
          const myStatus = inv.perCompanyStatus?.find(
            p => String(p.company) === String(companyId)
          );

          return (
            <div key={inv._id} className="border p-3 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">
                    Invoice #{inv.number} - {inv.type}
                  </div>
                  <div className="text-sm text-gray-500">Status: {inv.status}</div>
                  <div className="text-sm text-gray-500">Amount: {inv.totalAmount}</div>
                  <div className="text-sm text-gray-500">
                    Your share: {myStatus?.companyShareAmount || 0}
                  </div>
                </div>

                {/* DOWNLOAD PDF */}
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  onClick={() => downloadInvoicePdf(invoices[index], companyId)}
                >
                  Download PDF
                </button>
              </div>

              <div className="flex gap-2 mt-2">
                {myStatus?.status === 'PENDING' && (
                  <button
                    className="px-2 py-1 bg-emerald-600 text-white rounded"
                    onClick={() => accept(inv._id)}
                  >
                    Accept
                  </button>
                )}

                {myStatus?.status === 'PAID' && (
                  <div className="px-2 py-1 text-sm text-green-700">Paid</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
