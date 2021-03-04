"use strict";

const PDFDocument = require("pdfkit");
const doc = new PDFDocument();
const fs = require("fs");
const { clear } = require("console");

function createPDF(contentPDF) {
    let employeesCompany = contentPDF.employees;
    let company = contentPDF.company;
    try {
        // We are creating a directory for pdfs if does not exists
        if (!fs.existsSync("./pdfs")) {
            fs.mkdirSync("./pdfs");
        }

        // Create a pdf
        doc.pipe(fs.createWriteStream(`./pdfs/Employees-${company}.pdf`));

        doc.font("Courier");

        /* We are setting the text*/
        doc.fontSize(12).text(`${company}\n\n`, {
            align: "center",
            underline: "underline",
        });

        doc.text(`empleados:\n`);

        for (const employee of employeesCompany) {
            let { name, lastname, position, department } = employee;
            doc.text(
                `
                nombre: ${name}
                apellido: ${lastname}
                posicion: ${position}
                departamento: ${department}
            `, {
                    lineBreak: true,
                    align: "left",
                }
            );
        }

        doc.end();
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = { createPDF };