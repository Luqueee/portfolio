## One GPU, a real problem

During my internship at [NaN-tic](https://nan-tic.com), I worked on a question that became much more interesting than it first sounded: **how fast could a single NVIDIA A10 with 24 GB of VRAM serve Qwen3.8-27B for a real, tool-calling ERP workload, without making the agent less reliable?**

It started as “make the model quicker” and became weeks of experiments, profiling, and learning not to trust the first promising number. This is one of the projects I've enjoyed most: a concrete hardware limit, a useful application, and enough surprises to keep questioning my assumptions.

The repository is the record of that work. It contains the final serving configuration, Bash and Python tooling, research notes, and archived measurements—not a new model or my own inference runtime. The runtime is [llamAmpere](https://github.com/JakeATX/llamAmpere), a llama.cpp fork, built for the A10's SM86 architecture.

## Correctness before throughput

The quality test was a multi-step task against Tryton's mailing-message model. The agent had to interpret “published” as `state = 'sent'`, retrieve 38 Catalan and 38 Spanish messages, handle a search result with a count but no IDs, paginate correctly, and pair the messages across languages into a complete table without tool errors.

That task exposed the difference between a fast model and a useful agent. Qwen3.8-27B became the reference because it handled the workflow reliably. Quantization and decoding changes then had to be judged against that behavior, not just a tokens-per-second counter.

The [historical model survey](https://github.com/Luqueee/qwen38-a10-llamampere/blob/main/docs/research/a10-model-survey.md) records that exploration. Its earlier settings are not the final deployment: the configuration evolved as new measurements replaced earlier assumptions.

## Making experiments comparable

I built tooling to capture a real session and freeze its 15 inference requests. A replay sends the same requests directly to the model server, making configuration changes comparable without rerunning a changing ERP interaction.

The benchmark records request latency, prefill and decode timings, draft acceptance, GPU telemetry, and response hashes. Normalization preserves the answer, reasoning, and tool names and arguments while removing incidental response metadata. A faster run is not an equivalent result just because it generates fewer tokens.

The experiment tooling preserves the original Docker container, starts isolated variants, and restores the reference afterward. The end-to-end benchmark starts each variant cold, so slot state and caches do not silently give one candidate a head start. Other experiments use repeated or interleaved runs, including A/B/B/A comparisons.

This replay measures **the inference calls, not the execution time of ERP tools**. It is a controlled workload derived from a real task, not a fresh end-to-end validation of the agent under every configuration.

## What actually survived

Native MTP speculative decoding was the largest practical improvement. It drafts multiple tokens using the model's own MTP head and lets the target verify them. The project began around 24 tokens per second with a conservative setup; later replay experiments recorded roughly 75–82 decode tokens per second. Those observations describe the project's progression, not a controlled speedup ratio between identical configurations.

One especially useful result was simpler than a custom kernel: at temperature zero, setting the **target sampler's `top-k` to 1** reduced mean inference-replay time by about 7%. Across two runs per profile, all 15 normalized responses—including reasoning and tool arguments—remained identical. The draft sampler was left unchanged. That validates the recorded workload, not all prompts or positive-temperature sampling.

Other ideas did not earn their place. Raising the MTP `p_min` threshold failed to produce a useful latency reduction and changed some responses, including functional output. Moving draft verification to the GPU showed no meaningful win. Forcing a different IQ4_XS kernel route produced a borderline improvement, but generated-token counts and acceptance also changed; it was not enough evidence for a confident production decision.

Nsight profiling and an instrumented hybrid-verifier build helped investigate where time went. The hybrid experiment identified potentially GPU-safe rounds; it did not establish a deployed hybrid-verifier speedup. Recording these limits was as important as recording the wins.

## The final serving configuration

The documented final configuration runs the ATX IQ4_XS-M quantization of Qwen3.8-27B in one llamAmpere container, with two 81,920-token slots. It uses a `q8_0` K cache, a `turbo3` V cache, greedy sampling, and native MTP with up to seven draft tokens and `p_min = 0`.

Reasoning has a 512-token budget. That boundary matters: an earlier deployment demonstrated that unlimited reasoning could exhaust a request's output allowance and leave the visible answer empty. The final configuration keeps reasoning separate from the answer and lets clients choose their output limit.

The runtime commit, model revision, and model checksum are pinned. Access is restricted to the host loopback and Docker bridge with bearer authentication. The deployment file is a declarative reference specification, not an installer; weights, the draft-vocabulary map, and frozen request captures are host-side assets and are not published in the repository.

## What I took away

Performance work became much more satisfying once I could explain why a result was trustworthy—or why it wasn't. Draft acceptance, context growth, cache state, quantization, and sampling all mattered, and a higher peak throughput did not necessarily mean a faster or correct task.

These are measurements from one machine, often with only two runs per comparison, not claims of statistical significance. The archived experiments also used Spanish prompts; the repository later translated its embedded benchmark prompts to English, so fresh runs are not directly comparable to those archived measurements.

What I'm proud of is the combination: a usable serving configuration, tooling that made decisions less subjective, and a record of the experiments that didn't work as well as the ones that did.

[Read the final configuration](https://github.com/Luqueee/qwen38-a10-llamampere/blob/main/docs/final-configuration.md) · [Explore the experiments](https://github.com/Luqueee/qwen38-a10-llamampere/blob/main/docs/benchmarking/experiments.md) · [Inspect the recorded replay comparison](https://github.com/Luqueee/qwen38-a10-llamampere/blob/main/results/experiments/decode-e2e/20261002-100400/comparison.json)
