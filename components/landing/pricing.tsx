import { PricingTabs } from '@/components/landing/pricing-tabs';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Wrap } from '@/components/ui/wrap';

export function Pricing() {
  return (
    <section id="pricing" data-qa="pricing" className="sec-pad">
      <Wrap>
        <div className="sec-head sec-head-copy">
          <Eyebrow>Pricing</Eyebrow>
          <h2>
            Choose your challenge. One-time fee, 100% rebated at first payout.
            {/* PENDING: confirm with CTO — rebate claim */}
          </h2>
          <p>
            The table below is the complete rule set for the account. There is
            no fine print anywhere else.
          </p>
        </div>

        <PricingTabs />

        <div className="freetrial">
          <div className="ft-head">
            <Eyebrow>Demo account</Eyebrow>
            <span className="ft-title">Free Trial</span>
          </div>
          <ul className="ft-feats">
            <li className="yes">Unlimited strategy testing</li>
            <li className="yes">Full analytics access</li>
            <li className="yes">Real market conditions</li>
            <li className="yes">No time limit</li>
            <li className="no">No funding on completion</li>
          </ul>
          <div className="ft-cta">
            {/* PENDING: confirm with CTO — demo destination */}
            <Button href="#" variant="ghost">
              Start Demo
            </Button>
            <span className="ft-note">
              Does not count toward the points program
            </span>
          </div>
        </div>
      </Wrap>
    </section>
  );
}
