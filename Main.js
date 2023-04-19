// Load pdfjs library
import pdfjsLib from 'pdfjs-dist';

// Load Tesseract.js library
import Tesseract from 'tesseract.js';

// Load xlsx library
import XLSX from 'xlsx';

// Load sample PDF file
import pdfFile from './example.pdf';

// Search for specific word
const searchTerm = 'example';

// Load PDF document
pdfjsLib.getDocument(pdfFile).promise.then(function(pdf) {
  // Initialize empty array to store extracted text
  const textArray = [];

  // Loop through each page of the PDF
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    // Get page object
    pdf.getPage(pageNum).then(function(page) {
      // Extract text from page
      page.getTextContent().then(function(textContent) {
        // Concatenate text from all text items on page
        const text = textContent.items.map(function(item) {
          return item.str;
        }).join('');

        // Perform OCR on text using Tesseract.js
        Tesseract.recognize(text).then(function(result) {
          // Search for specific word
          if (result.text.toLowerCase().includes(searchTerm)) {
            // Store OCR'd text in array
            textArray.push(result.text);
          }

          // If all pages have been processed, create Excel file
          if (textArray.length === pdf.numPages) {
            // Create workbook
            const workbook = XLSX.utils.book_new();

            // Create worksheet
            const worksheet = XLSX.utils.aoa_to_sheet(textArray);

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            // Save workbook as Excel file
            XLSX.writeFile(workbook, 'example.xlsx');
          }
        });
      });
    });
  }
});
