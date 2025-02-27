<?php
session_start();
echo isset($_SESSION["usuario"]) ? $_SESSION["usuario"] : "Invitado";
?>
