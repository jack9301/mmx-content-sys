# WRITING_STYLE.md — Agubi Men's Health

The voice, structure, and conventions for every article on this site. Read this before writing.

The house style is adapted from good urology-clinic writing: direct, second-person, evidence-first, structured for skimming. It is a **reference, not a template** — sentence length and section structure should adapt to the content. A comparison article needs a table; a mechanism article needs a physiology walkthrough; a how-to article needs numbered steps.

---

## 1. Voice

**Second person by default.** "You" is the reader. Not "one," not "patients," not "men" as a group.

**First person is a deliberate exception.** Only use "I" when the user explicitly asks for a clinician-speaking voice. This happened once (an early version of the frequent-erections article) and was rewritten. Default is second person.

**Tone: a smart friend who happens to be a urologist.** Not a textbook. Not a wellness blog. Not a marketing page.

| Register | Avoid | Prefer |
|---|---|---|
| Conversational | "So here's the thing" | "Here's what actually happens" |
| Clinical | "the patient presents with" | "you'll feel" |
| Authoritative | "it is important to note" | state it directly |
| Honest | "studies show amazing results" | "the evidence is mixed" |

---

## 2. Length: a target, not a rule

**Aim for 5–6 minutes of reading time (1,200–1,600 words).**

This is a **default to aim at, not a hard cap.** Most articles should land here, because readers are on phones, between tasks, and busy — and an article nobody finishes teaches them nothing.

**But some articles genuinely need more.** A mechanism that requires three layers of explanation, a comparison across two diseases with nine overlapping symptoms, a drug trial with a safety issue that needs careful handling — these don't compress into 1,600 words without losing the thing that makes them valuable. When that happens, **write the full article and let it run long.**

| Reading time | Words | When it's right |
|---|---|---|
| Under 3 min | < 700 | A genuinely narrow question, answered completely |
| **5–6 min** | **1,200–1,600** | **The default — aim here** |
| 7–9 min | 1,700–2,200 | The topic needs real depth to be useful |
| 10+ min | 2,200+ | Only when cutting would break the article |

### The judgment call

Ask whether every paragraph is load-bearing. If yes, the length is the topic's fault, not the draft's — keep it. If some paragraphs are padding, cut them regardless of where the total lands.

The failure mode is not "too long." It's **long because it meanders**. A tight 2,200-word article is better than a padded 1,600-word one. And a genuinely comprehensive piece that's 12 minutes is fine — as long as it's well-structured so a reader can skim, and the opener makes the value obvious in two sentences.

### Prefer splitting when there's an easy seam

If a draft has grown past 2,200 words and there's a clean split point — "here's the disease, here's the treatment" — two articles serve readers better than one long one. Each gets its own URL, its own search intent, its own chance to rank. But don't manufacture a split at the cost of coherence.

### When a draft runs long, cut the usual fat first

- **Context the reader doesn't need.** Don't re-explain BPH in the finasteride article if they arrived from the BPH explainer.
- **Redundant restatement.** The same mechanism said twice in different words.
- **Inherited hedging.** Three sentences caveating the same weak evidence. One is enough.
- **Decontextualized lists.** Ten items where four carry the argument.
- **Scope creep.** "While we're here, a note on alpha-blockers" belongs on its own URL.

Cut those first, then judge what's left on its merits.

### Check before publishing

```bash
wc -w content/en/your-slug.mdx
```

Over 1,600 is fine if the content earns it. Over 1,600 with nothing left to cut is not.

---

## 3. Default article structure

### 3.1 Opener — 2 to 4 sentences

Answer the title's question immediately. No throat-clearing, no "in this article," no rhetorical questions before the answer.

**Good:**
> Frequent erections do not cause chronic pelvic pain syndrome. But the way you have them — how long, how intense, and what happens in your pelvic floor during and after — can aggravate an already-irritated prostate.

**Bad:**
> Prostate health is an important topic for men of all ages. Many men wonder whether their habits affect their prostate. In this article, we'll explore the relationship between erections and CPPS.

### 3.2 Key Takeaways box

