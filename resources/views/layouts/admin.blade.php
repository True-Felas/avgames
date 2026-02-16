<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') - Admin Panel</title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">

    <style>
        :root {
            --primary-color: #7f13ec;
            --secondary-color: #ff2a6d;
            --dark-bg: #160b22;
        }

        body {
            background-color: #f8f9fa;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .navbar-admin {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 1rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .navbar-admin .navbar-brand {
            color: white;
            font-weight: bold;
            letter-spacing: 1px;
            font-size: 1.5rem;
        }

        .card {
            border: none;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            margin-bottom: 2rem;
        }

        .btn-primary {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
        }

        .btn-primary:hover {
            background-color: #6a0dc4;
            border-color: #6a0dc4;
        }

        .table th {
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 1px;
            font-weight: 600;
        }

        .badge {
            padding: 0.5em 0.8em;
            border-radius: 6px;
        }
    </style>
</head>

<body>

    <nav class="navbar navbar-admin">
        <div class="container-fluid">
            <span class="navbar-brand">AVGAMES ADMIN</span>
            <div class="d-flex">
                <a href="/admin" class="btn btn-outline-light btn-sm">Volver al Dashboard</a>
            </div>
        </div>
    </nav>

    <main class="container py-4">
        @yield('content')
    </main>

    <!-- Bootstrap 5 JS Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    @yield('scripts')
</body>

</html>