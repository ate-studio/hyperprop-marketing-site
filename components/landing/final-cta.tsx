import { Button } from '@/components/ui/button';
import { Wrap } from '@/components/ui/wrap';

export function FinalCta() {
  return (
    <section className="final" data-qa="final-cta">
      <span aria-hidden="true" className="dither tl" />
      <span aria-hidden="true" className="dither br" />
      <Wrap>
        <h2>
          Get funded. <em>Get paid.</em>
        </h2>
        <p>One-time fee. Two rules. Every number published.</p>
        <Button href="#pricing" variant="primary">
          Choose your challenge
        </Button>
      </Wrap>
    </section>
  );
}
