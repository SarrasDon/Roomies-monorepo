import { Total } from '../../shared/models';

export const calcTotal = (totals: Total[]) =>
  totals.reduce((acc, cur) => acc + cur.total, 0);

export const calcBalance = (totals: Total[], userId: string) => {

  const sum = calcTotal(totals);
  const userTotal = (totals.find((t) => t._id === userId) || { total: 0 })
    .total;
  return userTotal - (sum / totals.length);
};
