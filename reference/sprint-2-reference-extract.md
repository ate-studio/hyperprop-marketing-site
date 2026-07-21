# Sprint 2 Reference Extract — payout-landing-v2_0_30.html

Source: `/Users/ductrinh/Accel3/hyperprop-marketing-site/reference/payout-landing-v2_0_30.html`

---

## 1. Pricing Section HTML (#pricing, lines 642–675)

```html
<!-- PRICING -->
<section id="pricing" class="sec-pad">
  <div class="wrap">
    <div class="sec-head rv">
      <p class="eyebrow">Pricing</p>
      <h2>Choose your evaluation. One-time fee, 100% rebated at first payout.</h2>
      <p>The table below is the complete rule set for the account. There is no fine print anywhere else.</p>
    </div>

    <div class="pricing-ctl rv">
      <div class="tabs" role="tablist" aria-label="Account size" id="size-tabs">
        <button role="tab" data-size="5" aria-selected="false">$5K</button>
        <button role="tab" data-size="10" aria-selected="false">$10K</button>
        <button role="tab" data-size="25" aria-selected="true">$25K</button>
        <button role="tab" data-size="50" aria-selected="false">$50K</button>
        <button role="tab" data-size="100" aria-selected="false">$100K</button>
      </div>
      <a class="btn btn-ghost compare-btn" href="#">Compare plans</a>
    </div>

    <div class="plans rv" data-stagger id="plans"></div>
    <div class="freetrial rv">
      <div class="ft-head"><span class="eyebrow">Demo account</span><span class="ft-title">Free Trial</span></div>
      <ul class="ft-feats">
        <li class="yes">Unlimited strategy testing</li>
        <li class="yes">Full analytics access</li>
        <li class="yes">Real market conditions</li>
        <li class="yes">No time limit</li>
        <li class="no">No funding on completion</li>
      </ul>
      <div class="ft-cta"><a class="btn btn-ghost" href="#">Start Demo</a><span class="ft-note">Does not count toward the points program</span></div>
    </div>
  </div>
</section>
```

**Structure:** `section#pricing.sec-pad` → `.wrap` → `.sec-head` + `.pricing-ctl` (`.tabs#size-tabs` + `.compare-btn`) + `#plans.plans` (JS-rendered) + `.freetrial`.

---

## 2. ACCTS Array (lines 897–939)

```javascript
/* ---------- pricing data (source: PP-LAUNCH-V2) ---------- */
const ACCTS=[
  {name:'Desk Eval', sym:'\u03A3', badge:'The front door', accent:'sig',
   price:{5:30,10:55,25:125,50:240,100:475},
   rules:[['Pass by','Metrics'],['Sample','\u226560 trades \u00b7 \u226521d'],['Daily loss \u00b7 EOD','3%'],['Max drawdown','6% static'],['Split','80 \u2192 95%']],
   foot:'Classifier credit accrues \u00b7 fast lane to live capital'},
  {name:'2-Step', badge:'Cheapest sprint', accent:'',
   price:{5:45,10:85,25:180,50:340,100:680},
   rules:[['Pass by','8% \u2192 5%'],['Phases','2'],['Daily loss \u00b7 EOD','5%'],['Max drawdown','10% static'],['Split','80 \u2192 95%']],
   foot:'Widest risk room \u00b7 lowest sprint fee'},
  {name:'1-Step', badge:'Fastest to funded', accent:'',
   price:{5:55,10:100,25:250,50:475,100:950},
   rules:[['Pass by','10%'],['Phases','1'],['Daily loss \u00b7 EOD','4%'],['Max drawdown','6% static'],['Split','80 \u2192 95%']],
   foot:'Volume SKU \u00b7 one clean pass'},
  {name:'Prime 1-Step', badge:'Premium terms', accent:'prime',
   price:{5:105,10:190,25:475,50:900,100:1800},
   rules:[['Pass by','8%'],['Phases','1'],['Daily loss \u00b7 EOD','5%'],['Max drawdown','10% static'],['Split','90 \u2192 95%']],
   foot:'90% split day one \u00b7 easier target \u00b7 wider room'}
];
let curSize=25;
```

**Render template classes:** `.plan` (+ `.sig`/`.prime`), `.pl-badge` (`.ghost`/`.inkb`), `.pl-name`, `.pl-sym`, `.pl-price`, `.pl-rows` / `.pl-row` (`.k`/`.v`), `.pl-foot` + `.dot` (`.inkd`), `.btn.btn-primary`.

