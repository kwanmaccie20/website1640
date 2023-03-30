import { ExportToCsv } from "export-to-csv";

const csvOptions = (columns) => ({
  fieldSeparator: ",",
  quoteStrings: '"',
  decimalSeparator: ".",
  showLabels: true,
  useBom: true,
  useKeysAsHeaders: true,
  title: "Exported",
  // headers: columns.map((c) => c.header),
});

export const csvExporter = (columns) => new ExportToCsv(csvOptions(columns));
