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
$solicitante = isset($_POST['solicitante']) ? trim($_POST['solicitante']) : '';
$referencia = isset($_POST['referencia']) ? trim($_POST['referencia']) : '';
$denominacion = isset($_POST['denominacion']) ? trim($_POST['denominacion']) : '';
$codigo = isset($_POST['codigo']) ? trim($_POST['codigo']) : '';
$fechaInput = isset($_POST['fecha']) ? trim($_POST['fecha']) : '';

if (empty($solicitante) || empty($referencia) || empty($denominacion) || empty($codigo) || empty($fechaInput)) {
    die(json_encode(["error" => "Todos los campos son obligatorios."]));
}

// Formatear la fecha a "Trujillo, 19 de febrero del 2025"
$timestamp = strtotime($fechaInput);
$fechaFormateada = "Trujillo, " . date("j", $timestamp) . " de " . strftime("%B", $timestamp) . " del " . date("Y", $timestamp);

// Prevenir inyección SQL
$solicitante = $conn->real_escape_string($solicitante);
$referencia = $conn->real_escape_string($referencia);
$denominacion = $conn->real_escape_string($denominacion);
$codigo = $conn->real_escape_string($codigo);
$fechaFormateada = $conn->real_escape_string($fechaFormateada);

// Insertar los datos en la base de datos
$stmt = $conn->prepare("INSERT INTO certificados (solicitante, referencia, denominacion, codigo, fecha, fecha_registro) VALUES (?, ?, ?, ?, ?, NOW())");
$stmt->bind_param("sssss", $solicitante, $referencia, $denominacion, $codigo, $fechaFormateada);

if ($stmt->execute()) {
    echo json_encode(["mensaje" => "Certificado guardado exitosamente.", "fechaFormateada" => $fechaFormateada]);
} else {
    echo json_encode(["error" => "Error al guardar el certificado: " . $stmt->error]);
}

// Cerrar conexiones
$stmt->close();
$conn->close();
?>
