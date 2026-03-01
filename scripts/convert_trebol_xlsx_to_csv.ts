/**
 * Convierte un XLSX con hojas TREBOL y ASISTENCIA TREBO a CSV para importación.
 * Uso: npx ts-node scripts/convert_trebol_xlsx_to_csv.ts "ejemplo para subir.xlsx" 1
 */
import path from 'path';
import fs from 'fs';
import XLSX from 'xlsx';

function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function slugUsername(name: string): string {
  const base = normalizeName(name)
    .toLowerCase()
    .replace(/\s+/g, '.');
  return base || 'player';
}

const inputPath = process.argv[2] || 'ejemplo para subir.xlsx';
const seasonId = Number(process.argv[3] || 1);

const absPath = path.isAbsolute(inputPath)
  ? inputPath
  : path.join(process.cwd(), inputPath);

if (!fs.existsSync(absPath)) {
  console.error(`Archivo no encontrado: ${absPath}`);
  process.exit(1);
}

const wb = XLSX.readFile(absPath, { cellStyles: true });
const trebolName = wb.SheetNames.find(n => n.toLowerCase().includes('trebol')) || wb.SheetNames[0];
const asistenciaName = wb.SheetNames.find(n => n.toLowerCase().includes('asistencia')) || wb.SheetNames[1];

if (!trebolName || !asistenciaName) {
  console.error('No se encontraron las hojas requeridas.');
  process.exit(1);
}

const trebol = XLSX.utils.sheet_to_json(wb.Sheets[trebolName], { header: 1, defval: '' }) as any[][];
const asistenciaSheet = wb.Sheets[asistenciaName];
const asistencia = XLSX.utils.sheet_to_json(asistenciaSheet, { header: 1, defval: '' }) as any[][];

// Parse ranking (TREBOL)
let headerRowIndex = trebol.findIndex(r => String(r[0]).toUpperCase() === 'P' && String(r[1]).toUpperCase().includes('NOMBRE'));
if (headerRowIndex < 0) headerRowIndex = 1; // fallback

const rankingMap = new Map<string, { full_name: string; points: number }>();
for (let i = headerRowIndex + 1; i < trebol.length; i++) {
  const row = trebol[i];
  const name = String(row[1] || '').trim();
  if (!name) continue;
  const points = Number(row[4]) || 0; // columna PUNTOS
  rankingMap.set(name, { full_name: name, points });
}

// Parse asistencia (ASISTENCIA TREBO)
// Reglas: celdas pintadas = asistencia. Bonus semanal: 3 asistencias=500, 4 asistencias=1000.
const attendanceMap = new Map<string, { attendance_count: number; attendance_bonus_points: number }>();

const isGreen = (cell: any): boolean => {
  if (!cell || !cell.s || !cell.s.fgColor || !cell.s.fgColor.rgb) return false;
  const rgb = String(cell.s.fgColor.rgb).toUpperCase();
  return rgb.includes('00FF00') || rgb.includes('008000') || rgb.includes('00B050');
};

const attendanceHeader = asistencia[0] || [];
const fCols: number[] = [];
for (let c = 0; c < attendanceHeader.length; c++) {
  const v = String(attendanceHeader[c] || '').toUpperCase();
  if (v.startsWith('F')) fCols.push(c);
}

// Agrupar por semanas: 4 fechas por semana (F1..F4, F5..F8, ...)
const weekGroups: number[][] = [];
for (let i = 0; i < fCols.length; i += 4) {
  weekGroups.push(fCols.slice(i, i + 4));
}

for (let i = 2; i < asistencia.length; i++) {
  const row = asistencia[i];
  const name = String(row[0] || '').trim();
  if (!name) continue;

  let totalCount = 0;
  let bonusSum = 0;

  for (const group of weekGroups) {
    let weekCount = 0;
    for (const c of group) {
      const addr = XLSX.utils.encode_cell({ r: i, c });
      const cell = asistenciaSheet[addr];
      if (isGreen(cell)) {
        weekCount++;
        totalCount++;
      }
    }
    if (weekCount === 3) bonusSum += 500;
    if (weekCount >= 4) bonusSum += 1000;
  }

  attendanceMap.set(name, { attendance_count: totalCount, attendance_bonus_points: bonusSum });
}

// Merge
const allNames = new Set<string>([...rankingMap.keys(), ...attendanceMap.keys()]);
const usernameSet = new Set<string>();

const rows = Array.from(allNames).map(name => {
  const ranking = rankingMap.get(name);
  const attendance = attendanceMap.get(name);
  let username = slugUsername(name);
  let suffix = 2;
  while (usernameSet.has(username)) {
    username = `${slugUsername(name)}${suffix}`;
    suffix++;
  }
  usernameSet.add(username);

  return {
    username,
    full_name: name,
    password: 'changeme',
    role: 'user',
    is_player: 1,
    current_points: ranking?.points ?? 0,
    attendance_count: attendance?.attendance_count ?? 0,
    attendance_bonus_points: attendance?.attendance_bonus_points ?? 0,
    season_id: seasonId
  };
});

const outPath = path.join(process.cwd(), 'import_from_trebol.csv');
const header = Object.keys(rows[0] || {}).join(',');
const csvLines = [header, ...rows.map(r => Object.values(r).map(v => String(v).replace(/"/g, '""')).map(v => (v.includes(',') ? `"${v}"` : v)).join(','))];
fs.writeFileSync(outPath, csvLines.join('\n'), 'utf8');

console.log(`CSV generado: ${outPath}`);
console.log(`Jugadores: ${rows.length}`);
console.log(`Hoja ranking: ${trebolName} | Hoja asistencia: ${asistenciaName}`);
