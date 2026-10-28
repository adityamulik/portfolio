---
title: When Metrics Become the Incident
date: "2026-10-28"
summary: Distributed systems run on metrics. A UUID in a Prometheus label made the write path cost grow with traffic until CPU throttling.
tags:
  - Prometheus
  - observability
  - cardinality
  - reliability
  - platform
---

Written for CACM Practice. The account is from the author's own experience.
No employer is named.

## Introduction

A large distributed system is operated through numbers. Latency, error rate,
queue depth, saturation: those are how on-call decides whether the platform is
healthy, whether a change is safe and whether last night's traffic was
ordinary. The numbers arrive as *metrics*, time series collected from every
process that matters and stored so they can be graphed and alerted on.

This article is about what happens when the instrumentation that is supposed to
make a system visible becomes a load of its own. The failure mode is not
mysterious. It has a name, *cardinality*, and a very common cause: putting an
unbounded identifier, often a UUID, into a Prometheus label. The write path
then pays for a new time series on every distinct value. As traffic rises, so
does the number of distinct values, so does the CPU spent ingesting them, and
the machines that were meant to watch the system start throttling.

We had that incident. The rest of this note is the mechanism, why it scaled
with traffic and what to refuse to put on a metric.

## Why large systems live on metrics

Once a system is bigger than a handful of processes, you cannot operate it by
reading logs in order. Requests fan out across services. Failures are partial.
The useful questions are aggregates: is this endpoint slower than last week,
is this dependency erroring, is this queue falling behind. Metrics answer those
questions cheaply, on a fixed scrape interval, without requiring you to
reconstruct every request.

