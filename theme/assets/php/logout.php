<?php
session_start();
session_destroy();  // Destruye la sesión
header("Location: http://localhost/sleek-bootstrap-main/theme/loguin.html"); // Redirige al login
exit();
?>
