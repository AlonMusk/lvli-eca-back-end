import * as XLSX from 'xlsx';

// 导入Excel并返回数据
export function importExcel(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const result = jsonData.map((row: any, index: number) => ({
        id: index + 1,
        name: row[0],
        age: row[1],
      }));

      resolve(result);
    };

    reader.onerror = () => {
      reject(new Error('导入失败'));
    };

    reader.readAsArrayBuffer(file);
  });
}