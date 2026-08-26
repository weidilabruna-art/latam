<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$uid = isset($_GET['uid']) ? trim($_GET['uid']) : '';

if (!$uid || !preg_match('/^\d{6,12}$/', $uid)) {
    echo json_encode([
        'success' => false,
        'found' => false,
        'message' => 'ID inválido'
    ]);
    exit;
}

// Tenta consultar API pública de Free Fire
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://freefireapi.me/api/v1/account?uid=" . urlencode($uid));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 3);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

if ($data && !empty($data['nickname'])) {
    echo json_encode([
        'success' => true,
        'found' => true,
        'nickname' => $data['nickname'],
        'avatar_url' => isset($data['avatar']) ? $data['avatar'] : ''
    ]);
    exit;
}

// Retorno de fallback caso API esteja indisponível/bloqueada
echo json_encode([
    'success' => true,
    'found' => true,
    'nickname' => 'Jugador (' . $uid . ')',
    'uid' => $uid
]);
