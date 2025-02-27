<?php
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "certificados"; 

// Conectar con la base de datos
$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
$conn->set_charset("utf8"); // Configurar caracteres UTF-8

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

// Obtener y validar los datos del formulario
$solicitante = isset($_POST['solicitante5']) ? trim($_POST['solicitante5']) : '';
$referencia = isset($_POST['referencia5']) ? trim($_POST['referencia5']) : '';
$denominacion = isset($_POST['denominacion5']) ? trim($_POST['denominacion5']) : '';
$sublote = isset($_POST['sublote5']) ? trim($_POST['sublote5']) : '';
$tipo = isset($_POST['tipo5']) ? trim($_POST['tipo5']) : '';
$catastral = isset($_POST['catastral5']) ? trim($_POST['catastral5']) : '';
$fechaInput = isset($_POST['fecha5']) ? trim($_POST['fecha5']) : '';

if (empty($solicitante) || empty($referencia) || empty($denominacion) || empty($sublote) || empty($tipo) || empty($catastral) || empty($fechaInput)) {
    die(json_encode(["error" => "Todos los campos son obligatorios."]));
}

// Formatear la fecha a "Trujillo, 19 de febrero del 2025"
$timestamp = strtotime($fechaInput);
setlocale(LC_TIME, 'es_ES.UTF-8'); // Asegurar formato en español
$fechaFormateada = "Trujillo, " . date("j", $timestamp) . " de " . strftime("%B", $timestamp) . " del " . date("Y", $timestamp);

// Prevenir inyección SQL
$solicitante = $conn->real_escape_string($solicitante);
$referencia = $conn->real_escape_string($referencia);
$denominacion = $conn->real_escape_string($denominacion);
$sublote = $conn->real_escape_string($sublote);
$tipo = $conn->real_escape_string($tipo);
$catastral = $conn->real_escape_string($catastral);
$fechaFormateada = $conn->real_escape_string($fechaFormateada);

// Insertar los datos en la base de datos (usando la nueva tabla certificados6)
$stmt = $conn->prepare("INSERT INTO certificados6 (solicitante, referencia, denominacion, sublote, tipo, catastral, fecha, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
$stmt->bind_param("sssssss", $solicitante, $referencia, $denominacion, $sublote, $tipo, $catastral, $fechaFormateada);

if ($stmt->execute()) {
    echo json_encode([
        "mensaje" => "Certificado guardado exitosamente.",
        "fechaFormateada" => $fechaFormateada
    ]);
} else {
    echo json_encode(["error" => "Error al guardar el certificado: " . $stmt->error]);
}

// Cerrar conexiones
$stmt->close();
$conn->close();
?>
