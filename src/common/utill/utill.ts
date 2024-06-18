import { unparse } from "papaparse";

export const exportToCsv = (data: any, fileName: string) => {
  const csv = unparse(data);
  const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(csvData);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatDate = (inputDate: string) => {
  const dateObject = new Date(inputDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formattedDate = `${dateObject.getDate()} ${
    monthNames[dateObject.getMonth()]
  } , ${dateObject.getFullYear()}`;
  return formattedDate;
};
