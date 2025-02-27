<?php
// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test1";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Verificar si se recibe el ID
if (isset($_GET["id"])) {
    $id = intval($_GET["id"]);

    // Consultar el documento PDF
    $sql = "SELECT documento_pdf FROM login WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($documento_pdf);
    $stmt->fetch();

    if (!empty($documento_pdf)) {
        // Configurar encabezados para descargar el archivo
        header("Content-Type: application/pdf");
        header("Content-Disposition: attachment; filename=documento_$id.pdf");
        echo $documento_pdf;
    } else {
        echo "Documento no encontrado.";
    }
} else {
    echo "ID no especificado.";
}

$conn->close();
?>
