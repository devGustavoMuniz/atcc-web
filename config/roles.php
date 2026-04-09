<?php

return [
    'seed_passwords' => [
        'admin' => env('ADMIN_PASSWORD', 'password'),
        'manager' => env('MANAGER_PASSWORD', 'password'),
        'patient' => env('PATIENT_PASSWORD', 'password'),
    ],
];
