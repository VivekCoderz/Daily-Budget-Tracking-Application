import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Trash2 } from 'lucide-react';

const EntryItem = ({ entry, onDelete }) => {
  const isIncome = entry.type === 'income';
  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="entry-item">
      <div className="entry-left">
        <div className={`entry-badge ${isIncome ? 'income' : 'spend'}`}>
          {isIncome ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
        <div className="entry-details">
          <h4>{entry.note || (isIncome ? 'Salary / Deposit' : "Daily Spend")}</h4>
          <p>{formattedDate}</p>
        </div>
      </div>

      <div className="entry-right">
        <div className={`entry-amount ${isIncome ? 'income' : 'spend'}`}>
          {isIncome ? '+' : '-'} ₹{Number(entry.amount).toLocaleString('en-IN')}
        </div>
        <button
          onClick={() => onDelete(entry._id)}
          className="btn-icon"
          title="Delete entry"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default EntryItem;
