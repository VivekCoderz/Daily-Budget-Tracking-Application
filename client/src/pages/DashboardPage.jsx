import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData, addEntry, deleteEntry } from '../store/slices/budgetSlice';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import EntryItem from '../components/EntryItem';
import AddEntryModal from '../components/AddEntryModal';
import {
  Wallet,
  TrendingDown,
  Flame,
  Calendar,
  Plus,
  PlusCircle,
  RefreshCw
} from 'lucide-react';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { entries, dailySummary, stats, loading, error } = useSelector((state) => state.budget);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('spend'); // 'spend' or 'income'

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleAddEntry = async (entryData) => {
    await dispatch(addEntry(entryData));
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      await dispatch(deleteEntry(id));
    }
  };

  const formatHighestDay = (highest) => {
    if (!highest || !highest.date) return 'No spends yet';
    const dateFormatted = new Date(highest.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    return `₹${Number(highest.amount).toLocaleString('en-IN')} on ${dateFormatted}`;
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p style={{ color: '#94a3b8' }}>
              Track your today's spending & keep an eye on your daily financial habits.
            </p>
          </div>

          <div className="quick-actions">
            <button
              onClick={() => handleOpenModal('spend')}
              className="btn btn-spend"
              style={{ padding: '0.85rem 1.4rem' }}
            >
              <Plus size={18} /> Today's Spend
            </button>
            <button
              onClick={() => handleOpenModal('income')}
              className="btn btn-income"
              style={{ padding: '0.85rem 1.4rem' }}
            >
              <PlusCircle size={18} /> Add Salary / Deposit
            </button>
          </div>
        </div>

        {error && (
          <div className="error-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{error}</span>
            <button className="btn btn-secondary" onClick={() => dispatch(fetchDashboardData())} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Analytics Stats Grid */}
        <div className="stats-grid">
          <StatsCard
            title="Current Balance"
            value={`₹${stats.currentBalance.toLocaleString('en-IN')}`}
            subtext={`Income: ₹${stats.totalIncome.toLocaleString('en-IN')} | Spend: ₹${stats.totalSpend.toLocaleString('en-IN')}`}
            icon={Wallet}
            iconBg="rgba(99, 102, 241, 0.15)"
            iconColor="#818cf8"
          />

          <StatsCard
            title="Daily Average Spend"
            value={`₹${stats.averageDailySpend.toLocaleString('en-IN')}`}
            subtext="Calculated across active spend days"
            icon={TrendingDown}
            iconBg="rgba(244, 63, 94, 0.15)"
            iconColor="#f43f5e"
          />

          <StatsCard
            title="Highest Spend Day"
            value={stats.highestSpendDay ? `₹${stats.highestSpendDay.amount.toLocaleString('en-IN')}` : '₹0'}
            subtext={formatHighestDay(stats.highestSpendDay)}
            icon={Flame}
            iconBg="rgba(245, 158, 11, 0.15)"
            iconColor="#f59e0b"
          />

          <StatsCard
            title="Days Tracked"
            value={`${stats.totalSpendDays} Days`}
            subtext="Unique days with logged expenses"
            icon={Calendar}
            iconBg="rgba(16, 185, 129, 0.15)"
            iconColor="#10b981"
          />
        </div>

        {/* Day-by-Day Spending Summary Section (Horizontal Scroll Carousel) */}
        <div className="glass-card section-card" style={{ marginBottom: '2.5rem' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">📅 Daily Spending Summary (Roj Ka Kharcha)</h2>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                Swipe left / right to see day-by-day spending cards
              </p>
            </div>
          </div>

          {loading && dailySummary.length === 0 ? (
            <div style={{ textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>
              Loading summary...
            </div>
          ) : dailySummary.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
              <p style={{ fontSize: '0.95rem', color: '#94a3b8' }}>No daily spending history yet.</p>
            </div>
          ) : (
            <div className="daily-scroll-container">
              {dailySummary.map((item) => {
                const isHighest = stats.highestSpendDay && stats.highestSpendDay.date === item.date;
                const formattedDate = new Date(item.rawDate || item.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });

                return (
                  <div
                    key={item.date}
                    className={`daily-card-item ${isHighest ? 'is-highest' : ''}`}
                  >
                    {isHighest && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '12px',
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: '#f59e0b',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-full)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}
                      >
                        <Flame size={12} /> Highest Day
                      </span>
                    )}

                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                      {formattedDate}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Spent</div>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: item.totalSpend > 0 ? 'var(--spend-color)' : '#94a3b8' }}>
                          ₹{item.totalSpend.toLocaleString('en-IN')}
                        </div>
                      </div>

                      {item.totalIncome > 0 && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Credited</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--income-color)' }}>
                            +₹{item.totalIncome.toLocaleString('en-IN')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Entry History List */}
        <div className="glass-card section-card">
          <div className="section-header">
            <h2 className="section-title">All Individual Transactions</h2>
            <button
              onClick={() => dispatch(fetchDashboardData())}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {loading && entries.length === 0 ? (
            <div style={{ textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              Loading transactions...
            </div>
          ) : entries.length === 0 ? (
            <div className="empty-state">
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No entries recorded yet</p>
              <p style={{ fontSize: '0.9rem' }}>Click <strong>"Today's Spend"</strong> or <strong>"Add Salary / Deposit"</strong> to start tracking!</p>
            </div>
          ) : (
            <div className="entry-list">
              {entries.map((entry) => (
                <EntryItem
                  key={entry._id}
                  entry={entry}
                  onDelete={handleDeleteEntry}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for adding Spend or Income */}
      <AddEntryModal
        type={modalType}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEntry}
      />
    </div>
  );
};

export default DashboardPage;
