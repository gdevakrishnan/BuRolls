import React, { useEffect, useState } from "react";
import { getOverview, getStats } from "../../serviceWorkers/adminServices";
import { Link } from "react-router-dom";

export default function SuperAdminDashboard() {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);
  const [users, setUsers] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    setLoading(true);
    getOverview()
      .then((res) => setData(res.data || res))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));

    getStats()
      .then((res) => setStats(res || res.data))
      .catch(console.error);

    // load top managers, users and invoices (limit 5)
    import("../../serviceWorkers/adminServices").then(
      ({ getManagers, getUsers, getInvoices }) => {
        getManagers({ limit: 5 })
          .then((r) => setManagers(r.managers || []))
          .catch(() => {});
        getUsers({ limit: 5 })
          .then((r) => setUsers(r.users || []))
          .catch(() => {});
        getInvoices({ limit: 5 })
          .then((r) => setInvoices(r.invoices || []))
          .catch(() => {});
      }
    );
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 border rounded text-center">
            <h3 className="text-sm text-gray-500">Business Units</h3>
            <div className="text-2xl font-bold">{stats.businessUnits}</div>
          </div>
          <div className="p-4 border rounded text-center">
            <h3 className="text-sm text-gray-500">Managers</h3>
            <div className="text-2xl font-bold">{stats.managers}</div>
          </div>
          <div className="p-4 border rounded text-center">
            <h3 className="text-sm text-gray-500">Companies</h3>
            <div className="text-2xl font-bold">{stats.companies}</div>
          </div>
          <div className="p-4 border rounded text-center">
            <h3 className="text-sm text-gray-500">Users</h3>
            <div className="text-2xl font-bold">{stats.users}</div>
          </div>
        </div>
      )}

      {loading && <p>Loading...</p>}

      {/* Business Units (top 5) */}
      {data && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Business Units</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(data.data || []).slice(0, 5).map((bu) => (
              <div key={bu._id} className="border p-4 rounded">
                <h3 className="font-semibold">{bu.name}</h3>
                <p className="text-sm text-gray-600">
                  Managers: {bu.managers?.length}
                </p>
                <p className="text-sm text-gray-600">
                  Companies: {bu.companies?.length}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-blue-600 cursor-pointer">
            <Link to={"/admin/business-units"}>View More</Link>
          </div>
        </div>
      )}

      {/* Managers (top 5) */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Managers</h2>
        <div className="space-y-2">
          {managers.map((m) => (
            <div key={m._id} className="border p-3 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-sm text-gray-500">{m.email}</div>
                  <div className="text-sm text-gray-500">
                    Status: {m.status}
                  </div>
                  <div className="text-sm text-gray-500">
                    BU: {m.businessUnits?.map((b) => b.name).join(", ")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-blue-600 cursor-pointer">
          {" "}
          <Link to={'/admin/managers'}>View More</Link>
        </div>
      </div>

      {/* Users (top 5) */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Users</h2>
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u._id} className="border p-3 rounded">
              <div className="font-semibold">
                {u.name}{" "}
                <span className="text-sm text-gray-500">({u.email})</span>
              </div>
              <div className="text-sm text-gray-500">
                BU: {u.company?.businessUnit?.name || "—"}
              </div>
              <div className="text-sm text-gray-500">
                Manager: {u.managers?.map((m) => m.name).join(", ") || "—"}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-blue-600 cursor-pointer">
          {" "}
          <Link to={'/admin/users'}>View More</Link>
        </div>
      </div>

      {/* Invoices (top 5) */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Invoices</h2>
        <div className="space-y-2">
          {invoices.map(inv => (
            <div key={inv._id} className="border p-3 rounded">
              <div className="font-semibold">Invoice #{inv.number} - {inv.type}</div>
              <div className="text-sm text-gray-500">Status: {inv.status}</div>
              <div className="text-sm text-gray-500">Manager: {inv.manager?.name}</div>
              <div className="text-sm text-gray-500 mt-2"><Link to={`/admin/invoices/${inv._id}`} className="text-blue-600">View</Link></div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-blue-600 cursor-pointer"> <Link to={'/admin/invoices'}>View More</Link></div>
      </div>
    </div>
  );
}
