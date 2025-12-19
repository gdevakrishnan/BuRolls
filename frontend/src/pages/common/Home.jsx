import React, { Fragment } from 'react';
import { CheckCircle, Users, FileText, Shield, TrendingUp, Zap } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Invoice Management",
      description: "Create and track invoices across multiple business units with ease"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-Level Approval",
      description: "Streamlined approval workflows for carry invoices with full transparency"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Role-Based Access",
      description: "Secure access control for Super Admins, BU Managers, and BU Users"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Real-Time Tracking",
      description: "Monitor invoice status and approvals in real-time"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Comprehensive reporting and insights for all user roles"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Notifications",
      description: "Stay informed with blocking and informational notifications"
    }
  ];

  const userRoles = [
    {
      title: "Super Admin",
      description: "Manage users, roles, and system-wide permissions",
      color: "bg-emerald-500"
    },
    {
      title: "BU Manager",
      description: "Approve invoices and manage company groups",
      color: "bg-emerald-600"
    },
    {
      title: "BU User",
      description: "Create and track invoices across business units",
      color: "bg-emerald-700"
    }
  ];

  return (
    <Fragment>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Welcome to BuRolls</h1>
            <p className="text-xl mb-8 text-emerald-50 max-w-3xl mx-auto">
              Multi-Business Unit Invoice Management System - Streamline your invoice workflows with powerful approval processes and role-based access control
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-white text-emerald-700 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition">
                Get Started
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-700 transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to manage invoices efficiently</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="text-emerald-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Every Role</h2>
            <p className="text-xl text-gray-600">Tailored experiences for different user types</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userRoles.map((role, index) => (
              <div key={index} className="text-center">
                <div className={`${role.color} w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center`}>
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{role.title}</h3>
                <p className="text-gray-600">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simplified Workflow</h2>
            <p className="text-xl text-gray-600">From creation to approval in simple steps</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="flex-1 bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Create Invoice</h3>
              <p className="text-gray-600">BU Users create regular or carry invoices</p>
            </div>
            
            <div className="text-emerald-600 rotate-90 md:rotate-0">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            
            <div className="flex-1 bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Review & Approve</h3>
              <p className="text-gray-600">Multi-level approval by BU Managers</p>
            </div>
            
            <div className="text-emerald-600 rotate-90 md:rotate-0">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            
            <div className="flex-1 bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Generate PDF</h3>
              <p className="text-gray-600">Automatic PDF generation after approval</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Invoice Management?</h2>
          <p className="text-xl mb-8 text-emerald-50">
            Join organizations already streamlining their invoice workflows with BuRolls
          </p>
          <button className="bg-white text-emerald-700 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-50 transition">
            Start Your Free Trial
          </button>
        </div>
      </section>
    </Fragment>
  );
};

export default Home;