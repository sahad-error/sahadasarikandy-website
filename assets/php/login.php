<?php
require 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (empty($username) || empty($password)) {
        error_log("Login error: Username or password empty");
        header('Location: /login.html?error=Username and password are required');
        exit;
    }

    if (authenticate($username, $password)) {
        error_log("Login success for user: $username");
        header('Location: /personal.html');
        exit;
    } else {
        error_log("Login failed for user: $username");
        header('Location: /login.html?error=Invalid credentials');
        exit;
    }
}
?>