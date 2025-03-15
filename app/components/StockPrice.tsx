'use client';

import { useEffect, useState } from 'react';

export default function StockPrice({ ticker }) {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    fetch(`/api/tiingo?ticker=${ticker}`)
      .then(res => res.json())
      .then(data => setPrice(data.price));
  }, [ticker]);

  return (
    <div>
      <h2>{ticker} current price: ${price || 'Loading...'}</h2>
    </div>
  );
}