Immediately after the opener, 4–6 bullets in the frontmatter `keyTakeaways` array. These render as a teal callout box above the body.

Each bullet should be a standalone claim — readable without the surrounding context.

```yaml
keyTakeaways:
  - "Erections themselves do not cause CPPS — but the way you have them can aggravate symptoms"
  - "The connection is pelvic floor muscle fatigue, not prostate damage"
```

### 3.3 Body sections

Section headings should be **question-led or task-led**, not abstract labels.

| Instead of | Write |
|---|---|
| "Overview" | "What IC actually is" |
| "Treatment Options" | "What actually works for IC" |
| "Symptoms" | "How to tell the difference" |
| "Causes" | "Why long sitting makes it worse" |

**Not every article needs the same section count.** Typical range is 6–9 H2s for a 1,500–2,500 word piece.

### 3.4 Lists — bold lead-in + colon

This is the house convention. It makes lists scannable and lets the reader stop after the bold phrase if that's all they needed.

```markdown
- **Acute bacterial prostatitis:** A sudden bacterial infection, usually treated with antibiotics.
- **Pelvic floor tightening:** A chronic guarded state that produces most CPPS symptoms.
- **Central sensitization:** A nervous system that has learned to amplify normal signals into pain.
```

Bold the term, not the whole sentence. Keep the explanation after the colon readable on its own.

### 3.5 Closing

End on substance. A synthesis, a framework, or a clear summary of what the reader should take away.

**Never close with a doctor referral.** See the hard rules in `AGENTS.md` §7.

A good closing names the through-line: *"The answer isn't 'stop.' The answer is 'pay attention, modify the patterns that hurt you, and stay in the game.'"*

### 3.6 References

End every article with a numbered reference list. Full citation: author, year, title, source.

```markdown
**References**

1. American Urological Association. (2025). *Male Chronic Pelvic Pain Syndrome: AUA Guideline.*
2. Anderson, R. U., et al. (2006). *Sexual function in men with chronic prostatitis.* Journal of Urology.
```

---

## 4. Sentence and paragraph mechanics

These are **reference points, not rules**. Adjust to the content.

| Guideline | Target | Why |
|---|---|---|
| Sentence length | 15–22 words average | Scannable on mobile |
| Paragraph length | 1–4 sentences | Prevents wall-of-text on phones |
| Passive voice | Avoid where the actor is known | "Kegels tighten the pelvic floor" beats "the pelvic floor is tightened by Kegels" |
| Hedge where uncertain | Use explicitly | "The evidence is mixed" is better than false confidence |
| Jargon | Define on first use | A reader arrived from Google, not from medical school |

Variety matters. A paragraph of eleven 15-word sentences reads as robotic. Mix short and long. A short sentence after a long one lands harder.

---

## 5. Evidence and citation

**Inline, not footnote-style.** Name the source in the sentence:

> The AUA 2025 CPPS Guideline lists sexual dysfunction as a UPOINT phenotype domain and recommends regular ejaculation as part of conservative management.

> Anderson 2006 found a correlation between higher NIH-CPSI scores and more frequent ejaculation — but the direction of causation isn't clear.

**Name limitations explicitly.** This is a YMYL site; overstating evidence is the cardinal sin.

- ✅ "Correlation, not causation."
- ✅ "The evidence here is mostly observational."
- ✅ "There's no clean RCT showing this."
- ❌ "Studies prove that..."
- ❌ "Research shows this works."

**Prefer primary sources.** AUA/EAU guidelines, NIH, Cochrane reviews, and peer-reviewed journals. Mayo Clinic and Cleveland Clinic are acceptable secondary references. Patient-advocacy sites are not citable for medical claims.

---

## 6. Sexual health content

This is a men's health site. Sexual health is core content, not sensitive content.

**Frame clinically, not morally.** For example, the mechanism for pornography-driven masturbation is written as:

> Arousal causes vasocongestion — increased blood flow into the prostate and surrounding pelvic structures. In a healthy pattern, that congestion resolves after ejaculation and recovery. In a long, edging-heavy pattern without recovery, it does not fully resolve.