---

## 3. Pricing CSS (lines 157–175, 400–437)

### Lines 157–175

```css
/* pricing */
.tabs{display:inline-flex;border:1px solid var(--line);border-radius:var(--radius-xs);overflow:hidden;background:var(--paper-raised)}
.tabs button{font-family:var(--mono);font-size:var(--text-sm);letter-spacing:.08em;text-transform:uppercase;padding:11px 18px;background:transparent;border:none;border-right:1px solid var(--line);cursor:pointer;color:var(--ink-60)}
.tabs button:last-child{border-right:none}
.tabs button[aria-selected="true"]{background:var(--ink);color:var(--paper)}
.pricing-ctl{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:34px;align-items:center;justify-content:space-between}
.compare-btn{padding:9px 18px;font-size:var(--text-sm)}
.price-card{border:1px solid var(--line);border-radius:var(--radius-md);background:var(--paper-raised);overflow:hidden;box-shadow:var(--shadow-1)}
.price-top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:24px;padding:34px 36px;border-bottom:1px solid var(--line)}
.price-top .odo{font-size:var(--text-6xl)}
.price-top .eval-name{font-size:var(--text-xl);font-weight:600;letter-spacing:-.01em}
.price-top .fee-note{font-family:var(--mono);font-size:var(--text-xs);color:var(--ink-60);letter-spacing:.06em;margin-top:4px}
.spec-table{width:100%;border-collapse:collapse}
.spec-table th,.spec-table td{padding:15px 36px;border-bottom:1px solid var(--line);text-align:left;font-size:var(--text-base)}
.spec-table th{font-family:var(--mono);font-size:var(--text-xs);font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-60);background:var(--paper)}
.spec-table td.val{font-family:var(--mono);font-feature-settings:"tnum";text-align:right}
.spec-table tr:last-child td{border-bottom:none}
.price-foot{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;padding:22px 36px;background:var(--paper)}
.price-foot .chips{display:flex;gap:8px;flex-wrap:wrap}
```

### Lines 400–437 (+ freetrial 424–437)

