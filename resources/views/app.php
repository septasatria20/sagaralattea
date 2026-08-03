<?php /** @var array $pageData */ ?>
<!DOCTYPE html>
<html lang="<?php echo str_replace('_', '-', app()->getLocale()); ?>">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
        <title><?php echo e($pageData['brand']['name'] ?? config('app.name', 'Laravel')); ?></title>
        <meta name="description" content="Sagara Lattea menghadirkan tea-based lifestyle café dengan nuansa hangat, kontras kuat, dan visual organik.">
        <?php if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot'))): ?>
            <?php echo app(\Illuminate\Foundation\Vite::class)(['resources/css/app.css', 'resources/js/app.jsx']); ?>
        <?php else: ?>
            <style>
                body {
                    margin: 0;
                    font-family: Inter, Arial, sans-serif;
                    background: #fff6db;
                    color: #176637;
                }
                .fallback-shell {
                    min-height: 100vh;
                    display: grid;
                    place-items: center;
                    padding: 40px;
                    text-align: center;
                }
                .fallback-shell strong {
                    display: block;
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                }
            </style>
        <?php endif; ?>
        <script>
            window.__INITIAL_PAGE_DATA__ = <?php echo json_encode($pageData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>;
        </script>
        <!-- SweetAlert2 for Validation Modals -->
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    </head>
    <body class="bg-cream text-forest-deep">
        <div id="app">
            <?php if (! (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))): ?>
                <div class="fallback-shell">
                    <div>
                        <strong>Sagara Lattea</strong>
                        <div>Frontend React sedang menunggu asset build.</div>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </body>
</html>
