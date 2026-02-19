<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

/*
|--------------------------------------------------------------------------
| Comandos de consola personalizados
|--------------------------------------------------------------------------
| Aquí se pueden definir comandos simples para Artisan.
| Este es el comando de ejemplo que trae Laravel por defecto.
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Muestra una frase inspiradora');
