<?php
require_once('qiniu/rs.php');

$accessKey = 'you accessKey';
$secretKey = 'you secretKey';
Qiniu_setKeys($accessKey, $secretKey);
$bucket = 'you bucket';
$putPolicy = new Qiniu_RS_PutPolicy($bucket);
$upToken["uptoken"] = $putPolicy->Token(null);
echo json_encode($upToken);