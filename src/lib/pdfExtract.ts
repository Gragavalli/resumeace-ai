import type { ResumeData } from '../types/resume'

export interface ExtractedText {
  text: string
  wordCount: number
  fileName: string
}

export async function extractTextFromPdf(file: File): Promise<ExtractedText> {
  const arrayBuffer = await file.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)
  const text = parsePdfText(bytes)
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  return { text, wordCount, fileName: file.name }
}

// Minimal PDF text extractor: reads text-showing operators (Tj, TJ, ', ") from the content streams.
function parsePdfText(bytes: Uint8Array): string {
  let text = ''
  const latin1 = new TextDecoder('latin1')
  const raw = latin1.decode(bytes)

  // Extract content streams between "stream" and "endstream"
  const streamRegex = /stream\r?\n([\s\S]*?)endstream/g
  let m: RegExpExecArray | null
  while ((m = streamRegex.exec(raw)) !== null) {
    let stream = m[1]
    // Try to decompress FlateDecode streams
    if (/\/FlateDecode/.test(raw.slice(Math.max(0, m.index - 200), m.index))) {
      try {
        const compressed = stringToBytes(stream)
        const decompressed = inflate(compressed)
        stream = latin1.decode(decompressed)
      } catch {
        // keep original stream if decompression fails
      }
    }
    text += extractTextOperators(stream) + '\n'
  }

  // If no streams found, try raw text extraction
  if (!text.trim()) {
    text = extractTextOperators(raw)
  }

  return decodePdfEncoding(text).replace(/\f/g, '\n').trim()
}

function extractTextOperators(stream: string): string {
  const out: string[] = []
  // Match (text) Tj  ,  [(a) -10 (b)] TJ  ,  (text) '  ,  (text) "
  const tjRegex = /\((?:[^()\\]|\\.)*\)\s*Tj/g
  const tjArrRegex = /\[(?:\((?:[^()\\]|\\.)*\)|[^\]])*\]\s*TJ/g
  const tickRegex = /\((?:[^()\\]|\\.)*\)\s*'/g
  const dqRegex = /\((?:[^()\\]|\\.)*\)\s*"/g

  const extractParens = (s: string) => {
    const parts: string[] = []
    const re = /\((?:[^()\\]|\\.)*\)/g
    let mm: RegExpExecArray | null
    while ((mm = re.exec(s)) !== null) {
      parts.push(mm[0].slice(1, -1))
    }
    return parts.join('')
  }

  for (const re of [tjRegex, tickRegex, dqRegex]) {
    let mm: RegExpExecArray | null
    while ((mm = re.exec(stream)) !== null) {
      out.push(extractParens(mm[0]))
      out.push('\n')
    }
  }
  let mm: RegExpExecArray | null
  while ((mm = tjArrRegex.exec(stream)) !== null) {
    out.push(extractParens(mm[0]))
  }
  return out.join(' ')
}

function stringToBytes(s: string): Uint8Array {
  const arr = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) arr[i] = s.charCodeAt(i) & 0xff
  return arr
}

// Decode PDF string escape sequences and basic WinAnsiEncoding
function decodePdfEncoding(s: string): string {
  return s
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
}

// Raw inflate implementation for FlateDecode (zlib wrapper → DEFLATE)
function inflate(data: Uint8Array): Uint8Array {
  // zlib header: 2 bytes (CMF, FLG). Skip if present.
  let start = 0
  if (data.length >= 2 && (data[0] & 0x0f) === 8) {
    start = 2 // skip zlib header
  }
  return inflateRaw(data.subarray(start))
}

