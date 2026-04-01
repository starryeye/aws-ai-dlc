import { useEffect, useRef, useCallback } from 'react';
import type { OrderEvent } from '@shared/types';
import { getToken } from '@shared/auth/authUtils';
import { type OrderAction } from '../contexts/OrderContext';

const MAX_RETRIES = 5;
const RETRY_DELAY = 3000;

interface UseSseOptions {
  storeId: number;
  dispatch: React.Dispatch<OrderAction>;
  onReconnect: () => void;
}

export function useSse({ storeId, dispatch, onReconnect }: UseSseOptions) {
  const retryCount = useRef(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    const token = getToken();
    if (!token) return;

    const url = `/api/stores/${storeId}/sse/orders?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => {
      retryCount.current = 0;
      dispatch({ type: 'SET_CONNECTED', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
    };

    es.onmessage = (event) => {
      try {
        const data: OrderEvent = JSON.parse(event.data);
        switch (data.eventType) {
          case 'NEW_ORDER':
            if (data.data) {
              dispatch({ type: 'ADD_ORDER', payload: data.data });
              dispatch({ type: 'HIGHLIGHT_ORDER', payload: data.data.id });
              setTimeout(() => {
                dispatch({ type: 'REMOVE_HIGHLIGHT', payload: data.data!.id });
              }, 5000);
            }
            break;
          case 'STATUS_CHANGED':
            if (data.data) {
              dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId: data.data.id, status: data.data.status } });
            }
            break;
          case 'ORDER_DELETED':
            if (data.orderId) {
              dispatch({ type: 'REMOVE_ORDER', payload: { orderId: data.orderId, tableId: data.tableId } });
            }
            break;
          case 'TABLE_COMPLETED':
            dispatch({ type: 'RESET_TABLE', payload: { tableId: data.tableId } });
            break;
        }
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      es.close();
      dispatch({ type: 'SET_CONNECTED', payload: false });

      if (retryCount.current < MAX_RETRIES) {
        retryCount.current += 1;
        setTimeout(() => {
          onReconnect();
          connect();
        }, RETRY_DELAY);
      } else {
        dispatch({ type: 'SET_ERROR', payload: '실시간 연결에 실패했습니다. 페이지를 새로고침해주세요.' });
      }
    };
  }, [storeId, dispatch, onReconnect]);

  useEffect(() => {
    connect();
    return () => {
      eventSourceRef.current?.close();
    };
  }, [connect]);
}
