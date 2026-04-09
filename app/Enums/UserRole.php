<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Gestor = 'gestor';
    case Paciente = 'paciente';
}