```css
/* 3-variant pricing cards */
.plans{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.plan{background:var(--paper-raised);padding:28px 22px 26px;display:flex;flex-direction:column;position:relative;border:1px solid var(--glass-line);border-radius:var(--radius-lg);overflow:hidden;transition:transform var(--motion-base) var(--ease-out-back),box-shadow var(--motion-base) ease}
#plans .plan{transition:transform var(--motion-base) var(--ease-out-back),box-shadow var(--motion-base) ease}
#plans .plan:hover{transform:scale(1.035);z-index:2;box-shadow:var(--shadow-2),0 18px 44px -20px rgba(94,139,255,.35)}
.plan.sig{background:linear-gradient(180deg,rgba(94,139,255,.10) 0%,var(--paper-raised) 46%),var(--line)}
.plan.sig::before{content:"";position:absolute;inset:0 0 auto 0;height:2px;background:linear-gradient(90deg,transparent,var(--blueprint),transparent)}
.plan.prime{background:linear-gradient(180deg,rgba(246,245,241,.055) 0%,var(--paper-raised) 46%),var(--line)}
.plan.prime::before{content:"";position:absolute;inset:0 0 auto 0;height:2px;background:linear-gradient(90deg,transparent,var(--ink),transparent)}
.pl-badge{display:inline-block;font-family:var(--mono);font-size:var(--text-2xs);letter-spacing:.1em;text-transform:uppercase;color:var(--blueprint);border:1px solid var(--blueprint);border-radius:var(--radius-pill);padding:3px 9px;margin-bottom:14px}
.pl-badge.ghost{color:var(--ink-60);border-color:var(--line)}
.pl-badge.inkb{color:var(--ink);border-color:var(--ink-60)}
.plan .pl-name{font-family:var(--mono);font-size:var(--text-sm);font-weight:500;letter-spacing:.1em;text-transform:uppercase;display:flex;align-items:center;gap:9px}
.pl-sym{font-family:var(--serif);font-size:var(--text-xl);color:var(--blueprint-light);line-height:1}
.plan .pl-price{font-family:var(--serif);font-size:var(--text-4xl);line-height:1;margin:16px 0 3px;color:var(--ink);font-weight:400}
.plan .pl-price small{font-family:var(--mono);font-size:var(--text-2xs);letter-spacing:.05em;color:var(--ink-60);display:block;margin-top:9px;text-transform:uppercase}
.plan .pl-rows{margin-top:16px;margin-bottom:0;display:flex;flex-direction:column;gap:0}
.plan .pl-row{display:flex;justify-content:space-between;gap:10px;padding:9px 0;border-radius:0;background:none;border-bottom:1px solid var(--line);font-size:var(--text-sm)}
.plan .pl-row:last-child{border-bottom:none}
.plan .pl-row .k{color:var(--ink-60)}
.plan .pl-row .v{font-family:var(--mono);font-feature-settings:"tnum";text-align:right}
.pl-foot{margin:16px 0 18px;font-family:var(--mono);font-size:var(--text-2xs);letter-spacing:.05em;text-transform:uppercase;color:var(--ink-60);line-height:1.7}
.pl-foot .dot{display:inline-block;width:6px;height:6px;border-radius:var(--radius-circle);background:var(--blueprint);margin-right:8px;vertical-align:middle}
.pl-foot .dot.inkd{background:var(--ink)}
.freetrial{margin-top:22px;display:flex;align-items:center;gap:30px;flex-wrap:wrap;padding:20px 28px;border:1px solid var(--glass-line);border-radius:var(--radius-lg);background:var(--paper-raised)}
.ft-head{display:flex;flex-direction:column;gap:3px;flex:none}
.ft-head .ft-title{font-family:var(--serif);font-size:var(--text-xl);line-height:1}
.ft-feats{list-style:none;display:flex;flex-wrap:wrap;gap:9px 22px;flex:1;min-width:0;margin:0;padding:0}
.ft-feats li{font-family:var(--mono);font-size:var(--text-xs);letter-spacing:.02em;color:var(--ink);position:relative;padding-left:20px}
.ft-feats li::before{position:absolute;left:0;top:-1px;font-weight:700}
.ft-feats li.yes::before{content:"\2713";color:var(--up)}
.ft-feats li.no::before{content:"\2715";color:var(--down)}
.ft-cta{display:flex;flex-direction:column;align-items:flex-end;gap:7px;flex:none}
.ft-note{font-family:var(--mono);font-size:var(--text-2xs);letter-spacing:.04em;text-transform:uppercase;color:var(--ink-60);max-width:200px;text-align:right}
@media (max-width:760px){.freetrial{flex-direction:column;align-items:flex-start}.ft-cta{align-items:flex-start}.ft-note{text-align:left}}
.plan .btn{width:100%;justify-content:center;margin-top:auto}
@media (max-width:900px){.plans{grid-template-columns:1fr 1fr}}
@media (max-width:560px){.plans{grid-template-columns:1fr}}
```

---

## 4. Transparency Section HTML (#transparency, lines 677–722)

```html
<!-- TRANSPARENCY -->
<section id="transparency" class="sec-pad trans sec-invert">
  <div class="wrap">
    <div class="sec-head rv">
      <p class="eyebrow">Transparency</p>
      <h2>Numbers we publish. Most firms don't.</h2>
      <p>Pass rates, payouts, and breach data — published live, because a firm that pays traders has nothing to hide from them.</p>
    </div>
    <div class="trans-grid rv-scale">
      <div class="trans-panel">
        <h3>Payout ledger — settled on-chain</h3>
        <!-- feed-row entries — see §10 -->
        <div class="ledger-cta"><a class="btn btn-ghost" href="#">View full transparency page -></a></div>
      </div>
      <div class="trans-panel">
        <h3>This month, in public</h3>
        <div class="big-metric">
          <div class="bm"><div class="v num" data-count="412908" data-prefix="$">$0</div><div class="l">Paid out</div></div>
          <div class="bm"><div class="v num" data-count="11.2" data-dec="1" data-suffix="%">0%</div><div class="l">Pass rate</div></div>
          <div class="bm"><div class="v num" data-count="32">0</div><div class="l">Payouts</div></div>
        </div>
        <h3 style="margin-top:8px">Payouts by day — last 30 days</h3>
        <div class="dm-chart" id="dm-chart" aria-hidden="true"></div>
        <div style="display:flex;justify-content:space-between"><span class="dm-lab">JUN 18</span><span class="dm-lab">JUN 28</span><span class="dm-lab">JUL 07</span><span class="dm-lab">JUL 17</span></div>
        <div class="vault-sep"></div>
        <h3 style="margin-top:24px;margin-bottom:12px">ReserveVault &amp; settlement</h3>
        <div class="vault-lead">Solvency you can <em>audit yourself.</em></div>
        <p style="color:var(--ink-60);font-size:13.5px;margin-top:12px">A public on-chain USDC vault held at ≥15–20% of all funded capital — multiples above expected liability. Payouts settle on demand, in minutes, with a public tx hash.</p>
        <div class="vaultbar"><span class="vb-need"></span><span class="vb-fill"></span></div>
        <div class="vaultlegend"><span><i class="need"></i>Expected liability</span><span><i class="fill"></i>Vault ≥15–20% of funded</span></div>
        <div class="vaulttx">0x3fa2…9c41 · PAYOUT · 925.00 USDC · <a class="vtx" href="#">VERIFY TX ↗</a> · &lt;5 min request → wallet</div>
      </div>
    </div>
  </div>
</section>
```

