<?php /** @var array $pageData */ ?>
<!DOCTYPE html>
<html lang="<?php echo str_replace('_', '-', app()->getLocale()); ?>">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
        <title><?php echo e($pageData['brand']['name'] ?? config('app.name', 'Laravel')); ?></title>
        <meta name="description" content="Sagara Lattea menghadirkan tea-based lifestyle café dengan nuansa hangat, kontras kuat, dan visual organik.">

        <?php echo app(\Illuminate\Foundation\Vite::class)(['resources/css/app.css', 'resources/js/app.jsx']); ?>
        <script>
            window.__INITIAL_PAGE_DATA__ = <?php echo json_encode($pageData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>;
        </script>
    </head>
    <body class="bg-cream text-forest-deep">
        <div id="app"></div>
    </body>
</html>
