<?php
header('Content-Type: application/json');
require 'db.php';

// Initialize response array
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method';
    echo json_encode($response);
    exit;
}

// Get and sanitize input data
$first_name = filter_input(INPUT_POST, 'first_name', FILTER_SANITIZE_STRING);
$last_name = filter_input(INPUT_POST, 'last_name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
$password = $_POST['password'] ?? '';
$confirm_password = $_POST['confirm_password'] ?? '';

// Validate inputs
if (empty($first_name)) {
    $response['errors']['first_name'] = 'First name is required';
}

if (empty($last_name)) {
    $response['errors']['last_name'] = 'Last name is required';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['errors']['email'] = 'Valid email is required';
}

if (empty($username)) {
    $response['errors']['username'] = 'Username is required';
} elseif (strlen($username) < 4) {
    $response['errors']['username'] = 'Username must be at least 4 characters';
}

if (empty($password)) {
    $response['errors']['password'] = 'Password is required';
} elseif (strlen($password) < 8) {
    $response['errors']['password'] = 'Password must be at least 8 characters';
}

if ($password !== $confirm_password) {
    $response['errors']['confirm_password'] = 'Passwords do not match';
}

// If there are validation errors, return them
if (!empty($response['errors'])) {
    $response['message'] = 'Please correct the following errors';
    echo json_encode($response);
    exit;
}

try {
    // Check if username or email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$username, $email]);
    
    if ($stmt->rowCount() > 0) {
        $response['message'] = 'Username or email already exists';
        echo json_encode($response);
        exit;
    }
    
    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new user
    $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$first_name, $last_name, $email, $username, $hashed_password]);
    
    // Success
    $response['success'] = true;
    $response['message'] = 'Registration successful!';
    echo json_encode($response);
    
} catch (PDOException $e) {
    $response['message'] = 'Database error: ' . $e->getMessage();
    echo json_encode($response);
}
?>