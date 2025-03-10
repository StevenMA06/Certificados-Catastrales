document.getElementById("generarPDF7").addEventListener("click", async function () {
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
        const solicitante7 = document.getElementById("solicitante7")?.value || "NOMBRE NO INGRESADO";
        const referencia7 = document.getElementById("referencia7")?.value || "REFERENCIA NO INGRESADA";
        const numeroC7 = document.getElementById("numeroC7")?.value || "NUMEROC NO INGRESADA";
        const codigo7 = document.getElementById("codigo7")?.value || "CÓDIGO NO INGRESADO";
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
        formData.append("solicitante", document.getElementById("solicitante7").value.trim());
        formData.append("referencia", document.getElementById("referencia7").value.trim());
        formData.append("numeroc", document.getElementById("numeroC7").value.trim());
        formData.append("codigo", document.getElementById("codigo7").value.trim());
        formData.append("fecha", document.getElementById("fecha1").value.trim());
        
        let response = await fetch("insertar7.php", {
            method: "POST",
            body: formData
        });
        
        console.log("Datos del formulario obtenidos:", {
            solicitante7,
            referencia7,
            numeroC7,
            codigo7,
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

        page.drawText(`SOLICITANTES:  ${solicitante7}`, { x: margin, y: yPos, size: 13, font: fontBold });
        yPos -= 20;
        page.drawText(`REFERENCIA  :  ${referencia7}`, { x: margin, y: yPos, size: 13, font: fontBold });
        yPos -= 30;

        async function obtenerNumeroCertificado() {
            try {
                // Aquí haces la llamada a insertar.php
                let response = await fetch('inserta7.php', {
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
    "Que, el inmueble materia de la presente",
    "certificación, se encuentra ubicado en el"
];

const textBold = `Sector Catastral Nº ${numeroC7}`;
const textBold2 = `Lotización Irregular`;
const textAfterBold = "correspondiendo a una"; 
const textAfterBold2 = ", y que cuenta a la fecha con información cartográfica preliminar a nivel de lotes, por lo tanto, no podemos certificar la base gráfica del inmueble; pero si su ubicación dentro del Catastro Urbano del Distrito de Trujillo.";

const firstParagraphWithIndent = [
    "Que, de acuerdo al plano de ubicación y localización",  
    "que corre a fojas 08 que adjunto el interesado en el presente expediente, el mismo que fue contrastado con la cartografía que obra en catastro, determinando que le corresponde el Código Catastral que los identifica y es:"
];

// 3️⃣ Dibujar los textos en el PDF
const firstLineIndent = margin + 257;
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
yPos -= 15;
const firstParagraphIndent = margin + 191;
page.drawText(firstParagraphWithIndent[0], {
    x: firstParagraphIndent,
    y: yPos,
    size: 13,
    font: fontRegular,
});
yPos -= 15;

// Justificar el resto del texto manteniendo el margen
yPos = drawJustifiedText(firstParagraphWithIndent.slice(1), page, fontRegular, 13, margin, yPos, maxWidth);

yPos -= 20;



// Línea de subrayado para "DENOMINACIÓN"


// Calcular el ancho del texto "CÓDIGO CATASTRAL" y centrarlo
const textWidthCodigo = fontBold.widthOfTextAtSize("CÓDIGO CATASTRAL", 13);
const centerXCodigo = (page.getWidth() - textWidthCodigo) / 2;

// Dibujar "CÓDIGO CATASTRAL" centrado
page.drawText("CÓDIGO CATASTRAL", {
    x: centerXCodigo,
    y: yPos,
    size: 13,
    font: fontBold,
    color: rgb(0, 0, 0),
});

// Dibujar la línea de subrayado centrada
page.drawLine({
    start: { x: centerXCodigo, y: yPos - 2 },
    end: { x: centerXCodigo + textWidthCodigo, y: yPos - 2 },
    thickness: 1,
    color: rgb(0, 0, 0),
});

yPos -= 35; // 🔹 Aumentar el espacio antes de imprimir el código

// Calcular el ancho del código y centrarlo
const textWidthCodigo7 = fontBold.widthOfTextAtSize(codigo7, 13);
const centerXCodigo7 = (page.getWidth() - textWidthCodigo7) / 2;

// Dibujar el código catastral centrado pero más abajo
page.drawText(codigo7, {
    x: centerXCodigo7,
    y: yPos, // 🔹 Ajustar para bajarlo
    size: 13,
    font: fontBold,
    color: rgb(0, 0, 0),
});

yPos -= 35;

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

// Ajustar la posición para la siguiente línea
yPos -= 20;

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


