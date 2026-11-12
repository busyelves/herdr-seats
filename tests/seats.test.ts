import { expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'

// The seat command and Herdr are answered beneath the plugin; nothing runs.
// The command is the plugin's own bin/seat, wherever the plugin is installed.
const isSeat = (s: string) => s.endsWith('/bin/seat')
let SEAT = ''
function rig(on: On, opts: { herdr?: boolean; app?: boolean; name?: string; tokens?: number; sendFails?: boolean } = {}) {
  const runs: { argv: readonly string[]; stdin?: string; timeoutMs?: number }[] = []
  const tools: string[] = []
  const usage = { tokens: opts.tokens ?? 100_000 }
  mock.store(on)
  mock.env(on, { ...(opts.herdr === false ? { HOME: '/h' } : { HOME: '/h', HERDR_ENV: '1', HERDR_PANE_ID: 'w1:p2' }),
    ...(opts.app ? { HC_TERMINAL_ID: 't7' } : {}) })
  on('tool.register', ($, e) => {
    tools.push(e.name)
    return { value: { tool: `mcp__seats__${e.name}` } } as never
  })
  on('process.run', ($, e) => {
    runs.push({ argv: e.argv, stdin: e.init?.stdin, timeoutMs: e.init?.timeoutMs })
    if (isSeat(e.argv[0])) SEAT = e.argv[0]
    const stdout = e.argv[1] === 'agent' && e.argv[2] === 'get'
      ? JSON.stringify({ result: { agent: { name: opts.name ?? 'app-cc-orch-replies' } } })
      : e.argv[0] === '/h/.local/bin/hc' && e.argv[1] === 'get'
        ? JSON.stringify({ labels: { 'seat.name': opts.name ?? 'app-cc-orch-replies' } })
      : e.argv[1] === 'name' ? 'app-cc-lead · w1:p2 · Herdr name set; Claude name: /rename app-cc-lead-2610-0546'
      : isSeat(e.argv[0]) ? `ran ${e.argv[1]}` : ''
    if (opts.sendFails && isSeat(e.argv[0]) && e.argv[1] === 'send')
      return { value: { exitCode: 2, stdout: '', stderr: "seat: 'lead' is ambiguous", isStdoutTruncated: false,
        isStderrTruncated: false } } as never
    return { value: { exitCode: 0, stdout, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } } as never
  })
  on('session.usage', () => ({ value: { startedAt: 0, context: { tokens: usage.tokens, window: 1_000_000 } } }) as never)
  on('session.id', () => ({ value: 'sess-1' }) as never)
  on('session.start', ($, e) => e as never)
  on('turn.complete', () => ({ text: '' }) as never)
  return { runs, tools, usage }
}

const start = ($: any) => $.session.start({ cwd: '/w/app-work', surface: 'terminal' } as never)
const turn = ($: any) => $.turn.complete({ reason: 'answer', answer: 'ok', durationMs: 1, isAborted: false, turnId: 't' } as never)
const leadSends = (runs: { argv: readonly string[] }[]) =>
  runs.filter(r => isSeat(r.argv[0]) && r.argv[1] === 'send' && r.argv[2] === 'lead')

test('in a Herdr pane the six seat tools are registered', async ($, on) => {
  const { tools } = rig(on)
  await start($)
  expect(tools).toEqual(['seat_open', 'seat_name', 'seat_send', 'seat_list', 'seat_handover', 'seat_close'])
})

test('outside Herdr nothing is registered', async ($, on) => {
  const { tools } = rig(on, { herdr: false })
  await start($)
  expect(tools).toEqual([])
})

test('seat_open runs the seat command with the brief on stdin', async ($, on) => {
  const { runs } = rig(on)
  await start($)
  const r = await $.tool.call({ tool: 'mcp__seats__seat_open', role: 'orch', word: 'replies', brief: 'Build P1.',
    about: 'plan-live-replies' } as never)
  expect((r as { result?: unknown }).result).toBe('ran open')
  const run = runs.find(x => x.argv[1] === 'open')!
  expect(run.argv).toEqual([SEAT, 'open', 'orch', 'replies', '--about', 'plan-live-replies', '--brief', '-'])
  expect(run.stdin).toBe('Build P1.')
})

test('each turn publishes the context on the pane', async ($, on) => {
  const { runs, usage } = rig(on)
  await start($)
  await turn($)
  usage.tokens = 101_400
  await turn($)
  usage.tokens = 455_000
  await turn($)
  const reports = runs.filter(x => x.argv.includes('report-metadata')).map(x => x.argv.slice(-3).join(' '))
  expect(reports).toEqual(['seat_context=100k --token seat_context_label=ctx 100k',
    'seat_context=101k --token seat_context_label=ctx 101k', 'seat_context=455k --token seat_context_label=● ctx 455k'])
})

test('in a Herdr app terminal the seat tools come up and the session, context and turn go on its labels', async ($, on) => {
  const { runs, tools } = rig(on, { herdr: false, app: true, tokens: 302_400 })
  await start($)
  await turn($)
  const labels = runs.filter(x => x.argv[0] === '/h/.local/bin/hc').map(x => x.argv)
  expect(labels[0]).toEqual(['/h/.local/bin/hc', 'label', 't7', 'agent.session=claude:sess-1'])
  expect(labels[1].slice(0, 5)).toEqual(['/h/.local/bin/hc', 'label', 't7', 'agent.session=claude:sess-1', 'agent.ctx=302400'])
  expect(String(labels[1][5])).toMatch(/^agent\.turn_at=\d+$/)
  expect(runs.some(x => x.argv.includes('report-metadata'))).toBe(false)
  expect(tools).toEqual(['seat_open', 'seat_name', 'seat_send', 'seat_list', 'seat_handover', 'seat_close'])
})

test('an orchestrator past 350k tells its Lead once, and again past 450k', async ($, on) => {
  const { runs, usage } = rig(on, { tokens: 360_000 })
  await start($)
  await turn($)
  await turn($)
  expect(leadSends(runs).length).toBe(1)
  usage.tokens = 455_000
  await turn($)
  await turn($)
  expect(leadSends(runs).length).toBe(2)
  expect(String(leadSends(runs)[1]!.argv)).toContain('lead')
})

test('an alert the Lead cannot get is retried each turn and told to the owner once', async ($, on) => {
  const { runs } = rig(on, { tokens: 360_000, sendFails: true })
  await start($)
  await turn($)
  await turn($)
  expect(leadSends(runs).length).toBe(2)
  const notes = runs.filter(r => r.argv[0] === 'herdr' && r.argv[1] === 'notification')
  expect(notes.length).toBe(1)
  expect(String(notes[0]!.argv)).toContain("Could not tell the Lead: seat: 'lead' is ambiguous")
})

test('seat_open and seat_handover pass a named model and effort', async ($, on) => {
  const { runs } = rig(on)
  await start($)
  await $.tool.call({ tool: 'mcp__seats__seat_open', role: 'orch', word: 'replies', model: 'fable', effort: 'medium' } as never)
  expect(runs.find(x => x.argv[1] === 'open')!.argv).toEqual(
    [SEAT, 'open', 'orch', 'replies', '--model', 'fable', '--effort', 'medium'])
  await $.tool.call({ tool: 'mcp__seats__seat_handover', target: 'lead', pointer: 'Resume.', model: 'opus', effort: 'high' } as never)
  expect(runs.find(x => x.argv[1] === 'handover')!.argv).toEqual(
    [SEAT, 'handover', 'lead', '--pointer', '-', '--timeout', '420', '--model', 'opus', '--effort', 'high'])
})

test('seat_handover sends the pointer on stdin and stays inside the ten-minute run limit', async ($, on) => {
  const { runs } = rig(on)
  await start($)
  const r = await $.tool.call({ tool: 'mcp__seats__seat_handover', target: 'drafts', pointer: 'Resume by reading x.',
    close: true } as never)
  expect((r as { result?: unknown }).result).toBe('ran handover')
  const run = runs.find(x => x.argv[1] === 'handover')!
  expect(run.argv).toEqual([SEAT, 'handover', 'drafts', '--pointer', '-', '--timeout', '420', '--close'])
  expect(run.stdin).toBe('Resume by reading x.')
  expect(run.timeoutMs!).toBeLessThanOrEqual(600_000)
})

test('a Lead past 350k does not message itself', async ($, on) => {
  const { runs } = rig(on, { tokens: 380_000, name: 'app-cc-lead' })
  await start($)
  await turn($)
  expect(leadSends(runs).length).toBe(0)
})

test("a subagent's turn neither reports nor alerts", async ($, on) => {
  const { runs } = rig(on, { tokens: 400_000 })
  await start($)
  await $.turn.complete({ reason: 'answer', answer: 'ok', durationMs: 1, isAborted: false, turnId: 't',
    agentId: 'a1' } as never)
  expect(runs.length).toBe(0)
})

test('seat_name sets the Herdr name, then queues /rename for when the turn ends', async ($, on) => {
  const { runs } = rig(on)
  const clock = mock.clock(on)
  const renames: unknown[] = []
  on('command.run', ($, e) => {
    renames.push(e)
    return { text: '' } as never
  })
  await start($)
  const r = await $.tool.call({ tool: 'mcp__seats__seat_name', role: 'lead' } as never)
  expect(String((r as { result?: unknown }).result)).toContain('app-cc-lead')
  expect(runs.find(x => x.argv[1] === 'name')!.argv).toEqual([SEAT, 'name', 'lead'])
  expect(renames.length).toBe(0)
  await clock.advance(100)
  expect(renames).toEqual([expect.objectContaining({ command: 'rename', args: 'app-cc-lead-2610-0546' })])
})

test('in the app an orchestrator past 350k tells its Lead, its name read from its labels', async ($, on) => {
  const { runs, usage } = rig(on, { herdr: false, app: true, tokens: 360_000 })
  await start($)
  await turn($)
  await turn($)
  expect(leadSends(runs).length).toBe(1)
  expect(runs.some(r => r.argv[0] === '/h/.local/bin/hc' && r.argv[1] === 'get' && r.argv[2] === 't7')).toBe(true)
  usage.tokens = 455_000
  await turn($)
  expect(leadSends(runs).length).toBe(2)
  expect(runs.some(r => r.argv[0] === 'herdr')).toBe(false)
})

test('in the app a Lead past 350k does not message itself', async ($, on) => {
  const { runs } = rig(on, { herdr: false, app: true, tokens: 380_000, name: 'app-cc-lead' })
  await start($)
  await turn($)
  expect(leadSends(runs).length).toBe(0)
})

test('in the app an alert the Lead cannot get reaches the owner through alerter, detached', async ($, on) => {
  const { runs } = rig(on, { herdr: false, app: true, tokens: 360_000, sendFails: true })
  await start($)
  await turn($)
  await turn($)
  const notes = runs.filter(r => r.argv[0] === '/bin/sh')
  expect(notes.length).toBe(1)
  expect(notes[0]!.argv[2]).toContain('--sender dev.herdr.app')
  expect(notes[0]!.argv[2]).toMatch(/ & else osascript/)
  expect(notes[0]!.argv.slice(3)).toEqual(['/h/.local/bin/alerter', 'app-cc-orch-replies at 360k context',
    "Could not tell the Lead: seat: 'lead' is ambiguous", 't7'])
  expect(runs.some(r => r.argv[0] === 'herdr')).toBe(false)
})