That gives the reader the actual mechanism. It does not moralize. It also does not pretend the mechanism isn't the point.

**Never shame.** No "if you're one of those people," no "honestly, though," no implication that the reader is foolish for their habits. State the physiology, state the consequence, state what to do.

---

## 7. Images

### 7.1 Illustration style

- Watercolor, soft, abstract
- Peach + sage green palette on cream
- 16:9 aspect ratio
- No text or labels in the image itself
- Anatomical subjects rendered tastefully — abstract is fine, clinical realism is fine, explicit is not

### 7.2 Alt text

Describe the image for a screen-reader user. Do not stuff keywords.

**Good:** `Pelvic floor muscles highlighted in watercolor, abstract medical art`
**Bad:** `prostatitis pelvic floor diagram best treatment for CPPS`

### 7.3 Placement

3–5 inline images per article, placed after the section that introduces the concept. Never repeat the cover inline.

### 7.4 Real product photos

When an article discusses a specific purchasable product, use a real product photo rather than an illustration. Real products build trust and let readers actually identify the item.

Source via `images_search_and_download`, upload through `get_upload_url` + PUT, use the returned CDN URL.

---

## 8. Anti-patterns

Cut on sight:

| Phrase | Why |
|---|---|
| "It is important to note that" | Says nothing |
| "It is worth noting that" | Says nothing |
| "The honest answer is that" | Just give the honest answer |
| "Ultimately," / "In essence," / "In short," | Filler |
| "Notably," / "Importantly," / "Specifically," | Filler — the sentence that follows is either specific or not |
| "very" / "really" / "just" / "quite" / "absolutely" | Intensifiers dilute |
| "arguably" / "literally" / "honestly" / "essentially" | Hedging noise |
| "In this article, we will" | Reader can see the article |
| "Many men wonder" | Don't presume |
| "Studies show" (unspecified) | Name the study |
| "Natural" as a health claim | Marketing language |

Also cut:

- Rhetorical questions used as filler transitions
- "It's not just X, it's Y" constructions used more than once per article
- Em-dash overuse (one per paragraph is plenty)
- Rule-of-three padding ("fast, safe, and effective")

---

## 9. Worked examples

Read these two published articles for calibration:

**Tight, mechanism-focused:** `/en/articles/frequent-erections-cpps/`
Short opener, Key Takeaways, then physiology → connection → what "too much" means → evidence → practical steps. Second person throughout. No doctor-referral close.

**Long, comparison-focused:** `/en/articles/interstitial-cystitis-vs-cpps/`
Same opener pattern, then a definition section per condition, a comparison table, a misdiagnosis section, a diagnostic workup section, a treatment-divergence section.

**Treatment/mechanism hybrid:** `/en/articles/kegels-for-men/`
Opens by naming the contradiction ("the most-prescribed exercise is the wrong one for the men who get prescribed it most"), then explains the mechanism, then splits into when-it-helps vs when-it-hurts, then gives a self-assessment and a progressive protocol.

---

## 10. Quick checklist before publishing

- [ ] **Word count is around 1,200–1,600 (5–6 min). Over is fine when the content earns it; under is fine when nothing needed cutting.**
- [ ] Title under 60 characters
- [ ] Excerpt 120–155 characters, states the reader's benefit
- [ ] Frontmatter uses `excerpt`, not `description`
- [ ] `coverImage` is an absolute URL
- [ ] Cover image does **not** also appear inline
- [ ] `tags` has 4+ entries
- [ ] `keyTakeaways` has 4–6 bullets
- [ ] At least 4 H2 headings, all question- or task-led
- [ ] Lists use the bold lead-in + colon pattern
- [ ] 3–5 inline images with descriptive alt text
- [ ] Claims about evidence name the source and its limitations
- [ ] No filler phrases from the anti-pattern list
- [ ] Closing is substantive, not a doctor referral
- [ ] `**References**` block at the end
- [ ] Slug registered in `src/lib/article-categories.ts`
- [ ] `npm run build` passes the SEO validator