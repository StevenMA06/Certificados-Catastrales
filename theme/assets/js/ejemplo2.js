document.getElementById("generarPDF2").addEventListener("click", async function () {
    try {
        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]);

        const fontBoldItalic = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique); 
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
            
        
// ** Cargar imagen de fondo **
        const imageUrl = 'assets/img/pruebas/3.png'; // Reemplaza con la URL o convierte tu imagen a base64.
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
        const solicitante2 = document.getElementById("solicitante2").value || "NOMBRE NO INGRESADO";
        const referencia2 = document.getElementById("referencia2").value || "REFERENCIA NO INGRESADA";
        
        const contenido2 = document.getElementById("contenido").value || "CONTENIDO NO INGRESADO";
        const nota2 = document.getElementById("nota").value || "NOTA NO INGRESADA";
        const firmaSeleccionada2 = document.getElementById("firmaSeleccionada2")?.value || "Sin firma seleccionada";


        const fechaInput = document.getElementById("fecha2").value;
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
        




        console.log("Datos del formulario obtenidos:", {
            solicitante2,
            referencia2,
            contenido,
            nota,
            fecha2,
            firmaSeleccionada2

        });
        // Obtener la firma seleccionada
        try {
            // Cargar la imagen de la firma seleccionada
            const firmaBytes = await fetch(firmaSeleccionada2).then(res => res.arrayBuffer());
            const firmaImg = await pdfDoc.embedPng(firmaBytes); // Usa embedJpg si es JPG

            // Ajustar tamaño y posición de la firma en el PDF
            const firmaWidth = 100;  // Ancho en píxeles
            const firmaHeight = 50;  // Alto en píxeles

            page.drawImage(firmaImg, {
                x: 300,  // Ajusta la posición horizontal
                y: 110,  // Ajusta la posición vertical (debe estar en la parte baja del documento)
                width: firmaWidth,
                height: firmaHeight,
            });

            console.log("Firma añadida correctamente.");
        } catch (error) {
            console.error("Error al cargar la firma:", error.message);
        }

        page.drawText(`SOLICITANTE :      ${solicitante2}`, { x: margin, y: yPos, size: 13, font: fontBold });
        yPos -= 20;
        page.drawText(`REFERENCIA :       ${referencia2}`, { x: margin, y: yPos, size: 13, font: fontBold });
        yPos -= 30;

  // Escribir el texto en negrita cursiva
centerText("CERTIFICADO DE CÓDIGO CATASTRAL Nº 112 – 2024", fontBoldItalic, 16, yPos);

// Calcular el ancho del texto para subrayarlo correctamente
const textWidth = fontBoldItalic.widthOfTextAtSize("CERTIFICADO DE CÓDIGO CATASTRAL Nº 112 – 2024", 16);
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


        // Texto justificado con sangría
        const certificationText = [
            `Que, el terreno identificado como`,
            `${contenido2}.`,
        ];
        const firstParagraphWithIndent = [
            `Que, el Sistema de Codificación Catastral`,
            `que manejamos, identifica a los lotesUrbanos del Distrito, por lo tanto,${nota2}`,
        ];
        const firstLineIndent = margin + 270; 
        page.drawText(certificationText[0], {
            x: firstLineIndent,
            y: yPos,
            size: 13,
            font: fontRegular,
        });

        yPos -= 15;
        yPos = drawJustifiedText(certificationText.slice(1), page, fontRegular, 13, margin, yPos, maxWidth);

        const firstParagraphIndent = margin + 225;
        page.drawText(firstParagraphWithIndent[0], {
            x: firstParagraphIndent,
            y: yPos,
            size: 13,
            font: fontRegular,
        });
        yPos -= 15;
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

            x: margin + 275,
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
