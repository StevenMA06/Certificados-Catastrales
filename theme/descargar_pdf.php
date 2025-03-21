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

if (isset($_GET["id"])) {
    $id = $_GET["id"];
    $sql = "SELECT documento_pdf FROM login WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($documento_pdf);
    $stmt->fetch();

    if ($documento_pdf) {
        header("Content-Type: application/pdf");
        header("Content-Disposition: inline; filename=documento_$id.pdf");
        echo $documento_pdf;
    } else {
        echo "No se encontró el documento.";
    }
} else {
    echo "ID no proporcionado.";
}

$conn->close();
?>
