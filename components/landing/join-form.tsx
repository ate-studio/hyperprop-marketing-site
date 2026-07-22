'use client';

import { useFormState } from 'react-dom';

import { subscribe, type SubscribeState } from '@/app/actions/subscribe';

const INITIAL_STATE: SubscribeState = {
  success: false,
};

export function JoinForm() {
  const [state, formAction] = useFormState(subscribe, INITIAL_STATE);

  if (state.success) {
    return (
      <p className="join-ok join-ok-visible" aria-live="polite">
        ✓ CHECK YOUR INBOX — THE RULEBOOK IS ON ITS WAY.
      </p>
    );
  }

  return (
    <>
      <form className="email-form" action={formAction}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          aria-label="Email address"
          required
        />
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <p className="join-consent">
        We only email the rulebook and monthly reports. Unsubscribe any time.
        {/* PENDING: confirm with CTO — consent copy with counsel */}
      </p>
    </>
  );
}
