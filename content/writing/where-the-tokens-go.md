---
title: Where the Tokens Go
date: "2026-10-11"
summary: Organizations can no longer say what their AI spending buys. Here is how to find out.
tags:
  - AI
  - FinOps
  - platform
---

Organizations can no longer say what their AI spending buys. Here is how to find out.

Written for CACM Practice. All figures come from published sources listed in the
references or from the author's own experience. No employer data is used.

> "All motion is not progress and token usage alone is not a measure of impact of
> any kind."
>
> Andrew Bosworth, CTO of Meta, in an internal memo [1]

## Introduction

Our field learned long ago not to measure programmers by lines of code. Lines
are easy to count, so they become a target, and once they are a target people
produce more of them whether or not the extra lines do anything useful. Charles
Goodhart observed the general phenomenon in monetary policy in 1975; the
anthropologist Marilyn Strathern later put it in the form most of us know: when
a measure becomes a target, it ceases to be a good measure.

In the first half of 2026 the industry rediscovered this lesson at considerable
expense. Several large companies began tracking how much AI each employee
consumed, and some ranked employees on internal leaderboards. The practice
acquired a name, "tokenmaxxing," and rested on the assumption that more AI
usage means more productivity. Like lines of code, the measure was easy to
collect, easy to game and silent about whether anything of value was produced.

The bills arrived quickly. Uber reportedly exhausted its entire 2026 budget for
AI coding tools in the first four months of the year [2]. Meta warned
roughly 6,000 employees that internal AI costs were approaching billions of
dollars, and noted that teams had little visibility into their own consumption
[1]. Amazon dismantled a usage leaderboard after employees set up
automated agents to perform meaningless tasks simply to keep their numbers high
[3]. By summer the industry's vocabulary had shifted from
"tokenmaxxing" to "tokenminimizing" [4].

These are not isolated cases. In a July 2026 survey of 700 engineering leaders,
72% reported an unexpected AI cost spike in the past year, and organizations
estimated that 26% of their AI spending is wasted. Yet 52% said no one clearly
owns AI costs, and only 20% could find the cause within hours if their spending
doubled overnight [5].

The common response has been to cap spending. Caps stop the bleeding, but they
don't answer the question that matters: which of this spending was worth it? An
organization that cannot answer that question will either keep overspending or
cut the wrong things.

I come to this question as a practitioner. I build production systems, and I
use AI every day to build applications end to end. I have seen how much of what
an AI model produces is never used, and I have learned, sometimes expensively,
that much of that waste begins with how the person at the keyboard asks. This
article argues that the root problem is not overuse but missing attribution, at
two levels: organizations cannot say what their AI spending bought, and many
individual users never ask. I explain why AI spending escapes the cost controls
organizations already have, where the money goes, and a practical process for
attributing, judging and controlling it, without starving the work that
genuinely benefits from AI.

## 1. Background: what a token is and why the bill surprises people

A large language model (LLM) is a program that takes text as input and produces
text as output, such as answering a question, summarizing a document or writing
code. Most organizations don't run these models themselves. They send requests
over the network to a provider and pay for each one.

The price of a request depends on how much text goes in and how much comes out.
Providers measure text in *tokens*, which are fragments of words; a typical
English word is one or two tokens. Each request is billed for its input tokens
(everything sent to the model) and its output tokens (everything the model
writes back), usually at different rates. Larger, more capable models charge
more per token than smaller ones, often by a factor of ten or more.

Two properties of these systems make costs grow much faster than intuition
suggests.

**The model remembers nothing between requests.** To carry on a conversation,
the application must resend the entire conversation so far with every new
request. The tenth message in a conversation pays again for the previous nine.

**One action can trigger many requests.** Many applications now use *agents*:
programs that call a model repeatedly in a loop. The agent asks the model what
to do next, runs a tool such as a search or a database query, appends the
result to the conversation and asks again. Because every step resends the
growing history, the cost of a run grows roughly with the square of its number
of steps.

A small calculation shows the effect. Suppose each step of an agent adds 2,000
tokens to the history. After 20 steps the history is 40,000 tokens long, but
the run has paid for 2,000 + 4,000 + ... + 40,000 = 420,000 input tokens, more
than ten times the final size. If a failed step is retried, the whole history
is paid for again.

