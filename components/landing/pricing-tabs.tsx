'use client';

import { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  ACCOUNT_SIZES,
  DEFAULT_ACCOUNT_SIZE,
  formatPlanPrice,
  PLANS,
  type AccountSizeK,
  type PlanAccent,
} from '@/lib/pricing';

function badgeClassName(accent: PlanAccent): string {
  if (accent === 'prime') {
    return 'pl-badge inkb';
  }
  if (accent === 'sig') {
    return 'pl-badge';
  }
  return 'pl-badge ghost';
}

function dotClassName(accent: PlanAccent): string {
  return accent === 'prime' ? 'dot inkd' : 'dot';
}

function planClassName(accent: PlanAccent): string {
  if (accent === 'sig') {
    return 'plan sig';
  }
  if (accent === 'prime') {
    return 'plan prime';
  }
  return 'plan';
}

export function PricingTabs() {
  const [selectedSize, setSelectedSize] = useState<AccountSizeK>(DEFAULT_ACCOUNT_SIZE);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = useCallback((index: number) => {
    tabRefs.current[index]?.focus();
  }, []);

  const selectSize = useCallback((size: AccountSizeK, index: number) => {
    setSelectedSize(size);
    focusTab(index);
  }, [focusTab]);

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const nextIndex = (index + 1) % ACCOUNT_SIZES.length;
      selectSize(ACCOUNT_SIZES[nextIndex]!, nextIndex);
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const nextIndex =
        (index - 1 + ACCOUNT_SIZES.length) % ACCOUNT_SIZES.length;
      selectSize(ACCOUNT_SIZES[nextIndex]!, nextIndex);
    }
  };

  return (
    <>
      <div className="pricing-ctl">
        <div
          className="tabs"
          role="tablist"
          aria-label="Account size"
          id="size-tabs"
        >
          {ACCOUNT_SIZES.map((size, index) => (
            <button
              key={size}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`size-tab-${size}`}
              aria-selected={selectedSize === size}
              aria-controls="plans"
              tabIndex={selectedSize === size ? 0 : -1}
              onClick={() => selectSize(size, index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              ${size}K
            </button>
          ))}
        </div>
        {/* PENDING: confirm with CTO — compare plans destination */}
        <Button href="#" variant="ghost" className="compare-btn">
          Compare plans
        </Button>
      </div>

      <div className="plans" id="plans" role="tabpanel" aria-labelledby={`size-tab-${selectedSize}`}>
        {PLANS.map((plan) => (
          <div key={plan.name} className={planClassName(plan.accent)}>
            <div>
              <span className={badgeClassName(plan.accent)}>{plan.badge}</span>
            </div>
            <div className="pl-name">
              {plan.name}
              {plan.sym ? <span className="pl-sym">{plan.sym}</span> : null}
            </div>
            <div className="pl-price num">
              {formatPlanPrice(plan.price[selectedSize])}
              <small>
                ${selectedSize}K · one-time · one price
              </small>
            </div>
            <div className="pl-rows">
              {plan.rules.map(([label, value]) => (
                <div key={label} className="pl-row">
                  <span className="k">{label}</span>
                  <span className="v">{value}</span>
                </div>
              ))}
            </div>
            <div className="pl-foot">
              <span className={dotClassName(plan.accent)} aria-hidden="true" />
              {plan.foot}
            </div>
            {/* PENDING: confirm with CTO — checkout destination */}
            <Button href="#" variant="primary">
              Start a challenge
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
