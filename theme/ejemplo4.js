document.getElementById("generarPDF4").addEventListener("click", async function () {
    try {
        console.log("Iniciando generación del PDF...");

        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        console.log("PDF inicializado correctamente.");
        
        const page = pdfDoc.addPage([595, 842]); 
        const fontBoldItalic = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique); 
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        console.log("Fuentes cargadas correctamente.");
// ** Cargar imagen de fondo **
        const imageUrl = '3.png'; // Reemplaza con la URL o convierte tu imagen a base64.
        const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
        const image = await pdfDoc.embedPng(imageBytes); // Cambia a embedJpg si la imagen es JPG.
        const imageDims = image.scaleToFit(595, 842); // Escalar la imagen al tamaño A4.

// Dibujar la imagen como fondo
        page.drawImage(image, {
            x: 0,
            y: 50,
            width: imageDims.width,
            height: imageDims.height,
            opacity: 1,
        });

        console.log("Imagen de fondo añadida correctamente.");
        // Obtener los valores del formulario
        const solicitante4 = document.getElementById("solicitante4")?.value || "NOMBRE NO INGRESADO";
        const referencia4 = document.getElementById("referencia4")?.value || "REFERENCIA NO INGRESADA";
        const denominacion4 = document.getElementById("denominacion4")?.value || "DENOMINACIÓN NO INGRESADA";
        const codigo4 = document.getElementById("codigo4")?.value || "CÓDIGO NO INGRESADO";
        const fecha4 = document.getElementById("fecha4")?.value || "FECHA NO INGRESADA";

        console.log("Datos del formulario obtenidos:", {
            solicitante4,
            referencia4,
            denominacion4,
            codigo4,
            fecha4,
        });

        // Validar el campo de fecha
        const fechaRegex = /^([1-9]|[12][0-9]|3[01]) (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)$/i;
        console.log("Validando fecha:", fecha4);

        if (!fechaRegex.test(fecha4)) {
            alert("Por favor, ingresa una fecha válida en el formato 'día mes' (ejemplo: 26 diciembre).");
            return;
        }

        console.log("Fecha válida.");

        const margin = 50;
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

        centerText("MUNICIPALIDAD PROVINCIAL DE TRUJILLO", fontBold, 16, yPos);
        yPos -= 20;

        centerText("PLAN DE DESARROLLO TERRITORIAL DE TRUJILLO", fontBold, 14, yPos);
        yPos -= 40;

        page.drawText(`SOLICITANTES:  ${solicitante4}`, { x: margin, y: yPos, size: 13, font: fontBold });
        yPos -= 20;
        page.drawText(`REFERENCIA  :  ${referencia4}`, { x: margin, y: yPos, size: 13, font: fontBold });
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

        yPos -= 40;

        const certificationText = [
            "Que, el inmueble materia de la presente ", 
            `certificación, se encuentra ubicado en el Sector Catastral Nº 07 correspondiendo a una Lotización Irregular, y que cuenta a la fecha con información cartográfica preliminar a nivel de lotes, por lo tanto, no podemos certificar la base gráfica del inmueble; pero si su ubicación dentro del Catastro Urbano del Distrito de Trujillo, que corresponde al Código Catastral que los identifica y es:`,
        ];

       // const firstParagraphWithIndent = [
        //    "Que, a la fecha no se está emitiendo plano catastral,",  
          //  "por cuanto este trámite se encuentra en proceso de implementación, por lo tanto, no podemos certificar la base gráfica de los inmuebles, pero sí su ubicación dentro del Catastro Urbano del Distrito, que corresponde a los Códigos Catastrales que los identifica y son:"
        //];

        const firstLineIndent = margin + 263; 
        page.drawText(certificationText[0], {
            x: firstLineIndent,
            y: yPos,
            size: 13,
            font: fontRegular,
        });

        yPos -= 15;
        yPos = drawJustifiedText(certificationText.slice(1), page, fontRegular, 13, margin, yPos, maxWidth);
        
        const firstParagraphIndent = margin + 191;
        //page.drawText(firstParagraphWithIndent[0], {
          //  x: firstParagraphIndent,
           // y: yPos,
            //size: 13,
            //font: fontRegular,
        //});
        //yPos -= 15;
       // yPos = drawJustifiedText(firstParagraphWithIndent.slice(1), page, fontRegular, 13, margin, yPos, maxWidth);
        
        yPos -= 20;

          // Dibujar "DENOMINACIÓN" y "CÓDIGO CATASTRAL" en columnas separadas
page.drawText("DENOMINACIÓN", {
    x: margin,
    y: yPos,
    size: 13,
    font: fontBold,
    color: rgb(0, 0, 0),
});

// Línea de subrayado para "DENOMINACIÓN"
page.drawLine({
    start: { x: margin, y: yPos - 2 },
    end: { x: margin + 107, y: yPos - 2 }, // Ajusta la longitud de la línea
    thickness: 1,
    color: rgb(0, 0, 0),
});

page.drawText("CÓDIGO CATASTRAL", {
    x: margin + 343,
    y: yPos,
    size: 13,
    font: fontBold,
    color: rgb(0, 0, 0),
});

// Línea de subrayado para "CÓDIGO CATASTRAL"
page.drawLine({
    start: { x: margin + 343, y: yPos - 2 },
    end: { x: margin + 480, y: yPos - 2 }, // Ajusta la longitud de la línea
    thickness: 1,
    color: rgb(0, 0, 0),
});

        yPos -= 30;

    // Función para dividir el texto en líneas de máximo 6 palabras
    function splitTextByWords(text, maxWordsPerLine) {
        const words = text.split(" ");
        const lines = [];
        for (let i = 0; i < words.length; i += maxWordsPerLine) {
          lines.push(words.slice(i, i + maxWordsPerLine).join(" "));
        }
        return lines;
    }

    // Obtener líneas con máximo 6 palabras por línea
    const denominacionLines = splitTextByWords(denominacion4, 5);

    // Dibujar cada línea en el PDF con salto de línea automático
    denominacionLines.forEach((line, index) => {
        page.drawText(line, {
          x: margin,
          y: yPos - index * 15, // Mueve la posición hacia abajo en cada línea
          size: 13,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
    });

        // Ajustar yPos para seguir escribiendo después de todas las líneas de denominación
        yPos -= denominacionLines.length * 15;

        page.drawText(codigo4, {
            x: margin + 370,
            y: yPos + 18, 
            size: 13,
            font: fontBold,
            color: rgb(0, 0, 0),
        });

        yPos -= 50;
        page.drawText("NOTA:", { x: margin, y: yPos, size: 13, font: fontBold });
        yPos -= 20;
        const notes = [
            "• La presente no certifica propiedad ni posesión del inmueble, solamente la codificación que le corresponde por su ubicación espacial.",
            "",
            "• De conformidad con el Art 3° del Reglamento de la Ley N° 28294, la Zona de Ubicación del presente predio se considera como ZONA NO CATASTRADA.",
            "",
            "• Realizada la inscripción registral del inmueble, se nos hará llegar copia del asiento respectivo para validar el código catastral otorgado.",
            "",
            "• El certificado tiene validez por Doce (12) Meses."
        ];

        yPos = drawJustifiedText(notes, page, fontRegular, 13, margin + 3, yPos, maxWidth);

        page.drawText(`Trujillo, ${fecha4.replace(/ /, " de ")} del 2025`, {
            x: margin + 332,
            y: yPos = 230,    
            size: 13,
            font: fontBold,
        });

        yPos -= 100;
        page.drawText("C.c.\nArchivo", {
            x: margin,
            y: yPos,
            size: 11,
            font: fontRegular,
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Certificado_Codigo_Catastral.pdf";
        link.click();

        console.log("PDF generado y descargado correctamente.");
    } catch (error) {
        console.error("Error al generar el PDF:", error.message, error.stack);
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


