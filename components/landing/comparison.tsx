import { Eyebrow } from '@/components/ui/eyebrow';
import { Wrap } from '@/components/ui/wrap';

const COMPARISON_ROWS = [
  {
    claim: 'On-chain payouts',
    northbook: 'Every payout has a public tx hash',
    typical: 'Not published',
    typicalNegative: true,
  },
  {
    claim: 'Visible reserve',
    northbook: 'Public on-chain vault',
    typical: 'Not published',
    typicalNegative: true,
  },
  {
    claim: 'No token',
    northbook: 'No token, ever',
    typical: 'Varies',
    typicalNegative: false,
  },
  {
    claim: 'Per-order transparency',
    northbook: 'Order-level records',
    typical: 'Not published',
    typicalNegative: true,
  },
] as const;

export function Comparison() {
  return (
    <section id="comparison" className="sec-pad">
      <Wrap>
        <div className="sec-head sec-head-copy rv">
          <Eyebrow>Comparison</Eyebrow>
          <h2>What we publish.</h2>
        </div>

        <table className="cmp rv-scale">
          <caption className="sr-only">
            Comparison of published transparency claims between Northbook and
            typical prop firms
          </caption>
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col" className="oursides">
                Northbook
              </th>
              <th scope="col">Typical prop firm</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.claim}>
                <th scope="row">{row.claim}</th>
                <td className="oursides">
                  <span className="yes">✓ {row.northbook}</span>
                </td>
                <td>
                  {row.typicalNegative ? (
                    <span className="no">✕ {row.typical}</span>
                  ) : (
                    <span>— {row.typical}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Wrap>
    </section>
  );
}
