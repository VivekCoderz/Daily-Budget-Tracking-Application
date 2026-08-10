import React, { useState } from 'react';
import { X, IndianRupee, Calendar, FileText } from 'lucide-react';

const AddEntryModal = ({ type, isOpen, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isIncome = type === 'income';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        type,
        amount: parseFloat(amount),
        note: note || (isIncome ? 'Salary / Deposit' : "Today's Total Spend"),
        date: new Date(date).toISOString()
      });
      setAmount('');
      setNote('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-card modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isIncome ? '💰 Deposit / Salary' : '💸 Add Today\'s Spend'}</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount (₹)</label>
            <div className="input-wrapper">
              <IndianRupee className="input-icon" size={18} />
              <input
                type="number"
                step="any"
                className="form-control"
                placeholder={isIncome ? 'e.g. 50000' : 'e.g. 350'}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Date</label>
            <div className="input-wrapper">
              <Calendar className="input-icon" size={18} />
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Note / Description (Optional)</label>
            <div className="input-wrapper">
              <FileText className="input-icon" size={18} />
              <input
                type="text"
                className="form-control"
                placeholder={isIncome ? 'Monthly salary, bonus, gift...' : 'Food, commute, shopping total...'}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn ${isIncome ? 'btn-income' : 'btn-spend'}`}
              style={{ flex: 1 }}
              disabled={loading}
            >
              {loading ? 'Saving...' : isIncome ? 'Add Credit' : 'Save Spend'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntryModal;
