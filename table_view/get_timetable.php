<?php
header('Content-Type: application/json');

// Database configuration
$host = 'localhost';
$dbname = 'timetable_db';
$username = 'root'; // Update with your MySQL username
$password = '';     // Update with your MySQL password
$debug = true;      // Set to true for debugging, false for production

// Debug initial setup
if ($debug) {
    echo "<pre>Debug Mode:\n";
    var_dump(['host' => $host, 'dbname' => $dbname, 'username' => $username]);
    echo "</pre>";
}

try {
    // Create connection
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    // Prepare and execute query
    $stmt = $conn->prepare("SELECT course, code, lecturer, venue, time, day, type FROM schedules");
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Organize data by day
    $timetable = [];
    foreach ($result as $row) {
        $day = $row['day'];
        unset($row['day']);
        $timetable[$day][] = $row;
    }

    if ($debug && empty($timetable)) {
        echo "<pre>No data found in schedules table.</pre>";
    }

    echo json_encode($timetable);
} catch (PDOException $e) {
    $error_msg = "Connection failed: " . $e->getMessage();
    file_put_contents('error.log', date('Y-m-d H:i:s') . " - $error_msg\n", FILE_APPEND);
    echo json_encode(['error' => $error_msg]);
} catch (Exception $e) {
    $error_msg = "An error occurred: " . $e->getMessage();
    file_put_contents('error.log', date('Y-m-d H:i:s') . " - $error_msg\n", FILE_APPEND);
    echo json_encode(['error' => $error_msg]);
}
?>