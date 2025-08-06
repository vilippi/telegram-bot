import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';

export function parseCSV(buffer: Buffer): any[] {
    const content = buffer.toString('utf-8');
    return parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
}

export function parseXLSX(buffer: Buffer): any[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet, { defval: '' });
}
