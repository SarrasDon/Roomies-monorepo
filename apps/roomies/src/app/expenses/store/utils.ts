import { Total } from '../../shared/models';

export const calcTotal = (totals: Total[]) => totals.reduce((acc, cur) => acc + cur.total, 0);

export const calcBalance = (totals: Total[], userId: string) => {
  const count = (totals[0] || { count: 0 }).count;
  if (!count) {
    return 0;
  }
  const sum = calcTotal(totals);
  const userTotal = (totals.find(t => t.user._id === userId) || { total: 0 })
    .total;
  return sum / count - userTotal;
};

export const incrementUserTotal = (
  totals: Total[],
  amount: number,
  userId: string
) => {
  const cloned = JSON.parse(JSON.stringify(totals)) as Total[];
  const userTotal = cloned.find(t => t.user._id === userId);
  if (userTotal) {
    userTotal.total += amount;
  }
  return cloned;
};

export const decrementUserTotal = (
  totals: Total[],
  amount: number,
  userId: string
) => {
  const cloned = JSON.parse(JSON.stringify(totals)) as Total[];
  const userTotal = cloned.find(t => t.user._id === userId);
  if (userTotal) {
    userTotal.total -= amount;
  }
  return cloned;
};