Recent measurements confirm how extreme this becomes. A 2026 study of AI agents
performing programming tasks found that they consumed roughly 1,000 times more
tokens than simpler uses of the same models, such as answering a coding
question, and that input tokens, the resent history, drove most of the cost
[6]. Two runs of the same agent on the same task differed by up to 30
times in total tokens. More spending did not reliably buy better results:
accuracy often peaked at intermediate cost. And when the models were asked to
predict their own consumption, they systematically underestimated it
[6].

The practical consequence is that a single click in an application can turn
into dozens of billed requests and hundreds of thousands of tokens, with an
unpredictable total that no single person ever sees.

## 2. Why AI budgets run out

### From provisioned to metered computing

Traditional systems ran on capacity provisioned in advance: servers, clusters
and databases with a largely fixed cost and a known owner. If a cluster was
expensive, it appeared on a specific team's budget, and that team could explain
it. Cost control was a planning exercise.

LLM usage is metered instead. Every request costs money, almost any employee or
service can make one, and spending grows with behavior rather than with
infrastructure. The cost is spread across thousands of small decisions made by
many people. Provider invoices typically report totals by account or access
key, not by purpose, so they answer "how much?" but not "for what?" It is no
surprise that 56% of engineering leaders describe forecasting their AI spend as
guesswork, or that only 45% say they understand what the AI features they build
actually cost [5].

### Three kinds of spending

Without attribution, three very different kinds of spending look identical on
the bill:

- **Spending that delivered value,** such as answering a real customer's
  question or generating code that shipped.
- **Spending that bought information,** such as experiments and evaluations
  whose results decided what to build. None of this output reaches users, yet
  it is often the most valuable spending an engineering team does.
- **Spending that bought nothing,** such as runaway retries, abandoned agent
  runs and repeated attempts at the same request.

### Waste at two levels

Waste arises at two levels, and they need different remedies.

At the **organizational** level, waste comes from systems no one is watching:
retry loops, agents with no stopping condition, experiments left running over a
weekend. Incentives make it worse. When usage is celebrated or ranked,
employees respond rationally by producing usage. Amazon's experience is the
clearest example [3], and it is not unusual: 57% of engineering
leaders in the 2026 survey said their organization actively encourages
tokenmaxxing [5].

At the **individual** level, waste comes from unexamined use. Organizations are
encouraging employees to use AI everywhere, and much of that use is a real
productivity gain, from analyzing logs to drafting code. But it also produces a
great deal of low-value output, sometimes called "AI slop": code generated and
thrown away, answers skimmed and discarded, and requests rephrased again and
again because no one stopped to understand the problem. The issue is not heavy
use, which is often justified. The issue is use that no one examines. Section 7
returns to this level in detail.

Consider a large engineering organization with 30 product teams, each building
something on top of an LLM. Every team prototypes, evaluates competing
approaches, debugs agents in development and runs automated tests against a
paid model. Each activity is reasonable on its own. Together they produce a
bill dominated by spending that never touches a customer, and no one can say
which part of it was worthwhile.

## 3. Where the tokens go

The first step toward answering "for what?" is a vocabulary for the stages in
which spending happens. I use six:

| Stage | What it is | Typical value |
| --- | --- | --- |
| Production | Requests that serve real users or business processes | Direct value |
| Development and debugging | Engineers building and fixing AI features, including coding assistants | Value if the work ships |
| Evaluation | Automated test suites that score model output against expected answers | High, when results drive decisions |
| Experiments | Trying new models, prompts or designs | High, when results drive decisions |
| Automated retries | Requests repeated after a failure or rejected output | Mostly waste |
| Abandoned runs | Work that ended without producing anything used | Waste |

Most organizations cannot fill in the share of spending for each row, and that
inability is the point. When engineering leaders estimate that a quarter of
their AI spending is wasted [5], they are guessing, because only 13%
have even basic visibility into where it goes [5]. The estimate is
probably directionally right, but nobody can say which quarter, and so nobody
can cut it.

### A simple test for what's worth paying for

Classification alone doesn't say what to cut. For that I propose one rule:
*spending is justified if it serves a user or changed a decision; everything
else is waste.*

- **Production spending** passes when it serves a real request.
- **Evaluation and experiments** look like waste because their output never
  reaches users, but they pass whenever their results decide what ships.
  Cutting them is a false economy, and blanket caps tend to hit them first.
- **Development spending** passes when the work ships and fails when the output
  is generated and discarded.
- **Automated retries** mostly fail. A few recover from genuine transient
  errors; most repeat a request that was going to fail again, at full cost each
  time.
- **Abandoned runs** fail by definition.
- **Usage driven by leaderboards or targets** fails by design, because it
  optimizes the measure rather than the outcome.

