import Link from 'next/link';

import { Wrap } from '@/components/ui/wrap';

export function Footer() {
  return (
    <footer data-qa="footer">
      <Wrap>
        <div className="foot-grid">
          <div className="foot-col">
            <Link href="/" className="logo foot-logo">
              <span aria-hidden="true" className="lm" />
              Northbook
            </Link>
            <p className="foot-tagline">
              A crypto-native proprietary trading firm, run like a risk desk.
            </p>
          </div>
          <div className="foot-col">
            <h4>Trading</h4>
            <Link href="#how">How it works</Link>
            <Link href="#pricing">Pricing</Link>
            {/* PENDING: confirm with CTO — rulebook URL */}
            <Link href="#">Rulebook</Link>
            <Link href="#transparency">Transparency</Link>
          </div>
          <div className="foot-col">
            <h4>Company</h4>
            {/* PENDING: confirm with CTO — company page URLs */}
            <Link href="#">About</Link>
            <Link href="#">Careers</Link>
            <Link href="#">Affiliates</Link>
            <Link href="#">Contact</Link>
          </div>
          <div className="foot-col">
            <h4>Legal</h4>
            {/* PENDING: confirm with CTO — legal page URLs */}
            <Link href="#">Terms of use</Link>
            <Link href="#">Funded trader agreement</Link>
            <Link href="#">Privacy policy</Link>
            <Link href="#">Risk disclosure</Link>
          </div>
        </div>

        <div className="legal">
          <p>
            <b>Important disclosures.</b> All content provided by Northbook is
            for educational and informational purposes only and does not
            constitute investment advice, a recommendation, or an offer or
            solicitation to buy or sell any financial instrument. Northbook is
            not a broker and does not accept deposits.
          </p>
          <p>
            <b>Hypothetical and simulated performance.</b> Evaluation and
            funded accounts operate in a simulated environment. Hypothetical or
            simulated performance results have inherent limitations. Unlike an
            actual performance record, simulated results do not represent actual
            trading, and no representation is made that any account will or is
            likely to achieve profits or losses similar to those shown.
            Simulated trading does not involve financial risk, and no
            hypothetical trading record can completely account for the impact of
            financial risk in actual trading.
          </p>
          <p>
            <b>Risk.</b> Trading derivatives, including cryptocurrency
            perpetual futures, involves substantial risk of loss and is not
            suitable for all persons. Digital asset markets are highly volatile
            and largely unregulated. Only risk capital should be used.
          </p>
          <p>
            © 2026 Northbook. All rights reserved. Entity registration and
            jurisdiction details pending. [PLACEHOLDER — legal entity block]
          </p>
          <p>
            Rules hash: 0x0000…0000
            {/* PENDING: rules-hash from published rulebook */}
          </p>
          <p>
            {/* PENDING: geo-restriction copy from counsel */}
            Trading availability varies by jurisdiction. Geo-restriction copy
            pending counsel review.
          </p>
        </div>
      </Wrap>
    </footer>
  );
}
