$ErrorActionPreference = 'Stop'
$target = Join-Path $PSScriptRoot '.env.local'
$secureKey = Read-Host 'GOOGLE_MAPS_BROWSER_KEY (hidden input)' -AsSecureString
$credential = [System.Net.NetworkCredential]::new('', $secureKey)
$plainKey = $credential.Password.Trim()
try {
    if ($plainKey -notmatch '^AIza[A-Za-z0-9_-]+$') { throw 'Invalid Google API key format. No file was changed.' }
    $lines = @()
    if (Test-Path -LiteralPath $target) {
        $lines = @(Get-Content -LiteralPath $target | Where-Object { $_ -notmatch '^\s*GOOGLE_MAPS_BROWSER_KEY\s*=' })
    }
    $lines += 'GOOGLE_MAPS_BROWSER_KEY=' + $plainKey
    [System.IO.File]::WriteAllLines($target, [string[]]$lines, [System.Text.UTF8Encoding]::new($false))
    Write-Host 'Google Maps key saved locally. The exchange-rate key was preserved.'
} finally { $plainKey = $null; $credential = $null; $secureKey.Dispose() }
