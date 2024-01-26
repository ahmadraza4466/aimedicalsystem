"use client";

import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { BiDownArrowAlt } from "react-icons/bi";
import React from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { saveAs } from "file-saver";

// A function to create a PDF document from the data
const createPdf = async (messages: { content: string }[]) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Load the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Add a new page
  const page = pdfDoc.addPage();

  // Set the font size and line height
  const fontSize = 11;
  const lineHeight = 20;

  // Set the initial coordinates
  let x = 50;
  let y = page.getHeight() - 50;

  // Write the title
  page.drawText("AiBot Chat", {
    x,
    y,
    size: fontSize + 4,
    font: helveticaFont,
  });

  // Move to the next line
  y -= lineHeight + 10;

  // Loop through the data and write each employee's name
  messages.map((message, i) => {
    page.drawText(`${i % 2 === 0 ? "User" : "Assistant"}: ${message.content}`, {
      x,
      y,
      size: fontSize,
      font: helveticaFont,
      maxWidth: 500,
      wordBreaks: [" "],
    });

    // Move to the next line
    y -= lineHeight;
  });

  // Save the PDF document as a blob
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });

  return blob;
};

const DownloadPDF = ({ messages }: { messages: { content: string }[] }) => {
  const [blob, setBlob] = React.useState<Blob>();
  const handleDownload = async () => {
    const blob = await createPdf(messages);
    setBlob(blob);
    saveAs(blob!, "messages.pdf");
  };

  return (
    <Tooltip showArrow content="Download as pdf">
      <Button
        isIconOnly
        size="sm"
        variant="bordered"
        className="fixed right-4 top-20 text-2xl border-primary"
        onClick={handleDownload}
      >
        <BiDownArrowAlt className="" />
      </Button>
    </Tooltip>
  );
};

export default DownloadPDF;
