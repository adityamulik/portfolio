---
title: Migrating a Live Event Stream to Kafka
date: "2026-10-11"
summary: Moving a business-critical messaging queue from a managed cloud service to a self-hosted cluster, without dropping an event.
tags:
  - Kafka
  - messaging
  - reliability
  - platform
---

Written for CACM Practice. The account is from the author's own experience.
No employer is named.

## Introduction

Some migrations can be done in the open, at noon, with everyone watching. This
was not one of them. The system I had to move carried the clock-in and
clock-out events of roughly three million people, and those events fed their
paychecks. If the migration dropped or duplicated events, people would be paid
wrongly. The work had to be invisible: no downtime, no lost events, nothing for
anyone to notice the next morning.

This article is about moving a live, business-critical message queue from a
managed cloud service to a self-hosted cluster, and doing it without
disruption. The headline reason for the move was cost and control, but the
interesting part is not the destination. It is what it takes to replace the
plumbing under a running, critical system while it keeps running, and why the
conventional way of describing such a project, "lift and shift," is exactly the
wrong way to think about it.

## The system, in plain terms

A *message queue* is a piece of infrastructure that moves events between
programs. One set of programs, the *producers*, put events in; another set, the
*consumers*, take them out. The queue sits between them so that producers never
have to wait for consumers, and a sudden burst of events is absorbed rather
than lost.

In this case the events were clock-in and clock-out records: each time an
employee started or ended a shift, an event was produced. Across roughly three
million employees, that is a continuous, high-volume stream, around 1,000
events per second at normal load. Consumers read those events through a data
pipeline that fed a fast in-memory cache (Memcached), from which the current
clock status of any employee could be looked up quickly. Downstream, that
status fed payroll.

The queue ran on a managed cloud service, Azure Service Bus, where the cloud
provider operates the infrastructure and bills for usage. The goal was to move
the same stream onto a self-hosted cluster running Apache Kafka, an open-source
queue the organization would run on its own hardware: cheaper at this scale,
and able to scale on our own terms. The plan was to migrate every producer and
every consumer onto the new Kafka queue.

## What was at stake

The stakes are the reason the project demanded discipline rather than speed.
The pay of roughly three million employees depended on this stream. A mistake
would not be an abstract outage; it would be wrong paychecks for real people.
That single fact shaped every decision that follows: it is why the timeline had
to be defended, why nothing could be assumed, and why the cutover was planned
to the minute.

## Why it was hard

Three things made this far harder than copying a queue from one place to
another.

**The system was old and fragile.** The original application was a legacy
system whose code had sat largely untouched for years. Moving off it was
inherently risky, and the risk was not hypothetical: the old setup had a
history of failures. We were paged for missed events and for latency spikes. A
system that already misbehaves under its own weight is a dangerous thing to
migrate, because during the cutover it is hard to tell a migration problem from
one of the system's ordinary bad days.

**Everything was live and connected.** This was not a self-contained service. A
set of producers wrote to the queue, and a set of consumers read from it
through the ingestion pipeline and the cache. All of them had to move without
the stream ever stopping, which meant coordinating across every team that owned
a producer or a consumer.

**Kafka had to be sized correctly in advance.** Kafka divides a stream into
*partitions*, parallel lanes that let many consumers read at once. The catch is
that the number of partitions for a topic is effectively fixed when the topic
is created; it is not something you can comfortably change later. Choose too
few and consumers fall behind, building up *consumer lag*, the growing delay
between an event being produced and being read. For a payroll stream, lag means
stale clock status. So the right partition count for a 1,000-events-per-second
workload had to be determined up front, by testing, rather than discovered in
production.

## What we did

The project came to me framed as a quick "lift and shift" on a short timeline.
It was not quick, and treating it as if it were was the first thing that had to
change.

### Pushing back on the timeline

Leadership wanted the move done immediately. I pushed back, because an
immediate cutover on a payroll-critical stream was a risk I was not willing to
take: a rushed mistake here meant real employees' paychecks. Rather than argue
in the abstract, I made the pushback concrete by producing a plan that showed
what the work actually involved and why it needed time. The plan, not the
protest, is what changed the timeline.

### The runbook and the plan

This was the first full migration runbook I had written. It laid out every
migration activity in order, the coordination each step needed across teams,
and a checklist that had to be satisfied before cutover. Three pieces of work
supported it:

- **Right-sizing the new clusters.** I ran performance testing on Kafka to
  determine the partition count a 1,000-TPS stream would need and the consumer
  lag to expect. I also sized a new cache cluster so that events would not be
  duplicated while the old and new systems ran side by side.
- **Observability first.** I stood up the monitoring and alerting layer before
  the cutover, including end-to-end tracing, so that even a single problem
  event could be followed through the system to see what went wrong. You cannot
  safely migrate what you cannot see.
