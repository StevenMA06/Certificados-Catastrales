<?php
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test1"; 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conn->connect_error]));
}

$sql = "SELECT id, usuario, password, documento_pdf FROM login";
$resultado = $conn->query($sql);

$usuarios = [];
while ($row = $resultado->fetch_assoc()) {
    $row["documento_pdf"] = $row["documento_pdf"] ? "descargar_pdf.php?id=" . $row["id"] : null;
    $usuarios[] = $row;
}

echo json_encode($usuarios);
$conn->close();
?>
