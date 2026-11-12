import type { EngineInterface, Register, ToolCallResult } from 'claude-code'

// The seat layer's Claude front end. Inside a Herdr pane it registers the seat tools,
// each a thin call to the `seat` command, and after every main-loop turn it publishes
// the context size on the pane (`seat_context`) and, for an orchestrator, tells the
// repo's Lead once per threshold. Nothing here spends model tokens but the tools.
// The seat command ships with this plugin, in bin/seat.

const ALERTS = [350_000, 450_000]
const OWNER_NOTICE = 500_000
const HANDOVER_MS = 540_000

const TOOLS = [
  {
    name: 'seat_open',
    description:
      'Open a new seat (a Claude session in a Herdr pane beside this one) named by the seat law ' +
      '<repo>-cc-<role>[-<word>], optionally sending its first message. Use for every new orchestrator or ' +
      'Lead successor; implementers are subagents of their orchestrator, never a pane. Never assemble herdr commands for this.',
    inputSchema: {
      type: 'object',
      properties: {
        role: { type: 'string', enum: ['orch', 'lead', 'impl'] },
        word: { type: 'string', description: "one word for the run, from the tracker's name (orch requires it)" },
        brief: { type: 'string', description: 'first message, the dispatch; the header is added' },
        about: { type: 'string', description: 'tracker name for the message header' },
        successor: { type: 'boolean', description: 'name it <name>-next while the old seat is alive' },
        plan: { type: 'string', enum: ['a', 'b'], description: "Claude plan: a (claude) or b (a second account launched as claude-b, if installed); default: this seat's" },
        model: { type: 'string', description: "model alias or ID (opus, fable, sonnet, claude-opus-5-5); pass it only when the owner names one; default Opus 5.5" },
        effort: { type: 'string', enum: ['low', 'medium', 'high', 'xhigh', 'max'], description: 'pass it only when the owner names one; default high' },
      },
      required: ['role'],
    },
  },
  {
    name: 'seat_name',
    description:
      'Name this seat by the seat law, in Herdr and in Claude: role lead gives <repo>-cc-lead, role orch with ' +
      "its run word gives <repo>-cc-orch-<word>. Run it first when you take a role in a pane nobody named " +
      '(the Claude name follows when this turn ends).',
    inputSchema: {
      type: 'object',
      properties: {
        role: { type: 'string', enum: ['lead', 'orch', 'impl'] },
        word: { type: 'string', description: "one word for the run (orch requires it); none for lead" },
      },
      required: ['role'],
    },
  },
  {
    name: 'seat_send',
    description:
      'Send a message to a live seat by full name, run word or role ("lead"). Adds the ' +
      '"<repo> · <tracker> · from <you>" header; refuses a seat sitting at an approval prompt.',
    inputSchema: {
      type: 'object',
      properties: {
        target: { type: 'string' },
        text: { type: 'string' },
        about: { type: 'string', description: 'tracker name for the header' },
      },
      required: ['target', 'text'],
    },
  },
  {
    name: 'seat_list',
    description: "List this repo's live seats: name, state, context size, pane.",
    inputSchema: { type: 'object', properties: { all: { type: 'boolean', description: 'every repo' } } },
  },
  {
    name: 'seat_handover',
    description:
      'Hand a seat over to a fresh successor: opens it beside the seat, sends the resume pointer the seat ' +
      'printed at /seat-handover and gives it the name. A Lead stays as <name>-advisor (one advisor at a time; ' +
      'an idle earlier one is closed); any other seat closes once the successor settles. A seat may hand itself over.',
    inputSchema: {
      type: 'object',
      properties: {
        target: { type: 'string' },
        pointer: { type: 'string', description: 'the resume pointer text' },
        close: { type: 'boolean', description: 'close the old seat (the default except for a Lead; for a Lead, no advisor)' },
        keep: { type: 'boolean', description: 'keep the old seat as <name>-advisor (the default for a Lead)' },
        plan: { type: 'string', enum: ['a', 'b'], description: "Claude plan; default: the old seat's" },
        model: { type: 'string', description: "model alias or ID for the successor (opus, fable, claude-opus-5-5); pass it only when the owner names one; default Opus 5.5" },
        effort: { type: 'string', enum: ['low', 'medium', 'high', 'xhigh', 'max'], description: 'pass it only when the owner names one; default high' },
      },
      required: ['target', 'pointer'],
    },
  },
  {
    name: 'seat_close',
    description: "Close a seat's pane; refuses a working seat unless force.",
    inputSchema: {
      type: 'object',
      properties: { target: { type: 'string' }, force: { type: 'boolean' } },
      required: ['target'],
    },
  },
] as const

async function seatRun($: EngineInterface, bin: string, argv: string[], stdin?: string, timeoutMs = 120_000) {
  return $.process.run([bin, ...argv], { stdin, timeoutMs })
}