function inflateRaw(input: Uint8Array): Uint8Array {
  const output: number[] = []
  let pos = 0
  const readBit = (() => {
    let bitBuf = 0
    let bitCnt = 0
    return () => {
      if (bitCnt === 0) {
        bitBuf = input[pos++] ?? 0
        bitCnt = 8
      }
      const b = bitBuf & 1
      bitBuf >>= 1
      bitCnt--
      return b
    }
  })()

  const readBits = (n: number) => {
    let v = 0
    for (let i = 0; i < n; i++) v |= readBit() << i
    return v
  }

  // Huffman tables
  const codeLengthOrder = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]

  const buildHuff = (lengths: number[]) => {
    const blCount: number[] = []
    for (const l of lengths) blCount[l] = (blCount[l] || 0) + 1
    blCount[0] = 0
    const nextCode: number[] = []
    let code = 0
    const maxBits = Math.max(...lengths, 0)
    for (let bits = 1; bits <= maxBits; bits++) {
      code = (code + (blCount[bits - 1] || 0)) << 1
      nextCode[bits] = code
    }
    const table: { code: number; len: number; sym: number }[] = []
    for (let n = 0; n < lengths.length; n++) {
      const len = lengths[n]
      if (len !== 0) {
        table.push({ code: nextCode[len], len, sym: n })
        nextCode[len]++
      }
    }
    return table
  }

  const decodeHuff = (table: { code: number; len: number; sym: number }[]) => {
    let code = 0
    let len = 0
    for (;;) {
      code = (code << 1) | readBit()
      len++
      const entry = table.find((e) => e.len === len && e.code === code)
      if (entry) return entry.sym
      if (len > 16) throw new Error('inflate: bad huffman code')
    }
  }

  const lenBase = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258]
  const lenExtra = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
  const distBase = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577]
  const distExtra = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]

  let final = 0
  while (!final) {
    final = readBit()
    const type = readBits(2)
    if (type === 0) {
      // stored
      pos = Math.ceil(pos / 8) * 8 || pos
      const len = (input[pos] ?? 0) | ((input[pos + 1] ?? 0) << 8)
      pos += 4
      for (let i = 0; i < len; i++) output.push(input[pos++] ?? 0)
      continue
    }
    if (type === 1) {
      // fixed huffman
      const litLens = new Array(288).fill(0)
      for (let i = 0; i < 144; i++) litLens[i] = 8
      for (let i = 144; i < 256; i++) litLens[i] = 9
      for (let i = 256; i < 280; i++) litLens[i] = 7
      for (let i = 280; i < 288; i++) litLens[i] = 8
      const distLens = new Array(30).fill(5)
      const litTab = buildHuff(litLens)
      const distTab = buildHuff(distLens)
      decodeBlock(litTab, distTab)
      continue
    }
    if (type === 2) {
      // dynamic huffman
      const hlit = readBits(5) + 257
      const hdist = readBits(5) + 1
      const hclen = readBits(4) + 4
      const clLens = new Array(19).fill(0)
      for (let i = 0; i < hclen; i++) clLens[codeLengthOrder[i]] = readBits(3)
      const clTab = buildHuff(clLens)
      const allLens: number[] = []
      while (allLens.length < hlit + hdist) {
        const sym = decodeHuff(clTab)
        if (sym < 16) allLens.push(sym)
        else if (sym === 16) {
          const rep = readBits(2) + 3
          const prev = allLens[allLens.length - 1] ?? 0
          for (let i = 0; i < rep; i++) allLens.push(prev)
        } else if (sym === 17) {
          const rep = readBits(3) + 3
          for (let i = 0; i < rep; i++) allLens.push(0)
        } else if (sym === 18) {
          const rep = readBits(7) + 11
          for (let i = 0; i < rep; i++) allLens.push(0)
        }
      }
      const litTab = buildHuff(allLens.slice(0, hlit))
      const distTab = buildHuff(allLens.slice(hlit))
      decodeBlock(litTab, distTab)
      continue
    }
    throw new Error('inflate: invalid block type')
  }

  function decodeBlock(litTab: { code: number; len: number; sym: number }[], distTab: { code: number; len: number; sym: number }[]) {
    for (;;) {
      const sym = decodeHuff(litTab)
      if (sym < 256) {
        output.push(sym)
      } else if (sym === 256) {
        break
      } else {
        const li = sym - 257
        const len = lenBase[li] + readBits(lenExtra[li])
        const dsym = decodeHuff(distTab)
        const dist = distBase[dsym] + readBits(distExtra[dsym])
        const start = output.length - dist
        for (let i = 0; i < len; i++) output.push(output[start + i] ?? 0)
      }
    }
  }

  return new Uint8Array(output)
}

// Heuristic: convert extracted PDF text into a resume data object (best-effort)
export function textToResumeData(text: string): ResumeData {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const lower = text.toLowerCase()
  void lower
  const data: ResumeData = {
    personal: {
      fullName: lines[0] || '',
      title: lines[1] || '',
      email: (text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)?.[0] || ''),
      phone: (text.match(/(\+?\d[\d\s\-().]{7,}\d)/)?.[0] || '').trim(),
      location: '',
      website: '',
      linkedin: (text.match(/linkedin\.com\/[^\s)]+/i)?.[0] || ''),
      github: (text.match(/github\.com\/[^\s)]+/i)?.[0] || ''),
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    targetRole: '',
  }

  // Skills line heuristic: find a line after "skills" heading
  const skillsIdx = lines.findIndex((l) => /^skills?$/i.test(l))
  if (skillsIdx >= 0 && lines[skillsIdx + 1]) {
    const skillLine = lines[skillsIdx + 1]
    const skillNames = skillLine.split(/[,;·|/•\t]/).map((s) => s.trim()).filter(Boolean)
    data.skills = skillNames.slice(0, 20).map((name, i) => ({
      id: `sk-${i}`,
      name,
      level: 'Intermediate' as const,
    }))
  }

  // Education heuristic
  const eduIdx = lines.findIndex((l) => /^education$/i.test(l))
  if (eduIdx >= 0) {
    for (let i = eduIdx + 1; i < Math.min(eduIdx + 6, lines.length); i++) {
      const l = lines[i]
      if (/^(experience|skills|projects|certifications?|languages?)$/i.test(l)) break
      if (l.length > 3) {
        data.education.push({
          id: `ed-${data.education.length}`,
          institution: l,
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          gpa: '',
          description: '',
        })
      }
    }
  }

  return data
}