---

## 5. Transparency CSS

```css
.trans{background:var(--paper)}
.trans-extra{display:grid;grid-template-columns:1.05fr .95fr;gap:1px;background:var(--line);border:1px solid var(--line);border-top:none}
@media (max-width:960px){.trans-extra{grid-template-columns:1fr}}
.trans-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:1px;background:var(--line);border:1px solid var(--line)}
.trans-panel{background:var(--paper-raised);padding:34px;display:flex;flex-direction:column}
.trans-panel .ledger-cta{margin-top:auto;padding-top:24px}
.trans-panel h3{font-family:var(--mono);font-size:var(--text-xs);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-60);font-weight:500;margin-bottom:22px}
.feed-row{display:grid;grid-template-columns:auto 1fr auto auto;gap:16px;align-items:baseline;font-family:var(--mono);font-size:var(--text-sm);padding:12px 0;border-bottom:1px solid var(--line)}
.feed-row:last-child{border-bottom:none}
.feed-row .t{color:var(--ink-60)} .feed-row .amt{color:var(--up);font-feature-settings:"tnum"}
.feed-row .tx{color:var(--blueprint)} .feed-row .tx:hover{text-decoration:underline}
.feed-row .tx:hover{color:var(--blueprint-light)}
.dm-chart{display:flex;align-items:flex-end;gap:4px;height:160px;margin-top:8px}
.dm-col{display:flex;flex-direction:column-reverse;gap:3px;align-items:center;flex:1}
.dm-col i{width:6px;height:6px;border-radius:var(--radius-circle);background:var(--ink)}
.dm-col.hi i{background:var(--blueprint)}
.dm-col.dim i{background:var(--ink-30)}
@media (max-width:600px){.dm-col i{width:4px;height:4px}.dm-chart{gap:3px;height:130px}}
.dm-chart{position:relative}
.dm-tip{position:absolute;pointer-events:none;opacity:0;transform:translate(-50%,-100%);transition:opacity var(--motion-fast);background:var(--ink);color:var(--paper);border-radius:var(--radius-sm);padding:6px 10px;font-family:var(--mono);font-size:var(--text-xs);letter-spacing:.02em;white-space:nowrap;box-shadow:var(--shadow-2);z-index:5}
.dm-tip.on{opacity:1}
.dm-tip b{color:var(--blueprint-light);font-weight:600}
.dm-lab{font-family:var(--mono);font-size:var(--text-2xs);color:var(--ink-60);margin-top:10px;letter-spacing:.04em}
.vaultbar{display:flex;height:20px;border:1px solid var(--line);border-radius:var(--radius-sm);overflow:hidden;margin-top:16px;background:var(--paper)}
.vaultbar .vb-need{width:5%;background:var(--up)}
.vaultbar .vb-fill{width:18%;background:repeating-linear-gradient(-45deg,var(--blueprint),var(--blueprint) 5px,var(--blueprint-strong) 5px,var(--blueprint-strong) 10px)}
.vaultlegend{display:flex;gap:22px;margin-top:12px;font-family:var(--mono);font-size:var(--text-2xs);letter-spacing:.05em;color:var(--ink-60);flex-wrap:wrap;text-transform:uppercase}
.vaultlegend i{display:inline-block;width:9px;height:9px;margin-right:7px;vertical-align:middle;border-radius:var(--radius-xs)}
.vaultlegend .need{background:var(--up)}
.vaultlegend .fill{background:var(--blueprint)}
.vault-sep{height:1px;background:var(--line);margin-top:30px}
.vault-lead{font-family:var(--serif);font-size:var(--text-2xl);line-height:1.12;letter-spacing:-.01em;color:var(--ink)}
.vault-lead em{font-style:italic;color:var(--blueprint-light)}
.vaulttx{font-family:var(--mono);font-size:var(--text-xs);color:var(--ink-60);margin-top:16px;letter-spacing:.02em}
.vaulttx .vtx{color:var(--blueprint);text-decoration:none}
.vaulttx .vtx:hover{text-decoration:underline}
.big-metric{display:flex;gap:44px;flex-wrap:wrap;margin-bottom:26px}
.big-metric .bm .v{font-family:var(--serif);font-size:var(--text-5xl);line-height:1}
.big-metric .bm .l{font-family:var(--mono);font-size:var(--text-xs);letter-spacing:.1em;text-transform:uppercase;color:var(--ink-60);margin-top:6px}
/* responsive */
@media (max-width:960px){.trans-grid,.path{grid-template-columns:1fr}}
@media (max-width:760px){.feed-row{grid-template-columns:auto 1fr auto;gap:10px}.feed-row .tx{display:none}}
```

