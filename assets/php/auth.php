<?php
session_start([
    'cookie_secure' => false, // Set to true after HTTPS setup
    'cookie_httponly' => true,
    'cookie_samesite' => 'Strict'
]);
error_reporting(0);
ini_set('display_errors', 0);
require 'db.php';

function authenticate($username, $password) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        if ($user && password_verify($password, $user['password'])) {
            session_regenerate_id(true);
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['first_name'] = $user['first_name'];
            error_log("Authentication successful for user: $username");
            return true;
        }
        error_log("Authentication failed for user: $username");
        return false;
    } catch (PDOException $e) {
        error_log("Authentication error: " . $e->getMessage());
        return false;
    }
}

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

if (isset($_GET['check'])) {
    header('Content-Type: application/json');
    echo json_encode(['loggedIn' => isLoggedIn()]);
    exit;
}
?>