async function answer($: EngineInterface, bin: string, argv: string[], stdin?: string,
  timeoutMs?: number): Promise<ToolCallResult> {
  const r = await seatRun($, bin, argv, stdin, timeoutMs)
  const text = [r.stdout.trim(), r.stderr.trim()].filter(Boolean).join('\n') || `seat ${argv[0]} exited ${r.exitCode}`
  return r.exitCode === 0 ? { result: text } : { result: text, isError: true }
}

/** Sets labels on this session's Herdr app terminal; a failure only loses one update. */
async function label($: EngineInterface, hc: string, terminal: string, pairs: string[]) {
  try { await $.process.run([hc, 'label', terminal, ...pairs], { timeoutMs: 5_000 }) } catch { /* the next turn labels again */ }
}

/** This seat's address: the Herdr TUI pane's name, or the app terminal's seat.name label. */
async function seatName($: EngineInterface, pane: string, terminal: string, hc: string): Promise<string> {
  const r = pane
    ? await $.process.run(['herdr', 'agent', 'get', pane], { timeoutMs: 5_000 })
    : await $.process.run([hc, 'get', terminal, '--json'], { timeoutMs: 5_000 })
  try {
    const got = JSON.parse(r.stdout)
    return (pane ? got.result.agent.name : got.labels?.['seat.name']) ?? ''
  } catch { return '' }
}

/** Tells the owner: Herdr's notification in the TUI; in the app, macOS under Herdr's icon, as the agents list does. */
async function notify($: EngineInterface, pane: string, terminal: string, title: string, body: string) {
  if (pane) {
    await $.process.run(['herdr', 'notification', 'show', title, '--body', body, '--sound', 'request'], { timeoutMs: 5_000 })
    return
  }
  // alerter waits for a click; detached, so the turn never waits on it.
  const alerter = `${(await $.env.get('HOME')) ?? ''}/.local/bin/alerter`
  // Without alerter (brew install vjeantet/tap/alerter), a plain macOS notification.
  await $.process.run(['/bin/sh', '-c', 'if [ -x "$0" ]; then "$0" --title "$1" --message "$2" --group "seats-$3" ' +
    '--sender dev.herdr.app --sound default --timeout 600 >/dev/null 2>&1 & else osascript -e "on run argv" ' +
    '-e "display notification (item 2 of argv) with title (item 1 of argv) sound name \\"default\\"" -e "end run" "$1" "$2"; fi',
    alerter, title, body, terminal], { timeoutMs: 5_000 })
}

/** A tool argument as the command line takes it; absent, empty. */
const str = (v: unknown) => (v === undefined || v === null ? '' : String(v))

// The reason travels with the refusal, so nobody re-runs the command in Bash to find it.
const failed = (_$: unknown, _e: unknown, next: { error?: { kind?: string; message?: string } }) =>
  ({ deny: `seats: the seat command could not run (${next?.error?.message ?? next?.error?.kind ?? 'no reason given'})` })