The rule is deliberately simple. It will not settle every case, but it moves
the conversation from "how much are we spending?" to "what did we get?", which
is the conversation most organizations are not yet having. Only 26% of the
leaders surveyed have a robust method for measuring the business value of their
AI spending [5].

## 4. Why current controls fall short

Organizations that notice the problem typically reach for one of four controls.
Each answers part of the question and misses the rest.

- **Provider dashboards** report totals by account or key. They show how much
  was spent, but not for what purpose or with what result.
- **Monthly invoice review** arrives weeks after the money is gone, at too
  coarse a level to act on. Uber exhausted a year's budget in four months
  [2]; a monthly review reports such a problem only after it has
  happened.
- **Hard spending caps,** such as Uber's reported limit of $1,500 per employee
  per month per tool [4], stop spending but cannot tell valuable
  spending from waste. A cap can halt a production feature or a critical
  evaluation while a runaway experiment on another account keeps running.
- **Usage leaderboards** measure activity, and therefore produce activity. Meta
  and Amazon both abandoned theirs [1, 3, 7].

Most organizations already have policies; 73% of those surveyed have AI cost
policies in place [5]. What they lack is the information to apply
them intelligently.

The most promising recent development is the AI *gateway*: a single service
through which every AI request passes on its way to the provider. Meta,
Microsoft and Databricks have all reportedly adopted gateways to track and cap
spending in real time [1, 4]. A gateway is the right place to enforce
controls, but on its own it still measures volume. Even with one in place, an
engineering leader at Databricks observed that because engineers' AI budgets
remained unlimited, "tokenmaxxing still exists" [4]. A gateway knows
how many tokens each team used. Unless it is told, it does not know what those
tokens were for or whether anything came of them.

## 5. A better process: attribute, judge, control

The improvement I propose has three parts, each building on the one before.

### Attribute: tag every request

Every AI request should carry enough information to answer "for what?" later.
At minimum, it records:

- **Stage:** production, development, evaluation, experiment or automated
  retry;
- **Owner:** the team and service that made the request;
- **Purpose:** the task, such as answering a customer, generating code or
  analyzing logs; and
- **Outcome:** whether the run produced something used, such as a response
  delivered, a code change merged or a ticket closed, or ended with nothing.

The gateway is the natural place to apply these tags, because all traffic
already passes through it. Stage, owner and purpose can be attached when the
request is made, usually as metadata supplied by the calling service; the major
providers already accept such metadata on each request. Outcome is harder,
because it is known only later. It can be linked back by recording a run
identifier with each request and matching it against events that indicate
success: a response returned to a user, a commit merged, a ticket closed. Runs
with no matching success event within a set period are classified as abandoned.

### Judge: measure cost per outcome, not usage

With attribution in place, an organization can replace raw usage with cost per
outcome: the cost per customer request served, per merged code change, per
resolved ticket. These numbers can be compared across teams and tracked over
time, and unlike token counts, they cannot be improved by burning more tokens.

The same data supports budgets by stage rather than by person. Production gets
a budget sized to traffic. Evaluation and experiments get protected budgets,
because they inform decisions. Retries and abandoned runs get alerts, because
they should be close to zero.

### Control: engineering fixes for the waste you find

Attribution shows where the waste is; a handful of engineering controls remove
most of it.

- **Per-run budgets.** Stop an agent after a set amount of spend or number of
  steps, and report the cutoff rather than silently retrying. Since models
  underestimate their own consumption [6], the limit must be enforced
  outside the model.
- **Retry limits.** Cap automatic retries, and retry only errors that are
  actually transient.
- **Caching.** Avoid paying again for context that is identical across
  requests, such as long instructions or reference documents. Providers discount
  repeated input heavily; Anthropic, for example, charges 5% of the normal
  input price for cached input on its current flagship model [11].
- **Routing by difficulty.** Send simple requests to smaller, cheaper models
  and reserve the expensive ones for hard problems. Salesforce's CEO, facing a
  reported Anthropic bill of about $300 million for the year, publicly wished
  for exactly this kind of "smart router" [2].
- **Fixing and trimming tools.** Tools often return far more data than the
  model needs, and sometimes return errors the model cannot recover from. Every
  byte and every failed call is paid for again on each later step of the run.

## 6. The process in action

A September 2026 account from Databricks shows all three parts working together
[8].

