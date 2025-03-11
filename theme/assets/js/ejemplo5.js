document.getElementById("generarPDF5").addEventListener("click", async function () {
    try {
        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]);

        const fontBoldItalic = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique); 
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
            
        
// ** Cargar imagen de fondo **
        const imageUrl = 'assets/img/pruebas/3.png'; 
        const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
        const image = await pdfDoc.embedPng(imageBytes); // Cambia a embedJpg si la imagen es JPG.
        const imageDims = image.scaleToFit(595, 842); // Escalar la imagen al tamaño A4.

// Dibujar la imagen como fondo
        page.drawImage(image, {
            x: 0,
            y: 50,
            width: imageDims.width,
            height: imageDims.height,
            opacity: 1, // Ajusta la opacidad del fondo.
        });

        console.log("Imagen de fondo añadida correctamente.");
        // Márgenes y posiciones iniciales
        const margin = 65;
        const maxWidth = page.getWidth() - 2 * margin;
        let yPos = page.getHeight() - margin;

        const centerText = (text, font, size, y) => {
            const textWidth = font.widthOfTextAtSize(text, size);
            const x = (page.getWidth() - textWidth) / 2;
            page.drawText(text, {
                x,
                y,
                size,
                font,
                color: rgb(0, 0, 0),
            });
        };



        // Encabezado
        centerText("MUNICIPALIDAD PROVINCIAL DE TRUJILLO", fontBold, 17, yPos);
        yPos -= 30;
        centerText("PLAN DE DESARROLLO TERRITORIAL DE TRUJILLO", fontBold, 13.5, yPos);
        yPos -= 60;

        // Obtener los valores del formulario
        const solicitante5 = document.getElementById("solicitante5").value || "NOMBRE NO INGRESADO";
        const referencia5 = document.getElementById("referencia5").value || "REFERENCIA NO INGRESADA";
        const sublote5 = document.getElementById("sublote5").value || "SUBLOTE NO INGRESADO";
        const denominacion5 = document.getElementById("denominacion5").value || "DENOMINACION NO INGRESADA";
        const catastral5 = document.getElementById("catastral5").value || "NCATASTRAL NO INGRESADA";
        
        const fechaInput = document.getElementById("fecha5").value;
        let fechaFormateada = "FECHA NO INGRESADA";
        
        if (fechaInput) {
            const partesFecha = fechaInput.split("-"); // Divide la fecha "YYYY-MM-DD"
const dia = parseInt(partesFecha[2], 10); // Obtiene el día
const mes = parseInt(partesFecha[1], 10) - 1; // Obtiene el mes (restamos 1 porque el array de meses inicia en 0)

const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

const mesTexto = meses[mes];
fechaFormateada = `Trujillo, ${dia} de ${mesTexto} del 2025`;

        }
        

        



        page.drawText(`SOLICITANTE :      ${solicitante5}`, { x: margin, y: yPos, size: 13, font: fontBold });
        yPos -= 20;
        page.drawText(`REFERENCIA :       ${referencia5}`, { x: margin, y: yPos, size: 13, font: fontBold });
        yPos -= 30;

  // Escribir el texto en negrita cursiva
        centerText("CERTIFICADO DE CÓDIGO CATASTRAL Nº 112 – 2025", fontBoldItalic, 16, yPos);

        // Calcular el ancho del texto para subrayarlo correctamente
        const textWidth = fontBoldItalic.widthOfTextAtSize("CERTIFICADO DE CÓDIGO CATASTRAL Nº 111 – 2024", 16);
        const startX = (page.getWidth() - textWidth) / 2;
        const endX = startX + textWidth;

        // Dibujar la línea debajo del texto
        page.drawLine({
            start: { x: startX, y: yPos - 2 }, // Un poco más abajo del texto
            end: { x: endX, y: yPos - 2 },
            thickness: 1, // Grosor del subrayado
            color: rgb(0, 0, 0),
        });

        yPos -= 40; // Ajustar la posición para el siguiente contenido


        // 1️⃣ Primero, definir las funciones
function drawJustifiedMixedText(parts, page, fontSize, x, y, maxWidth) {
    let currentX = x;
    let currentY = y;
    let currentLine = "";
    let currentLineParts = [];

    parts.forEach(part => {
        const words = part.text.split(" ");
        words.forEach(word => {
            const testLine = currentLine + word + " ";
            const testWidth = part.font.widthOfTextAtSize(testLine, fontSize);

            if (testWidth > maxWidth && currentLine.length > 0) {
                drawJustifiedLine(currentLineParts, page, fontSize, x, currentY, maxWidth);
                currentY -= fontSize + 2;
                currentLine = word + " ";
                currentLineParts = [{ text: word, font: part.font }];
            } else {
                currentLine = testLine;
                currentLineParts.push({ text: word, font: part.font });
            }
        });
    });

    if (currentLineParts.length > 0) {
        drawJustifiedLine(currentLineParts, page, fontSize, x, currentY, maxWidth, true);
        currentY -= fontSize + 2;
    }

    return currentY;
}

