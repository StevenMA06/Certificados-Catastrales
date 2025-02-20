<?php
session_start(); // INICIAR SESIÓN

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "test1";

$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
if (!$conn) {
    die("No hay conexión: " . mysqli_connect_error());
}

$nombre = isset($_POST["inputUser"]) ? $_POST["inputUser"] : "";
$pass = isset($_POST["inputPassword"]) ? $_POST["inputPassword"] : "";

if ($nombre !== "" && $pass !== "") {
    $query = mysqli_query($conn, "SELECT * FROM login WHERE usuario='" . mysqli_real_escape_string($conn, $nombre) . "' AND password='" . mysqli_real_escape_string($conn, $pass) . "'");
    
    if (mysqli_num_rows($query) == 1) {
        $user = mysqli_fetch_assoc($query);
        
        $_SESSION["usuario"] = $user["usuario"]; // Guardar usuario en la sesión
        
        header("Location: http://localhost/sleek-bootstrap-main/theme/nuevo2.html");
        exit();
    } else {
        header("Location: http://localhost/loguin/");
        exit();
    }
} else {
    echo "Por favor ingrese usuario y contraseña.";
}
?>