**Attribute.** Databricks routes its internal agents' requests through a
gateway that records every tool call: the tool's name, its arguments, any
error, the tokens consumed, the time taken and the session it belonged to.

**Judge.** Querying a single day of those records, the team ranked tool errors
by the tokens and waiting time they caused. Seven small bugs in two internal
tools, one for issue tracking and one for documents, stood out. One error
occurred 535 times a day and took the agent an average of 12 turns to recover
from. Nearly half of the calls to one document-retrieval tool failed.
Altogether the seven bugs were wasting an estimated $499,000 a year in tokens
and about 12,000 hours a year of engineers waiting on agents.

**Control.** The fixes were mundane. The team made the tools accept the input
formats models naturally send, supplied defaults for omitted parameters and
wrote clearer error messages. The whole cycle, from finding the problem to
measuring and fixing it, took about an hour.

The most instructive detail is how the waste hid. The agents rarely failed
visibly. They retried, guessed and eventually succeeded, so the extra cost
blended into ordinary growth in usage. No invoice, dashboard or cap would have
revealed it. A spending cap would eventually have stopped the agents, but it
would have stopped the useful work along with the wasted retries. Only
attribution, linking each token to the specific tool call and error that caused
it, made the waste visible, measurable and fixable.

## 7. It starts with the developer

Gateways and attribution can find systemic waste. They cannot make individual
use thoughtful, and in my experience that is where much of the waste begins.

### An application I threw away

Some time ago I set out to build a full-stack web application: a user
interface, a backend and a moderate amount of business logic. Rather than
design it first, I described what I wanted and asked an AI coding agent to
build the whole thing in one pass.

A few minutes later I had an application that worked, up to a point. Then I
read the code. The user interface was a mess: text that should have been
defined once was hard-coded as loose strings throughout, components fetched the
same data from the backend repeatedly, and the business logic was tangled into
the presentation layer. None of this was visible from clicking around the
running application. All of it would have made every future change slower and
riskier. Keeping the code would have meant starting the project with a large
and growing pile of technical debt. I discarded it.

### What one discarded build costs

A one-pass build like this can easily consume a million tokens: the agent reads
files, writes code, runs it, reads the errors and rewrites, and every step
resends the growing history. To make the cost concrete, take exactly 1 million
tokens. Because the agent mostly rereads context, assume 90% of them are input
and 10% are output, and price them at the published rates for Anthropic's
flagship model, Claude Opus 5.5: $4 per million input tokens and $20 per
million output tokens [11].

| Tokens | Count | Rate | Cost |
| --- | --- | --- | --- |
| Input | 900,000 | $4 per million | $3.60 |
| Output | 100,000 | $20 per million | $2.00 |
| **Total, one build** | **1,000,000** |  | **$5.60** |

Five dollars and sixty cents. Nobody would stop to question that amount on a
bill, and that is exactly the problem.

The price also depends heavily on the model. The same build at the rates of the
previous Opus generations ($5 and $25 per million) costs $7.00, and at the
rates of the earlier Opus 4 and 4.1 models ($15 and $75 per million) it costs
$21.00 [11]. Caching can lower the cost when much of the input
repeats exactly, but an agent rewriting its own code changes its context
constantly, so caching does not remove the waste. It only makes each wasted
token cheaper.

### The ripple effect

A single discarded build is invisible. The waste becomes visible only when it
is multiplied across an organization. The table below assumes 50 working weeks
a year and the $5.60 cost per discarded one-pass build calculated above.

| Discarded builds per developer | 1 developer | 1,000 developers | 10,000 developers |
| --- | --- | --- | --- |
| 1 per week | $280 a year | $280,000 a year | $2.8 million a year |
| 1 per working day | $1,400 a year | $1.4 million a year | $14 million a year |

The same arithmetic can be checked from the top down. Microsoft reportedly
found some employees spending $500 to $2,000 a month on a single AI coding
tool [4]. An organization of 1,000 engineers spending the midpoint of
that range, $1,250 a month each, spends $15 million a year. If the industry's
own estimate holds and about a quarter of AI spending is wasted [5],
roughly $4 million of that buys nothing. The bottom-up and top-down estimates
land in the same range: millions of dollars a year for a large engineering
organization, accumulated from small decisions that each cost about as much as
a cup of coffee.

That figure is not spent on any one large, visible mistake. No single build
will ever trigger an alert, a cap or a review. It is a tax paid in thousands of
small, unexamined requests, and it is invisible to everyone who pays it.

