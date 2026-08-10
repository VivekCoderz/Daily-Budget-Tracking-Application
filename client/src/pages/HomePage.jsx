import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Zap, TrendingUp, DollarSign, Award, ShieldCheck, ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      
      <section className="hero">
        <div className="badge">
          <Zap size={14} /> Quick & Effortless Daily Budgeting
        </div>

        <h1 className="hero-title">
          Stop logging every penny.<br />
          Just enter your <span className="gradient-text">Today's Total Spend.</span>
        </h1>

        <p className="hero-subtitle">
          Saving every individual ₹20 tea or food receipt takes too much time. SpendWise gives you average daily spending, highest spend day, and total balance instantly.
        </p>

        <div className="hero-cta">
          <Link to="/signup" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            Start Tracking Free <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            Sign In
          </Link>
        </div>

        <div className="feature-grid">
          <div className="glass-card feature-card">
            <div className="feature-icon">
              <Zap />
            </div>
            <h3>1-Click Daily Entry</h3>
            <p>Don't waste time typing 10 micro-expenses. Enter today's combined spending in 5 seconds.</p>
          </div>

          <div className="glass-card feature-card">
            <div className="feature-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <TrendingUp />
            </div>
            <h3>Daily Average & Peak Days</h3>
            <p>Automatically calculates average money spent per day and highlights your highest spending day.</p>
          </div>

          <div className="glass-card feature-card">
            <div className="feature-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
              <DollarSign />
            </div>
            <h3>Salary & Deposit Credits</h3>
            <p>Log your salary or incoming money deposits to keep an accurate live balance calculation.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
