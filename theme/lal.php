<?php
// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test1"; // Cambia esto si tu base de datos tiene otro nombre

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$id_busqueda = "";
$resultado = null;

// Verificar si se ha enviado un ID a buscar
if (isset($_POST["buscar"])) {
    $id_busqueda = $_POST["id_usuario"];
    $sql = "SELECT id, usuario, password, documento_pdf FROM login WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_busqueda);
    $stmt->execute();
    $resultado = $stmt->get_result();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buscar Usuario</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-4">
        <h2 class="text-center">Buscar Usuario por ID</h2>

        <!-- Formulario de búsqueda -->
        <form method="POST" class="form-inline justify-content-center">
            <input type="number" name="id_usuario" class="form-control mr-2" placeholder="Ingrese ID" required>
            <button type="submit" name="buscar" class="btn btn-primary">Buscar</button>
        </form>

        <hr>

        <!-- Tabla de resultados -->
        <table class="table table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Contraseña</th>
                    <th>Documento PDF</th>
                </tr>
            </thead>
            <tbody>
                <?php
                if ($resultado && $resultado->num_rows > 0) {
                    while ($row = $resultado->fetch_assoc()) {
                        echo "<tr>";
                        echo "<td>" . $row["id"] . "</td>";
                        echo "<td>" . $row["usuario"] . "</td>";
                        echo "<td>" . $row["password"] . "</td>";

                        // Si el usuario tiene un PDF, mostrar botón de descarga
                        if (!empty($row["documento_pdf"])) {
                            echo "<td><a href='descargar_pdf.php?id=" . $row["id"] . "' class='btn btn-success'>Descargar PDF</a></td>";
                        } else {
                            echo "<td class='text-center'>No disponible</td>";
                        }

                        echo "</tr>";
                    }
                } elseif ($id_busqueda !== "") {
                    echo "<tr><td colspan='4' class='text-center'>No se encontró el usuario con ID $id_busqueda</td></tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
</body>
</html>

<?php
$conn->close();
?>
