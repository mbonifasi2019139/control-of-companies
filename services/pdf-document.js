"use strict";

const PDFDocument = require("pdfkit");
const fs = require("fs");

const pdfEmployees = (contentPDF) => {
    // recibimos los parametros que tiene los datos para crear el pdf
    let employeesCompany = contentPDF.employees;
    let company = contentPDF.company;

    // Creamos un directorio especifico para los pdfs que se vayan creando
    if (!fs.existsSync("./pdfs")) {
        fs.mkdirSync("./pdfs");
    }

    var createPDF = new Promise((resolve, reject) => {
        try {
            var doc = new PDFDocument();
            // creamos el pdf con el nombre de la empresa
            doc.pipe(fs.createWriteStream(`./pdfs/employees-${company}.pdf`));

            doc.font("Courier");

            /* Escribimos en el pdf*/
            doc.fontSize(12).text(`${company}\n\n`, {
                align: "center",
                underline: "underline",
            });

            doc.text(`empleados:\n`);

            for (const employee of employeesCompany) {
                // Destructuramos el JSON
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

            resolve("File created");
        } catch (error) {
            reject(error);
        }
    });

    return createPDF;
};

module.exports = { pdfEmployees };