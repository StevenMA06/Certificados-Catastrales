<?php
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "certificados"; 

$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
$conn->set_charset("utf8");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Conexión fallida."]);
    exit;
}

// Obtener y validar los datos del formulario
$solicitante = isset($_POST['solicitante']) ? trim($_POST['solicitante']) : '';
$referencia = isset($_POST['referencia']) ? trim($_POST['referencia']) : '';
$numeroc = isset($_POST['numeroc']) ? trim($_POST['numeroc']) : ''; // Sector Catastral Nº
$codigo = isset($_POST['codigo']) ? trim($_POST['codigo']) : '';
$fechaInput = isset($_POST['fecha']) ? trim($_POST['fecha']) : '';

if (empty($solicitante) || empty($referencia) || empty($numeroc) || empty($codigo) || empty($fechaInput)) {
    echo json_encode(["error" => "Todos los campos son obligatorios."]);
    exit;
}

// Formatear la fecha a "Trujillo, 19 de febrero del 2025"
setlocale(LC_TIME, 'es_ES.UTF-8');
$timestamp = strtotime($fechaInput);
$fechaFormateada = "Trujillo, " . date("j", $timestamp) . " de " . strftime("%B", $timestamp) . " del " . date("Y", $timestamp);

// Insertar los datos en la base de datos
$stmt = $conn->prepare("INSERT INTO certificados7 (solicitante, referencia, numeroc, codigo, fecha, fecha_registro) VALUES (?, ?, ?, ?, ?, NOW())");
$stmt->bind_param("sssss", $solicitante, $referencia, $numeroc, $codigo, $fechaFormateada);

if ($stmt->execute()) {
    echo json_encode(["mensaje" => "Certificado guardado exitosamente.", "fechaFormateada" => $fechaFormateada]);
} else {
    error_log("Error en la base de datos: " . $stmt->error);
    echo json_encode(["error" => "No se pudo guardar el certificado. Inténtalo más tarde."]);
}

$stmt->close();
$conn->close();
?>
