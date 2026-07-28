import {
  RadialBarChart, RadialBar, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarRadiusAxis, Cell,
} from 'recharts'
import type { ScoreBreakdown } from '../lib/analysis'

export function ScoreGauge({ score, label }: { score: number; label?: string }) {
  const data = [{ name: label || 'score', value: score, fill: scoreColor(score) }]
  return (
    <div className="relative h-48 w-48">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={10} angleAxisId={0} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-slate-900 dark:text-white">{score}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{label || 'Overall'}</span>
      </div>
    </div>
  )
}

export function ScoreBars({ scores }: { scores: ScoreBreakdown[] }) {
  const data = scores.map((s) => ({ name: s.label, score: s.score, fill: scoreColor(s.score) }))
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(148 163 184 / 0.2)" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: 'rgb(100 116 139)' }} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'rgb(100 116 139)' }} width={110} />
        <Tooltip
          cursor={{ fill: 'rgb(148 163 184 / 0.1)' }}
          contentStyle={{ borderRadius: 12, border: '1px solid rgb(203 213 225)', fontSize: 12 }}
        />
        <Bar dataKey="score" radius={[0, 6, 6, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function ScoreRadar({ scores }: { scores: ScoreBreakdown[] }) {
  const data = scores.map((s) => ({ subject: s.label.split(' ')[0], score: s.score }))
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="rgb(148 163 184 / 0.3)" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'rgb(100 116 139)' }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar dataKey="score" stroke="#1866ec" fill="#1866ec" fillOpacity={0.3} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export function scoreColor(score: number): string {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#f59e0b'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

export function scoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Needs Work'
}
