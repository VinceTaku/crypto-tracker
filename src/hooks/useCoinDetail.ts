import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { loadCoinDetail, loadChartData } from '../store/cryptoSlice';
import { TimeRange } from '../types/crypto';

/**
 * I encapsulate detail page data fetching in this hook.
 * We automatically refetch chart data when the time range or currency changes.
 */
const useCoinDetail = (id: string, days: TimeRange) => {
  const dispatch = useAppDispatch();
  const currency = useAppSelector((s) => s.settings.currency);
  const { coinDetails, chartData, detailLoading, chartLoading } = useAppSelector((s) => s.crypto);

  const detail = coinDetails[id];
  const chartKey = `${id}-${currency}-${days}`;
  const chart = chartData[chartKey];

  useEffect(() => {
    if (id) {
      dispatch(loadCoinDetail(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(loadChartData({ id, currency, days }));
    }
  }, [id, currency, days, dispatch]);

  return { detail, chart, detailLoading, chartLoading, currency };
};

export default useCoinDetail;