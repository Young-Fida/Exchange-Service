$ErrorActionPreference = 'Stop'
$target = Join-Path $PSScriptRoot '.env.local'
$secureKey = Read-Host 'EXIM_API_KEY (hidden input)' -AsSecureString
$credential = [System.Net.NetworkCredential]::new('', $secureKey)
$plainKey = $credential.Password.Trim()
try {
    if ($plainKey -notmatch '^[A-Za-z0-9_-]+$') {
        throw 'Invalid key format. No file was changed.'
    }
    $lines = @()
    if (Test-Path -LiteralPath $target) {
        $lines = @(Get-Content -LiteralPath $target | Where-Object { $_ -notmatch '^\s*EXIM_API_KEY\s*=' })
    }
    $lines += 'EXIM_API_KEY=' + $plainKey
    [System.IO.File]::WriteAllLines($target, [string[]]$lines, [System.Text.UTF8Encoding]::new($false))
    Write-Host 'Saved to .env.local. The key was not displayed. Vercel must be configured separately.'
} finally {
    $plainKey = $null
    $credential = $null
    $secureKey.Dispose()
}
