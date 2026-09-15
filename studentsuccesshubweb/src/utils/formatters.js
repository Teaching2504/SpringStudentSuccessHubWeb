export const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0 VNĐ';
  return Number(val).toLocaleString('vi-VN') + ' VNĐ';
};

export const formatDate = (val) => {
  if (!val) return 'N/A';
  try {
    const d = new Date(val);
    return isNaN(d.getTime()) ? val : d.toLocaleDateString('vi-VN');
  } catch {
    return val;
  }
};
