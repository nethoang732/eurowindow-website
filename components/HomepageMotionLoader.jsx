'use client';

import { useEffect, useState } from 'react';

// Keep Motion out of every non-homepage route's client bundle.
export default function HomepageMotionLoader() {
  const [MotionLayer, setMotionLayer] = useState(null);

  useEffect(() => {
    let mounted = true;

    import('./HomepageFeaturedProductsMotion').then((module) => {
      if (mounted) setMotionLayer(() => module.default);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return MotionLayer ? <MotionLayer /> : null;
}