The token bill is also the smaller cost. Each discarded build also took a
developer's time to request, run, review and reject. And throwing my
application away was the cheap outcome. The expensive outcome would have been
keeping it: shipping code that worked well enough to pass a demo, and then
paying for its structural problems in engineering time for years. Generated
code that is kept but should have been discarded never appears as waste on any
report.

### What I do instead

The lesson I took was not to use AI less, but to use it differently: to do the
thinking first.

- **Ideate and plan before prompting.** I decide what I am building, how it
  breaks into parts and what "done" means for each part before the model is
  involved.
- **Build piecemeal.** I hand the model small, well-defined pieces, one at a
  time, and review each before moving on. A small piece that comes back wrong
  costs a fraction of a full build to discard and is quick to correct. A whole
  application that comes back wrong is expensive either way.
- **Give clear context.** Most of the repeated rewriting I see, in my own work
  and in others', comes from vague requests. When the intent is unclear the
  model fills the gaps with its own assumptions, and each correction resends
  the growing conversation and regenerates large blocks of code, so every round
  costs more than the last.
- **Let AI shape ideas, not replace the thinking.** AI is a useful source of
  ideas, and I use it that way. But the ideas worth keeping are the ones a
  person evaluates, redirects and owns, using the model to help refine them.
  Offloading the whole problem, from idea to design to code, produces work no
  one fully understands, and that is usually the work that gets thrown away.

### The evidence beyond anecdote

This is not only a personal impression. In a 2025 randomized controlled trial,
16 experienced open-source developers worked on real tasks in codebases they
knew well, with and without AI tools. With AI, they took 19% longer to finish,
even though they believed afterwards that AI had made them about 20% faster
[9]. The study does not show that AI tools are unhelpful in general,
and the tools have improved since. It does show that developers' own sense of
their productivity is an unreliable guide to whether AI is helping, which is
exactly why unexamined use goes unnoticed.

### Treat tokens like money

Most developers never see the cost of their requests, and many, understandably,
don't think about it. A developer who would hesitate before launching a large
cloud cluster will happily ask a model to regenerate an entire application
several times over. The cost is real; it is simply invisible to the person
incurring it.

Organizations should close that gap deliberately:

- **Train for effective use, not just for access.** Most AI training teaches
  people how to use the tools. It should also teach when not to: how to plan
  and decompose work before prompting, how to give clear context, and how to
  recognize when a conversation has gone in circles and should be restarted.
- **Show people what they spend.** Attribution data can show each developer the
  cost of their own sessions alongside what those sessions produced. Treating
  tokens as spending, with a visible price, changes behavior in a way that
  policy documents do not.
- **Coach, don't rank.** The patterns of unexamined use are visible in
  attributed data: long sessions with no outcome, many near-identical requests
  in a row, large outputs with nothing committed. That data should start a
  conversation with the developer, not feed a leaderboard.

The goal is developers who know which tasks AI genuinely accelerates and which
it only makes noisier, and who treat each request as a small spending decision.
In my experience, that is also what makes them better at using AI.

## 8. Getting started

None of this requires a large program. An organization can adopt it in five
steps:

- **Route all AI traffic through one gateway.** Without a single choke point,
  nothing else in this article is enforceable.
- **Add the four tags,** starting with stage and owner, which are easy, and
  then outcome, which requires linking to other systems.
- **Publish cost per outcome by team and stage,** and retire every metric based
  on raw usage.
- **Apply engineering controls** to the largest category of waste the data
  reveals, measure the effect, and repeat.
- **Train developers to plan before they prompt,** and show each of them what
  their own usage costs.

The first pass will be imperfect, and that is fine. The Databricks example
began with a single day of data and a single question: which errors cost the
most? An organization that can answer that question about its own AI spending
is already ahead of most.

## 9. Does it generalize?

The underlying problem is not specific to AI. It arises whenever an
organization moves from provisioned resources to metered ones. Companies moving
to the cloud a decade ago hit the same wall and responded by developing a
discipline, now called FinOps, for attributing cloud costs to the teams and
purposes that incurred them. That discipline is now absorbing AI: 98% of FinOps
practitioners report managing AI spending in 2026, up from 31% two years
earlier [10]. LLMs are forcing the cloud lesson again, faster and
across far more people, because nearly every employee can now make a metered
request.

The process in this article (tag by stage, owner, purpose and outcome; judge
spending by whether it served a user or changed a decision; control the
categories that fail; and teach people to plan before they spend) applies to
any pay-per-use resource, including cloud computing, third-party APIs and
build-system minutes. It does not depend on any particular provider or model.

