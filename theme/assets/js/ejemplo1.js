

document.getElementById("generarPDF1").addEventListener("click", async function () {
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
            opacity: 1, // Ajusta la opacidad del fondo.
        });

        console.log("Imagen de fondo añadida correctamente.");
        // Obtener los valores del formulario
        const solicitante1 = document.getElementById("solicitante1")?.value || "NOMBRE NO INGRESADO";
        const referencia1 = document.getElementById("referencia1")?.value || "REFERENCIA NO INGRESADA";
        const denominacion1 = document.getElementById("denominacion1")?.value || "DENOMINACIÓN NO INGRESADA";
        const codigo1 = document.getElementById("codigo1")?.value || "CÓDIGO NO INGRESADO";
        const firmaSeleccionada = document.getElementById("firmaSeleccionada")?.value || "Sin firma seleccionada";
        const fechaInput = document.getElementById("fecha1").value;
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

        let formData = new FormData();
        formData.append("solicitante", document.getElementById("solicitante1").value.trim());
        formData.append("referencia", document.getElementById("referencia1").value.trim());
        formData.append("denominacion", document.getElementById("denominacion1").value.trim());
        formData.append("codigo", document.getElementById("codigo1").value.trim());
        formData.append("fecha", document.getElementById("fecha1").value.trim());
        
        let response = await fetch("insertar.php", {
            method: "POST",
            body: formData
        });
        









        console.log("Datos del formulario obtenidos:", {
            solicitante1,
            referencia1,
            denominacion1,
            codigo1,
            fecha1,
            firmaSeleccionada

        });

        

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

        page.drawText(`SOLICITANTES:  ${solicitante1}`, { x: margin, y: yPos, size: 13, font: fontBold });
        yPos -= 20;
        page.drawText(`REFERENCIA  :  ${referencia1}`, { x: margin, y: yPos, size: 13, font: fontBold });
        yPos -= 30;

        async function obtenerNumeroCertificado() {
            try {
                // Aquí haces la llamada a insertar.php
                let response = await fetch('insertar.php', {
                    method: 'POST',
                    body: new FormData(document.getElementById('formulario-certificado')) // Asegúrate de enviar los datos correctos
                });
                
                let data = await response.json();
                
                // Verifica que los datos que esperas están en la respuesta
                if (data.numeroCertificado) {
                    return data.numeroCertificado;
                } else {
                    console.error("Error al obtener el número de certificado:", data.error);
                    return 1; // En caso de error, empezar en 1
                }
            } catch (error) {
                console.error("Error en la comunicación con el servidor:", error);
                return 1; // En caso de error, empezar en 1
            }
        }
        
        // Llamar a la función y generar el PDF con el número correcto
        obtenerNumeroCertificado().then(numeroCertificado => {
            const textoCertificado = `CERTIFICADO DE CÓDIGO CATASTRAL Nº ${numeroCertificado} – 2025`;
            centerText(textoCertificado, fontBoldItalic, 14, yPos);
        });

                
                
// Obtener la firma seleccionada
try {
    // Cargar la imagen de la firma seleccionada
    const firmaBytes = await fetch(firmaSeleccionada).then(res => res.arrayBuffer());
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


// Calcular el ancho del texto para subrayarlo correctamente
const textWidth = fontBoldItalic.widthOfTextAtSize("CERTIFICADO DE CÓDIGO CATASTRAL Nº 112 – 2024", 14);
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
            "Visto el presente expediente, mediante el cual", 
            `solicitan se emita Certificado de Código Catastral al Terreno denominado como ${denominacion1} del Sector Catastral 19 de esta ciudad, al respecto se certifica lo siguiente.`,
        ];

        const firstParagraphWithIndent = [
            "Que, a la fecha no se está emitiendo plano catastral,",  
            "por cuanto este trámite se encuentra en proceso de implementación, por lo tanto, no podemos certificar la base gráfica de los inmuebles, pero sí su ubicación dentro del Catastro Urbano del Distrito, que corresponde a los Códigos Catastrales que los identifica y son:"
        ];

        const firstLineIndent = margin + 230; 
        page.drawText(certificationText[0], {
            x: firstLineIndent,
            y: yPos,
            size: 13,
            font: fontRegular,
        });

        yPos -= 15;
        yPos = drawJustifiedText(certificationText.slice(1), page, fontRegular, 13, margin, yPos, maxWidth);
        
        const firstParagraphIndent = margin + 191;
        page.drawText(firstParagraphWithIndent[0], {
            x: firstParagraphIndent,
            y: yPos,
            size: 13,
            font: fontRegular,
        });
        yPos -= 15;
        yPos = drawJustifiedText(firstParagraphWithIndent.slice(1), page, fontRegular, 13, margin, yPos, maxWidth);
        
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
    const denominacionLines = splitTextByWords(denominacion1, 5);

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

        page.drawText(codigo1, {
            x: margin + 370,
            y: yPos + 30, 
            size: 13,
            font: fontBold,
            color: rgb(0, 0, 0),
        });

        yPos -= 50;

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

        page.drawText(fechaFormateada, {
            x: margin + 312,
            y: yPos = 210,    
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