function drawJustifiedLine(lineParts, page, fontSize, x, y, maxWidth, lastLine = false) {
    const fullLineText = lineParts.map(part => part.text).join(" ");
    if (lineParts.length === 1 || lastLine) {
        let currentX = x;
        lineParts.forEach(part => {
            page.drawText(part.text + " ", {
                x: currentX,
                y,
                size: fontSize,
                font: part.font
            });
            currentX += part.font.widthOfTextAtSize(part.text + " ", fontSize);
        });
        return;
    }

    const totalSpacing = maxWidth - lineParts.reduce((sum, part) => sum + part.font.widthOfTextAtSize(part.text + " ", fontSize), 0);
    const spaceBetweenWords = totalSpacing / (lineParts.length - 1);

    let currentX = x;
    lineParts.forEach((part, index) => {
        page.drawText(part.text, {
            x: currentX,
            y,
            size: fontSize,
            font: part.font
        });

        if (index < lineParts.length - 1) {
            currentX += part.font.widthOfTextAtSize(part.text + " ", fontSize) + spaceBetweenWords;
        }
    });
}

// 2️⃣ Ahora, definir los textos y valores
const certificationText = [
    "Que, el lote de terreno irregular Acumulado",
    `denominado SUBLOTE ${sublote5}, ubicados en ${sublote5}- ${denominacion5} de esta Ciudad,`
];

const textBold = `NO`;    
const textBold2 = `ACUMULACION,`;
const textAfterBold = `está Codificado por no contar con documentación que sustente la`; 
const textAfterBold2 = "perteneciendo éste a Tres (03) Unidades Catastrales, la misma que se encuentra ubicada en el ";
const textAfterBold3 = `Sector Catastral ${catastral5}`

const firstParagraphWithIndent = [
    "Que, el Sistema de Codificación Catastral que",  
    "manejamos, identifica a los lotes Urbanos del Distrito, por lo tanto, no están considerados los predios Acumulados sin sustentación alguna, materia de la presente Certificación, dentro de este sistema, correspondiéndole por lo tanto a esta solicitud:"
];

// 3️⃣ Dibujar los textos en el PDF
const firstLineIndent = margin + 206;
page.drawText(certificationText[0], {
    x: firstLineIndent,
    y: yPos,
    size: 13,
    font: fontRegular,
});
yPos -= 15;

// Dividir el texto en partes con fuentes distintas
const parts = [
    { text: certificationText[1], font: fontRegular },
    { text: textBold, font: fontBold },
    { text: textAfterBold, font: fontRegular },
    { text: textBold2, font: fontBold },
    { text: textAfterBold2, font: fontRegular },
    { text: textAfterBold3, font: fontBold }
];

// Llamar a la función para justificar y aplicar negrita
yPos = drawJustifiedMixedText(parts, page, 13, margin, yPos, maxWidth);

// Continuar con el siguiente párrafo
yPos -= 15;
const firstParagraphIndent = margin + 199;
page.drawText(firstParagraphWithIndent[0], {
    x: firstParagraphIndent,
    y: yPos,
    size: 13,
    font: fontRegular,
});
yPos -= 15;

// Justificar el resto del texto manteniendo el margen
yPos = drawJustifiedText(firstParagraphWithIndent.slice(1), page, fontRegular, 13, margin, yPos, maxWidth);

        
        yPos -= 50;

        centerText("CERTIFICADO NEGATIVO DE CATASTRO", fontBold, 18, yPos);
        yPos -= 40;

        // Nota con bullet point
        page.drawText("NOTA:", { x: margin, y: yPos, size: 13, font: fontBold });
        yPos -= 40;
        page.drawText("• El certificado tiene validez por Doce (12) Meses.", { x: margin + 20, y: yPos, size: 13, font: fontBold });
        yPos -= 40;

        // Fecha
        page.drawText(fechaFormateada, {
            x: margin + 280,
            y: yPos,
            size: 13,
            font: fontBold,
        });
        yPos -= 60;

        // Pie de página
        page.drawText("C.c.\nArchivo", { x: margin, y: yPos, size: 11, font: fontRegular });

        // Guardar el PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Certificado_Codigo_Catastral.pdf";
        link.click();
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        alert("Ocurrió un error al generar el PDF. Verifica los datos ingresados e inténtalo nuevamente.");
    }
});


function drawJustifiedText(lines, page, font, fontSize, x, y, maxWidth) {
    lines.forEach(line => {
        const words = line.split(" ");
        let currentLine = "";
        let yStart = y;

        words.forEach((word, index) => {
            const testLine = currentLine + word + " ";
            const testWidth = font.widthOfTextAtSize(testLine, fontSize);
            if (testWidth > maxWidth && currentLine.length > 0) {
                justifyLine(currentLine.trim(), page, font, fontSize, x, yStart, maxWidth);
                yStart -= fontSize + 2;
                currentLine = word + " ";
            } else {
                currentLine = testLine;
            }
        });

        if (currentLine.length > 0) {
            justifyLine(currentLine.trim(), page, font, fontSize, x, yStart, maxWidth, true);
            yStart -= fontSize + 2;
        }
        y = yStart;
    });
    return y;
}

function justifyLine(line, page, font, fontSize, x, y, maxWidth, lastLine = false) {
    const words = line.split(" ");
    if (words.length === 1 || lastLine) {
        page.drawText(line, { x, y, size: fontSize, font });
        return;
    }

    const totalSpacing = maxWidth - font.widthOfTextAtSize(line, fontSize);
    const spaceBetweenWords = totalSpacing / (words.length - 1);

    let currentX = x;
    words.forEach((word, index) => {
        page.drawText(word, { x: currentX, y, size: fontSize, font });
        if (index < words.length - 1) {
            currentX += font.widthOfTextAtSize(word + " ", fontSize) + spaceBetweenWords;
        }
    });
}