- **Coordination and sign-off.** With many stakeholders across the producer and
  consumer teams, I coordinated the work against a single, definitive timeline
  and secured everyone's agreement before anything was touched.

### The backout plan

A safe cutover is one you can undo. The fallback was built in from the start:

- The old Azure Service Bus queue was kept running, in a soft-delete state, so
  the previous path stayed available.
- The cache was duplicated, with readers consuming from the new cluster while
  the old cache stayed intact.
- The new Kafka cluster ran in parallel with the old queue, so if anything went
  wrong we could fall back immediately.
- The playbook defined a rollback hierarchy: if we rolled back, every consumer
  would be told to roll back too, so no one was left reading from a cluster we
  had abandoned.

### The cutover

The cutover was scheduled deliberately for the overnight window, when load fell
from around 1,000 events per second to roughly 100. Migrating at the quietest
hour is a deliberate, repeatable choice: the less traffic in flight, the less
there is to go wrong, and the smaller the blast radius if something does.
Round-the-clock support was on hand with the playbook ready.

## What was non-obvious

The part that surprised me most, and the part I would warn a peer about, was
consumer lag. Going in, I did not know how it would behave under our real
workload, and it turned out to be the binding constraint. Because Kafka's
partition count is fixed at topic creation, the decision that most determines
whether your consumers keep up is one you make before you have run a single
real event through the system. That inverts the usual order of engineering:
normally you deploy, observe, and then tune. Here the most important tuning
decision had to be made in advance, from throughput measured in a test phase.
Getting the partition estimate right up front, rather than hoping to adjust it
later, was the key technical lesson of the project.

## Conventional wisdom: help or hindrance?

The conventional framing, "lift and shift," was actively misleading here. The
phrase suggests picking something up and setting it down unchanged. What this
actually was is a swap of the messaging substrate beneath a live, critical
stream, with every producer and consumer to be moved in coordination and no
tolerance for downtime. Calling that a lift-and-shift does not merely
understate the effort; it attaches a timeline the work cannot safely meet,
which is how critical migrations get rushed into failure. The useful signal for
a reader is this: when a migration is described as a simple lift-and-shift,
treat the description as a claim to verify, not a schedule to accept. The
conventional discipline that did serve well was the ordinary
reliability-engineering playbook, plan, test, observe, and keep a way back,
which is exactly what carried the project.

## Did it work?

Yes, and the measure of success is that nothing happened. There was no
downtime, because the cutover was placed in the low-traffic window by design.
There was no disruption to the service and no payroll impact. Monitoring and
alerting were in place throughout, with round-the-clock support standing by and
the playbook ready. The old Azure Service Bus queue sat in soft-delete as an
immediate fallback that was never needed. The events for all three million
employees, billions of events in total, migrated cleanly onto the new Kafka
cluster.

The strongest evidence that the approach was sound is the contrast with the
alternative that was proposed. An immediate lift-and-shift, on a stream with
this system's history of missed events and latency, carried out during normal
load with no rehearsed way back, would have put paychecks at risk. The
disciplined version cost more time up front and produced a cutover no one
noticed. That is the trade the article argues for: spend the time before the
cutover, so that nothing is spent cleaning up after it.

## What readers should do differently

For anyone facing a live migration of a critical system, the practices that
carried this one transfer directly:

- **Write the runbook, and plan for more than the happy path.** Enumerate the
  failure modes before the cutover, not during it.
- **Make coordination and communication the center of the work,** not an
  afterthought. On a system with many producers and consumers, the hardest part
  is people, not technology.
- **Build a real backout plan:** keep the old system running, run the new one
  in parallel, and define exactly how everyone rolls back together.
- **Stand up observability before you cut over,** including end-to-end tracing,
  so that a single bad event is visible.
- **Cut over at the lowest-traffic hour.** Less in flight means less to go
  wrong.
- **Size the irreversible parts in advance.** For Kafka, that means setting
  partition counts from measured throughput before the topic is created.
- **Defend the timeline with a plan, not a protest.** Leadership will accept a
  slower schedule when they can see what the work actually requires.
- **Don't assume; verify.** On a critical system, an unchecked assumption is
  how a smooth project becomes an incident.

## Does it generalize?

Some details are specific to this project: Kafka's partition model, the
Memcached caching layer, the clock-in and payroll context. But the approach
generalizes to almost any migration of a running, critical system, whatever the
technology. Draft the plan carefully and do not rush it. Make communication and
coordination the priority. Do not design only for the happy path; work through
every approach and look hard for what could go wrong. And respect time as a
resource: this kind of work cannot be done fast, and it has to be planned
properly, with runbooks and on-call guidelines in place before you begin. The
specific tools change from one migration to the next. The discipline does not.

Replacing the foundation of a system while people stand on it is never
glamorous work, and done well it is invisible, which is the whole point. The
reward for weeks of planning is that on the morning after the cutover, three
million people were paid correctly and no one knew anything had changed.