Prometheus is the usual store for that data in the systems I work on. Each
sample is a number attached to a *metric name* and a set of *labels*, key-value
pairs that distinguish one series from another. `http_requests_total` with
`method="GET"` and `status="200"` is one time series. The same name with
`status="500"` is another. Queries then slice and aggregate across those
dimensions [1](#ref-1).

That model is why Prometheus is useful. It is also why a single careless label
can take the store down.

## Cardinality, in plain terms

*Cardinality* here means how many distinct time series a metric produces. Every
unique combination of label values is a separate series. Prometheus stores,
indexes and queries each of them independently. The project is explicit about
the cost: do not use labels for high-cardinality dimensions such as user IDs,
email addresses or other unbounded sets of values [2](#ref-2). Instrumentation
guidance is stricter still. Try to keep cardinality below ten. Investigate
anything that can grow past a hundred. The vast majority of metrics should have
no labels at all [3](#ref-3).

A bounded label is safe because its value set is small and known: HTTP method,
status class, a handful of named handlers. An unbounded label is a new series
for every distinct string you have ever seen. A UUID is the extreme case. It is
designed to be unique. Put it on a metric and you have promised Prometheus a
new series for every request, every entity, every write.

The official short version is the one worth remembering: Prometheus performance
almost always comes down to label cardinality [4](#ref-4).

## The incident

The writes into Prometheus included a UUID on the label set. I will not
reconstruct the metric name. The important fact is the identifier. Each write
was not an update to an existing series. It was a new series, because the UUID
had never been seen before and would never be seen again.

At low traffic this looks like nothing. A few extra series are cheap. The
dashboards still paint. The scrape still finishes. The mistake is invisible
precisely because the system is quiet.

Traffic is what turns it into an incident. Unique UUIDs arrive in proportion to
requests. The set of series in the head block grows with that rate, not with
the number of services or the number of endpoints. Ingest has to hash labels,
allocate, write the write-ahead log and keep an index that now contains
essentially one entry per request. CPU on the write path tracks traffic. That
is the signature that distinguished this from a generic "Prometheus is slow"
ticket: the pain was not a big query. It was the cost of accepting the next
sample, and it got worse as the business got busier.

## Why the CPU throttled

The processes doing that ingest ran with CPU limits, as they should. Kubernetes
enforces a container CPU limit through the Linux CFS quota: within each period
the group may use only so many microseconds of CPU, and once that quota is
gone the threads wait for the next period [5](#ref-5), [6](#ref-6). From
inside the container this does not look like a crash. It looks like the same
work taking longer, scrapes overlapping, queues growing and the kernel
reporting throttle time.

Throttling is easy to misread as "we need a bigger box." Sometimes you do.
Here the CPU was being spent on work that should not exist: indexing identifiers
that will never be queried as a dimension. Adding cores would have bought
time. It would not have changed the curve. Unique UUIDs per second still grow
with traffic. The write path still pays per series. A larger limit delays the
throttle. It does not remove the cause.

There is a second trap. The metrics system is how you notice saturation. When
the metrics system itself is the thing saturating, the graphs you trust start
to lag or go sparse at the same moment you need them. Observability is not
outside the system. It is another distributed system, with a write path, a
budget and a failure mode.

## What had to change

The fix is not a Prometheus flag. It is a rule about what a label is for.

A label is a dimension you will group or filter by later: method, status,
route template, region, a service name. It is not a join key. UUIDs, request
IDs, user IDs, raw URLs with path parameters and timestamps belong in logs and
traces, where a unique string is the point. They do not belong on the metric
that is trying to count or time the same events in aggregate [2](#ref-2),
[3](#ref-3).

In this incident that meant taking the UUID off the write. Client
instrumentation had to stop attaching it. Relabeling on the scrape or remote
write path had to drop it so a missed client could not put it back. After that,
series stopped being minted per request. Ingest CPU followed traffic the way
it is supposed to: more samples on a stable set of series, not more series.

Two checks belong next to that change, or the next UUID arrives in a different
label.

- Watch the number of active series, not only CPU. A cardinality problem shows
  up in series count before the box falls over.
- Review new metrics the way you review new indexes. If a label's value set is
  unbounded, it does not ship.

## What readers should do differently

If you run Prometheus in front of real traffic, the transferable practices are
small.

- **Treat cardinality as a production budget.** Series count is a capacity
  number, like disk or file descriptors. Graph it. Alert when it jumps.
- **Ban unbounded identifiers on labels.** UUID, request ID, user ID, email,
  session token, raw URL. Put those in logs and traces.
- **Prefer route templates to paths.** `/users/{id}` is a dimension.
  `/users/550e8400-e29b-41d4-a716-446655440000` is a series per user.
- **Drop at the edge if a client misbehaves.** Metric relabeling is a seatbelt
  for instrumentation you do not fully control.
- **Do not scale away a uniqueness bug.** If CPU tracks unique IDs, more CPU
  is a delay, not a fix.
- **Remember that throttling hides in latency.** A process at its CFS quota
  still looks "up." Check throttle metrics before you blame the application.

## Does it generalize?

Prometheus is specific. Cardinality is not. Any dimensional metrics store,
including the remote-write backends people put in front of Prometheus, charges
you per distinct label set. OpenTelemetry done carelessly will mint the same
explosion with a different name. The lesson is about the shape of the data, not
the logo on the scraper.

The other generalization is about traffic. Bugs that are linear in request
rate are quiet in development and violent in production. A UUID label is one
of those bugs. It will pass every local scrape. It will pass a staging
environment with a handful of users. It will fail at the moment the system is
doing the most valuable work, because that is when uniqueness arrives fastest.

Metrics are how large systems stay operable. They only stay cheap if the
dimensions stay bounded. The incident was not that we collected too many
numbers. It was that we taught the store a new name for every write, then asked
it to keep up as the writes multiplied.

## Takeaways

- Large distributed systems are operated through metrics. The metrics pipeline
  is part of the production system, not a sidecar to it.
- Prometheus cardinality is the number of distinct label sets. Performance is
  almost always that number.
- A UUID on a label creates a series per value. Traffic then creates series
  per request.
- Write-path CPU that rises with traffic, without a matching rise in useful
  dimensions, is a cardinality incident.
- Kubernetes CPU limits turn that extra work into throttling. More quota
  delays the failure. Removing the unbounded label removes it.
- Put unique identifiers in logs and traces. Keep metric labels bounded.

## References

1. <a name="ref-1"></a> Prometheus Authors, "Data model," Prometheus
   documentation.
   [https://prometheus.io/docs/concepts/data_model/](https://prometheus.io/docs/concepts/data_model/)
2. <a name="ref-2"></a> Prometheus Authors, "Metric and label naming," Prometheus
   documentation. Caution against labels for user IDs, email addresses and
   other unbounded values.
   [https://prometheus.io/docs/practices/naming/](https://prometheus.io/docs/practices/naming/)
3. <a name="ref-3"></a> Prometheus Authors, "Instrumentation," Prometheus
   documentation. Cardinality guidelines and the node_exporter scaling example.
   [https://prometheus.io/docs/practices/instrumentation/](https://prometheus.io/docs/practices/instrumentation/)
4. <a name="ref-4"></a> Prometheus Authors, "The Zen of Prometheus," Prometheus
   documentation. "Prometheus performance almost always comes down to one
   thing: label cardinality."
   [https://prometheus.io/docs/practices/the_zen/](https://prometheus.io/docs/practices/the_zen/)
5. <a name="ref-5"></a> Kubernetes Authors, "Resource Management for Pods and
   Containers," Kubernetes documentation. CPU limits as a kernel-enforced hard
   cap.
   [https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)
6. <a name="ref-6"></a> Linux Kernel Documentation, "CFS Bandwidth Control."
   Quota, period and throttled threads.
   [https://docs.kernel.org/scheduler/sched-bwc.html](https://docs.kernel.org/scheduler/sched-bwc.html)
