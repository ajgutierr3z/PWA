<?php
include('../db_config.php');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['nombre'], $data['fecha'])) {
  $nombre = $conn->real_escape_string($data['nombre']);
  $fecha = $conn->real_escape_string($data['fecha']);

  $sql = "INSERT INTO visitas (nombre, fecha) VALUES ('$nombre', '$fecha')";
  if ($conn->query($sql)) {
    echo json_encode(["status" => "ok"]);
  } else {
    http_response_code(500);
    echo json_encode(["error" => $conn->error]);
  }
}
?>