**Note:** No `.days` CSS class — chart uses `.dm-col` / `.dm-chart`.

---

## 6. Footer HTML (lines 836–854)

```html
<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-col">
        <a class="logo" href="#" style="margin-bottom:14px"><span class="lm" aria-hidden="true"></span>Payout</a>
        <p style="font-size:13.5px;color:var(--ink-60);max-width:280px">A crypto-native proprietary trading firm, run like a risk desk.</p>
      </div>
      <div class="foot-col"><h4>Trading</h4><a href="#how">How it works</a><a href="#pricing">Pricing</a><a href="#">Rulebook</a><a href="#transparency">Transparency</a></div>
      <div class="foot-col"><h4>Company</h4><a href="#">About</a><a href="#">Careers</a><a href="#">Affiliates</a><a href="#">Contact</a></div>
      <div class="foot-col"><h4>Legal</h4><a href="#">Terms of use</a><a href="#">Funded trader agreement</a><a href="#">Privacy policy</a><a href="#">Risk disclosure</a></div>
    </div>
    <div class="legal">
      <p><b>Important disclosures.</b> All content provided by Payout is for educational and informational purposes only and does not constitute investment advice, a recommendation, or an offer or solicitation to buy or sell any financial instrument. Payout is not a broker and does not accept deposits.</p>
      <p><b>Hypothetical and simulated performance.</b> Evaluation and funded accounts operate in a simulated environment. Hypothetical or simulated performance results have inherent limitations. Unlike an actual performance record, simulated results do not represent actual trading, and no representation is made that any account will or is likely to achieve profits or losses similar to those shown. Simulated trading does not involve financial risk, and no hypothetical trading record can completely account for the impact of financial risk in actual trading.</p>
      <p><b>Risk.</b> Trading derivatives, including cryptocurrency perpetual futures, involves substantial risk of loss and is not suitable for all persons. Digital asset markets are highly volatile and largely unregulated. Only risk capital should be used.</p>
      <p>© 2026 Payout. All rights reserved. Entity registration and jurisdiction details pending. [PLACEHOLDER — legal entity block]</p>
    </div>
  </div>
</footer>
```

---

## 7. Footer CSS

```css
footer{border-top:1px solid var(--line);background:var(--paper)}
.foot-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;padding:64px 0 48px}
.foot-col h4{font-family:var(--mono);font-size:var(--text-xs);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-60);font-weight:500;margin-bottom:16px}
.foot-col a{display:block;font-size:var(--text-base);color:var(--ink-60);padding:4px 0}
.foot-col a:hover{color:var(--ink)}
.legal{border-top:1px solid var(--line);padding:34px 0 60px;font-family:var(--mono);font-size:var(--text-xs);line-height:1.7;color:var(--ink-60)}
.legal p{margin-bottom:14px}
.legal b{color:var(--ink);font-weight:500}
@media (max-width:960px){.foot-grid{grid-template-columns:1fr 1fr}}
@media (max-width:560px){.foot-grid{grid-template-columns:1fr}}
```

