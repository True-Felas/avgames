<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use App\Models\Category;

class ImportRemote extends Command
{
    /**
     * The name and signature of the console command.
     *
     * Usage: php artisan import:remote categories --host=10.8.0.1 --database=avgames --username=laravel --password=secret
     */
    protected $signature = 'import:remote {table} {--host=} {--port=3306} {--database=} {--username=} {--password=} {--truncate}';

    /**
     * The console command description.
     */
    protected $description = 'Import a table from a remote MySQL into the local database (sqlite)';

    public function handle(): int
    {
        $table = $this->argument('table');
        $host = $this->option('host') ?: $this->ask('Remote DB host (e.g. 10.8.0.1)');
        $port = $this->option('port');
        $database = $this->option('database') ?: $this->ask('Remote DB name');
        $username = $this->option('username') ?: $this->ask('Remote DB user');
        $password = $this->option('password') ?: $this->secret('Remote DB password');

        $this->info("Connecting to remote MySQL $host:$port/$database ...");

        $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $host, $port, $database);

        try {
            $pdo = new \PDO($dsn, $username, $password, [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
            ]);
        } catch (\Exception $e) {
            $this->error('Could not connect to remote DB: ' . $e->getMessage());
            return 1;
        }

        $this->info("Fetching rows from remote table: $table");

        try {
            $stmt = $pdo->query('SELECT * FROM ' . $pdo->quote($table));
        } catch (\Throwable $e) {
            // If quoting table fails, try plain
            $stmt = $pdo->query('SELECT * FROM ' . $table);
        }

        $rows = $stmt->fetchAll();

        $count = count($rows);
        $this->info("Fetched $count rows.");

        if ($this->option('truncate')) {
            if ($table === 'categories') {
                Category::truncate();
                $this->info('Truncated local categories table.');
            }
        }

        // Only implement mapping for categories for now
        if ($table !== 'categories') {
            $this->error('Only `categories` import is currently implemented.');
            return 1;
        }

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        foreach ($rows as $row) {
            $data = [];
            // Map common fields safely
            $data['name'] = $row['name'] ?? ($row['title'] ?? '');
            $data['slug'] = $row['slug'] ?? Str::slug($data['name'] ?: 'cat-' . ($row['id'] ?? rand()));
            $data['description'] = $row['description'] ?? null;
            $data['icon'] = $row['icon'] ?? null;
            $data['color'] = $row['color'] ?? null;
            $data['is_active'] = isset($row['is_active']) ? (bool)$row['is_active'] : true;
            $data['sort_order'] = isset($row['sort_order']) ? (int)$row['sort_order'] : 0;

            // Upsert by slug
            Category::updateOrCreate(['slug' => $data['slug']], $data);

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Imported $count categories into local DB.");

        return 0;
    }
}