export const register: Register = on => {
  let seatBin = ''
  let pane = ''
  let reported = -1
  // In the Herdr app the session runs in a herdr-core terminal: its labels carry the session,
  // its context and its last turn, which the app's agents list reads.
  let terminal = ''
  let hc = ''

  on('session.start', async ($, e, next) => {
    terminal = (await $.env.get('HC_TERMINAL_ID')) ?? ''
    if (terminal) {
      hc = `${(await $.env.get('HOME')) ?? ''}/.local/bin/hc`
      await label($, hc, terminal, [`agent.session=claude:${await $.session.id()}`])
    }
    // Seat tools in a Herdr TUI pane, or in a Herdr app terminal (the seat command works in both).
    if ((await $.env.get('HERDR_ENV')) !== '1' && !terminal) return next(e)
    pane = (await $.env.get('HERDR_ENV')) === '1' ? (await $.env.get('HERDR_PANE_ID')) ?? '' : ''
    seatBin = `${$.plugin.root}/bin/seat`
    for (const spec of TOOLS) await $.tool.register({ ...spec, isDeferred: false })
    return next(e)
  })

  const opt = (flag: string, value: unknown) => (str(value) ? [flag, str(value)] : [])

  on('tool.call', { tool: 'mcp__seats__seat_open' }, ($, e) =>
    answer($, seatBin, ['open', str(e.role), ...(str(e.word) ? [str(e.word)] : []), ...opt('--about', e.about),
      ...(e.successor ? ['--successor'] : []), ...opt('--plan', e.plan), ...opt('--model', e.model),
      ...opt('--effort', e.effort), ...(str(e.brief) ? ['--brief', '-'] : [])], str(e.brief))).catch(failed)

  on('tool.call', { tool: 'mcp__seats__seat_name' }, async ($, e) => {
    const r = await seatRun($, seatBin, ['name', str(e.role), ...(str(e.word) ? [str(e.word)] : [])])
    const text = [r.stdout.trim(), r.stderr.trim()].filter(Boolean).join('\n')
    if (r.exitCode !== 0) return { result: text || 'seat name failed', isError: true }
    const name = r.stdout.trim().split(' · ')[0] ?? ''
    // The Claude name is the seat's dated title, which never moves; the Herdr name is its address.
    const title = /\/rename (\S+)/.exec(r.stdout)?.[1] ?? name
    // A slash command cannot run inside a call the turn waits on; queued, it runs when the turn ends.
    if (title) $.clock.after(50, () => $.command.run({ command: 'rename', args: title }))
    return { result: `${name} · Herdr name set; the Claude name is set to ${title} when this turn ends` }
  }).catch(failed)

  on('tool.call', { tool: 'mcp__seats__seat_send' }, ($, e) =>
    answer($, seatBin, ['send', str(e.target), '-', ...opt('--about', e.about)], str(e.text))).catch(failed)

  on('tool.call', { tool: 'mcp__seats__seat_list' }, ($, e) =>
    answer($, seatBin, ['list', ...(e.all ? ['--all'] : [])])).catch(failed)

  on('tool.call', { tool: 'mcp__seats__seat_handover' }, ($, e) =>
    // process.run allows ten minutes at most and refuses a longer timeout outright; the settle wait
    // is capped below it so the whole handover returns inside.
    answer($, seatBin, ['handover', str(e.target), '--pointer', '-', '--timeout', '420', ...(e.close ? ['--close'] : []),
      ...(e.keep ? ['--keep'] : []), ...opt('--plan', e.plan), ...opt('--model', e.model), ...opt('--effort', e.effort)],
      str(e.pointer), HANDOVER_MS)).catch(failed)

  on('tool.call', { tool: 'mcp__seats__seat_close' }, ($, e) =>
    answer($, seatBin, ['close', str(e.target), ...(e.force ? ['--force'] : [])])).catch(failed)

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    if ((!pane && !terminal) || e.agentId) return done
    const tokens = (await $.session.usage()).context.tokens ?? 0
    // A turn ends on an answer, which read the cache: the app counts the cache from here.
    if (terminal) await label($, hc, terminal, [`agent.session=claude:${await $.session.id()}`, `agent.ctx=${tokens}`, `agent.turn_at=${Date.now()}`])
    const k = Math.round(tokens / 1000)
    if (pane && k !== reported) {
      reported = k
      // A Herdr TUI sidebar can show the label; its marker lets a config colour 350k orange and 450k red.
      // (The app's agents list colours the same lines from the agent.ctx label.)
      const mark = tokens >= 450_000 ? '● ' : tokens >= 350_000 ? '◐ ' : ''
      await $.process.run(['herdr', 'pane', 'report-metadata', pane, '--source', 'seats',
        '--token', `seat_context=${k}k`, '--token', `seat_context_label=${mark}ctx ${k}k`], { timeoutMs: 5_000 })
    }
    const crossed = [...ALERTS, OWNER_NOTICE].filter(t => tokens >= t)
    if (crossed.length === 0) return done
    const key = `alerted:${await $.session.id()}`
    const sent = ((await $.store.get(key)) as number[] | undefined) ?? []
    const due = crossed.filter(t => !sent.includes(t))
    if (due.length === 0) return done
    const name = await seatName($, pane, terminal, hc)
    if (!/-orch(-|\d|$)/.test(name)) return done
    const top = Math.max(...due)
    if (top >= OWNER_NOTICE) {
      await notify($, pane, terminal, `${name} at ${k}k context`, 'Past 500k and not yet handed over.')
      await $.store.set(key, [...sent, ...due])
      return done
    }
    const ask = top >= 450_000
      ? `${name} is at ${k}k context, past the firm line. Have it run /seat-handover at its next boundary.`
      : `${name} is at ${k}k context. Decide: finish its remainder in this seat, or hand over at its next boundary.`
    const r = await seatRun($, seatBin, ['send', 'lead', '-', '--about', 'context', '--draft-wait', '20'], ask, 30_000)
    if (r.exitCode === 0) {
      await $.store.set(key, [...sent, ...due])
      return done
    }
    // The send is retried every turn; the owner hears once per line that the Lead has not.
    const failKey = `alertFailed:${await $.session.id()}`
    const told = ((await $.store.get(failKey)) as number[] | undefined) ?? []
    if (!told.includes(top)) {
      const why = (r.stderr.trim() || r.stdout.trim()).split('\n')[0] || `seat send exited ${r.exitCode}`
      await notify($, pane, terminal, `${name} at ${k}k context`, `Could not tell the Lead: ${why}`)
      await $.store.set(failKey, [...told, top])
    }
    return done
  })
}