---

## 8. Comparison CSS (lines 230–237)

```css
.cmp{width:100%;border-collapse:collapse;border:1px solid var(--line);background:var(--paper-raised)}
.cmp th,.cmp td{padding:17px 26px;border-bottom:1px solid var(--line);font-size:var(--text-base);text-align:left;vertical-align:top}
.cmp th{font-family:var(--mono);font-size:var(--text-xs);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-60);font-weight:500;background:var(--paper)}
.cmp td:first-child{color:var(--ink-60);width:28%}
.cmp .yes{color:var(--up);font-family:var(--mono);font-size:var(--text-sm)}
.cmp .no{color:var(--down);font-family:var(--mono);font-size:var(--text-sm)}
.cmp tr:last-child td{border-bottom:none}
.cmp td.oursides{border-left:1px solid var(--line)}
```

---

## 9. `days` Array — Payout Chart JS (line 962+)

```javascript
/* ---------- dot-matrix chart: daily payouts, last 30 days ---------- */
const days=[5,7,6,9,8,4,3,8,10,9,12,11,5,4,9,11,13,12,15,7,5,10,12,11,14,13,6,5,11,13];
const chart=document.getElementById('dm-chart');
const maxD=Math.max(...days);
const dseed=x=>{const v=Math.sin(x*127.1)*43758.5453;return v-Math.floor(v);};
const fmtDay=i=>{const d=new Date(Date.UTC(2026,5,18));d.setUTCDate(d.getUTCDate()+i);return d.toLocaleDateString('en-US',{month:'short',day:'2-digit',timeZone:'UTC'}).toUpperCase();};
```

**Chart axis labels (HTML):** JUN 18 · JUN 28 · JUL 07 · JUL 17  
**Column classes:** `.dm-col`, `.hi` (max value), `.dim` (value ≤4)

---

## 10. Payout Ledger Placeholder Entries (lines 688–699)

| Time  | Trader       | Amount         | Tx hash        |
|-------|--------------|----------------|----------------|
| 14:02 | trader ···7f2a | +1,247.83 USDC | 0x94c1…e07 -> |
| 13:41 | trader ···b90c | +3,082.10 USDC | 0x1aa8…4fd -> |
| 12:58 | trader ···44de | +512.44 USDC   | 0x77b2…c11 -> |
| 12:12 | trader ···09aa | +6,904.51 USDC | 0xe30d…981 -> |
| 11:47 | trader ···c3f1 | +998.00 USDC   | 0x52f7…a6c -> |
| 11:20 | trader ···e881 | +2,411.09 USDC | 0x8be0…3d2 -> |
| 10:54 | trader ···19bd | +745.62 USDC   | 0xa471…90e -> |
| 10:31 | trader ···6c0a | +4,120.00 USDC | 0x3f95…b17 -> |
| 09:58 | trader ···d24f | +1,530.77 USDC | 0xc628…44a -> |
| 09:31 | trader ···a7e3 | +2,864.20 USDC | 0xb914…2f8 -> |
| 09:07 | trader ···5b1c | +1,073.95 USDC | 0x2de6…7a0 -> |
| 08:44 | trader ···f10e | +689.30 USDC   | 0x9c47…e52 -> |

**Row markup pattern:**
```html
<div class="feed-row"><span class="t">14:02</span><span>trader ···7f2a</span><span class="amt">+1,247.83 USDC</span><a class="tx" href="#">0x94c1…e07 -></a></div>
```

---

## Sprint 2 Implementation Checklist

| Component | Key IDs/classes | Default state |
|-----------|-----------------|---------------|
| Pricing tabs | `#size-tabs`, `data-size` 5/10/25/50/100 | `curSize=25`, $25K selected |
| Plan cards | `#plans.plans`, 4× `.plan` | JS from ACCTS |
| Free trial | `.freetrial`, `.ft-feats li.yes/.no` | Static HTML |
| Transparency | `#transparency.trans.sec-invert`, `.trans-grid` | 2 panels |
| Big metrics | `data-count` 412908 / 11.2 / 32 | Animated counters |
| Chart | `#dm-chart`, `days` array (30 values) | Dot matrix |
| Vault | `.vaultbar .vb-need` 5%, `.vb-fill` 18% | Static bar |
| Footer | `.foot-grid` 4 cols → 2 → 1 | Legal placeholder retained |
