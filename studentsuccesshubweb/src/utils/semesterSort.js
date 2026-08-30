/**
 * Utility to sort semesters chronologically by Year then Semester:
 * HK1 (2023-2024) -> HK2 (2023-2024) -> HK3 (2023-2024)
 * -> HK1 (2024-2025) -> HK2 (2024-2025) -> HK3 (2024-2025)
 * -> HK1 (2025-2026) -> HK2 (2025-2026) -> HK3 (2025-2026)
 */
export const getSemesterOrderKey = (hk) => {
  if (!hk) return 0;
  const str = (typeof hk === 'string' ? hk : (hk.maHocKy || hk.tenHocKy || '')).toUpperCase();
  
  let hkNum = 1;
  if (str.includes('HK2') || str.includes('HỌC KỲ 2') || str.includes('KỲ 2')) hkNum = 2;
  else if (str.includes('HK3') || str.includes('HỌC KỲ 3') || str.includes('KỲ 3')) hkNum = 3;

  let year = 2023;
  if (hk && typeof hk === 'object' && hk.namHoc && hk.namHoc.length >= 4) {
    const y = parseInt(hk.namHoc.slice(0, 4), 10);
    if (!isNaN(y)) year = y;
  } else {
    const match = str.match(/20\d{2}/);
    if (match) {
      year = parseInt(match[0], 10);
    }
  }

  return year * 10 + hkNum;
};

export const sortSemesters = (list) => {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => getSemesterOrderKey(a) - getSemesterOrderKey(b));
};

export const sortSemestersAsc = sortSemesters;