It does have limits. Linking outcomes to requests is the hardest part, and may
be impractical for exploratory work whose value appears only much later. The
value rule requires judgment about whether an experiment "changed a decision."
And attribution adds a small overhead to every request. These costs are modest
compared with spending that is otherwise invisible.

## Conclusion

The industry's first instinct was to measure AI by how much of it people used.
That repeated a mistake our field has made before, and it was expensive. The
second instinct, capping spending, is better but still blunt. The question
worth answering is not how much an organization spends on AI, but what that
spending buys. Answering it takes no new technology, only discipline at two
levels: organizations recording what each request was for and whether anything
came of it, and individuals thinking before they ask. Organizations that build
that discipline will be able to spend generously where AI pays off and stop
paying where it doesn't. The rest will keep discovering their AI bills after
the money is gone.

## Takeaways

- AI spending escapes traditional cost controls because it is metered per
  request and spread across thousands of small decisions.
- Caps and dashboards show how much was spent, not what it bought; attribution
  by stage, owner, purpose and outcome answers the question that matters.
- Judge spending by one rule: it is justified if it served a user or changed a
  decision.
- Protect evaluation and experiments; eliminate retries, abandoned runs and
  usage-driven activity.
- Replace usage metrics with cost per outcome, and never rank people by
  consumption.
- Most waste is made of small, individually invisible decisions: a $5.60
  discarded build, repeated daily across 10,000 developers, becomes $14 million
  a year.
- Ideate and plan first, build piecemeal, and let AI shape ideas rather than
  replace the thinking.
- Treat tokens as money: train developers to use AI well, and show them what
  their usage costs.

## References

1. J. Mann, "Tokenminimizing: Meta Moves to Curb
   Employee AI Usage," *The Information*, June 2026. Summarized in "Meta Caps
   Internal AI Token Spending After Costs Approach Billions in 2026," MLQ, June
   13, 2026.
   <https://mlq.ai/news/meta-caps-internal-ai-token-spending-after-costs-approach-billions-in-2026/>
2. J. Kahn, "Tokenmaxxing is over. It was a flawed way
   to measure a company's ROI from AI," *Fortune*, May 28, 2026.
   <https://fortune.com/2026/05/28/tokenmaxxing-is-dead-companies-didnt-get-the-roi-from-ai-they-wanted-to-see/>
3. *Financial Times*, reporting on Amazon's
   token-usage leaderboards, 2026; as cited in [2].
4. "The tokenmaxxing era is over. Now companies are
   'tokenminimizing'," *The Next Web*, June 17, 2026.
   <https://thenextweb.com/news/tokenminimizing-companies-cap-employee-ai-spending>
5. Harness, *2026 State of AI in FinOps*, July 29,
   2026. Online survey of 700 engineering leaders and practitioners in the US,
   UK, France, Germany and India, conducted by Sapio Research, May-June 2026.
   <https://www.harness.io/resources/state-of-ai-in-finops-2026>
6. L. Bai, Z. Huang, X. Wang, J. Sun, R. Mihalcea, E.
   Brynjolfsson, A. Pentland and J. Pei, "How Do AI Agents Spend Your Money?
   Analyzing and Predicting Token Consumption in Agentic Coding Tasks,"
   arXiv:2604.22750, April 2026. <https://arxiv.org/abs/2604.22750>
7. "Meta killed employee AI token dashboard,"
   *Fortune*, April 9, 2026.
   <https://fortune.com/2026/04/09/meta-killed-employee-ai-token-dashboard/>
8. A. Polyzotis, "How we eliminated $1 million a year
   of wasted AI agent spend in one hour," Databricks Blog, September 1, 2026.
   <https://www.databricks.com/blog/how-we-eliminated-1-million-year-wasted-ai-agent-spend-one-hour>
9. METR, "Measuring the Impact of Early-2025 AI on
   Experienced Open-Source Developer Productivity," arXiv:2507.09089, July
   2025. <https://arxiv.org/abs/2507.09089>
10. FinOps Foundation, *State of FinOps 2026*, survey
    of 1,192 practitioners. <https://data.finops.org>
11. Anthropic, "Pricing," Claude Platform
    documentation, accessed October 11, 2026. Claude Opus 5.5: $4 per million
    input tokens, $20 per million output tokens, $0.20 per million cached input
    tokens. <https://platform.claude.com/docs/en/about-claude/pricing>
