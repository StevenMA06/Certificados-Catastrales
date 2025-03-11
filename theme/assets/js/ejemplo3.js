document.getElementById("generarPDF3").addEventListener("click", async function () {
    try {
        console.log("Iniciando generación del PDF...");

        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        console.log("PDF inicializado correctamente.");
        
        const page = pdfDoc.addPage([595, 842]); 
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        console.log("Fuentes cargadas correctamente.");
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
        // Obtener los valores del formulario
        const solicitante3 = document.getElementById("solicitante3")?.value || "NOMBRE NO INGRESADO";
        const referencia3 = document.getElementById("referencia3")?.value || "REFERENCIA NO INGRESADA";
        const denominacion3 = document.getElementById("denominacion3")?.value || "DENOMINACIÓN NO INGRESADA";
        const codigo3 = document.getElementById("codigo3")?.value || "CÓDIGO NO INGRESADO";

        const firmaSeleccionada3 = document.getElementById("firmaSeleccionada3")?.value || "Sin firma seleccionada";
        const fechaInput = document.getElementById("fecha3").value;
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
            solicitante3,
            referencia3,
            denominacion3,
            codigo3,
            fecha3,
            firmaSeleccionada3
        });
        try {
            // Cargar la imagen de la firma seleccionada
            const firmaBytes = await fetch(firmaSeleccionada3).then(res => res.arrayBuffer());
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

        // Validar el campo de fecha
        

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

        centerText("MUNICIPALIDAD PROVINCIAL DE TRUJILLO", fontBold, 18, yPos);
        yPos -= 20;

        centerText("PLAN DE DESARROLLO TERRITORIAL DE TRUJILLO", fontBold, 13.5, yPos);
        yPos -= 40;

        page.drawText(`SOLICITANTES:  ${solicitante3}`, { x: margin, y: yPos, size: 13, font: fontBold });
        yPos -= 20;
        page.drawText(`REFERENCIA  :  ${referencia3}`, { x: margin, y: yPos, size: 13, font: fontBold });
        yPos -= 30;

        centerText("CERTIFICADO DE CÓDIGO CATASTRAL Nº 120 – 2025", fontBold, 14, yPos);
        yPos -= 40;

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
    "Que el Centro Histórico, donde se encuentra el inmueble",
    "materia de la presente certificación, se encuentra ubicado en el"
];

const textBold = `Sector Catastral Nº 16,`;    
const textBold2 = ``;
const textAfterBold = `y no cuenta con proceso de Habilitación Urbana Regular, por lo tanto, no podemos certificar la base gráfica del inmueble, pero si su ubicación dentro del Catastro Urbano del Distrito de Trujillo, que corresponde al Código Catastral que lo identifica y es:`; 
const textAfterBold2 = "";

const firstParagraphWithIndent = [
    "",  
    ""
];

// 3️⃣ Dibujar los textos en el PDF
const firstLineIndent = margin + 166;
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
    { text: textAfterBold2, font: fontRegular }
];

// Llamar a la función para justificar y aplicar negrita
yPos = drawJustifiedMixedText(parts, page, 13, margin, yPos, maxWidth);

// Continuar con el siguiente párrafo

const firstParagraphIndent = margin + 199;
page.drawText(firstParagraphWithIndent[0], {
    x: firstParagraphIndent,
    y: yPos,
    size: 13,
    font: fontRegular,
});


// Justificar el resto del texto manteniendo el margen
yPos = drawJustifiedText(firstParagraphWithIndent.slice(1), page, fontRegular, 13, margin, yPos, maxWidth);

        
       
        
        yPos -= 40;

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
    const denominacionLines = splitTextByWords(denominacion3, 5);

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

        page.drawText(codigo3, {
            x: margin + 370,
            y: yPos + 30, 
            size: 13,
            font: fontBold,
            color: rgb(0, 0, 0),
        });

        yPos -= 50;
        page.drawText("NOTA:", { x: margin, y: yPos, size: 13, font: fontBold });
        yPos -= 20;
        const notes = [
            "La presente no certifica propiedad ni posesión del inmueble, solamente la codificación que le corresponde por su ubicación espacial.",
            "De conformidad con el Art 3° del Reglamento de la Ley N° 28294, la Zona de Ubicación del presente predio se considera como",
            "Realizada la inscripción registral del inmueble, se nos hará llegar copia del asiento respectivo para validar el código catastral otorgado.",
            "El certificado tiene validez por"
        ];
        
        const bullet = "•"; // Símbolo de viñeta
        const bulletMargin = margin + 5; // 🔹 Más margen a la izquierda
        const textMargin = bulletMargin + 15; // 🔹 Más espacio entre viñeta y texto
        
        notes.forEach(note => {
            // Dibujar la viñeta
            page.drawText(bullet, {
                x: bulletMargin,
                y: yPos,
                size: 13,
                font: fontBold,
                color: rgb(0, 0, 0),
            });
        
            // Justificar el texto de la viñeta dentro de un ancho más amplio
            yPos = drawJustifiedText([note], page, fontRegular, 13, textMargin, yPos, maxWidth - textMargin - -40);
        
            yPos -= 15; // 🔹 Espaciado un poco mayor entre viñetas
        });
        
        // Agregar "ZONA NO CATASTRADA." en negrita justo después de la tercera nota
        page.drawText("ZONA NO CATASTRADA.", {
            x: margin + 309.5,
            y: yPos +105,
            size: 13,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        
        // Ajustar la posición para la siguiente línea
        yPos -= -15;
        
        // Agregar "Doce (12) Meses." en negrita después de la última nota
        page.drawText("Doce (12) Meses.", {
            x: margin + 195.5,
            y: yPos +15,
            size: 13,
            font: fontBold,
            color: rgb(0, 0, 0),
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
