<?php
// the $_POST[] array will contain the passed in filename and data
// the directory "data" is writable by the server (chmod 777)
$filename = "data/".$_POST['filename'];
$data = $_POST['filedata'];
// check to make sure file doesn't already exist; if it does, add a character "A" to the front of the filename
if (file_exists($filename)) {
	$temp="A".$_POST['filename'];
    $filename="data/".$temp;
} 
// write the file to disk
file_put_contents($filename, $data);
?>