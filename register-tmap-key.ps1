$ErrorActionPreference = 'Stop'
$target = Join-Path $PSScriptRoot '.env.local'
$secureKey = Read-Host 'TMAP_API_KEY (paste appKey; hidden input)' -AsSecureString
$credential = [System.Net.NetworkCredential]::new('', $secureKey)
$plainKey = $credential.Password.Trim()
try {
    if ([string]::IsNullOrWhiteSpace($plainKey) -or $plainKey -notmatch '^[A-Za-z0-9_-]+$') {
        throw 'Invalid appKey. No file was changed.'
    }
    $lines = @()
    if (Test-Path -LiteralPath $target) {
        $lines = @(Get-Content -LiteralPath $target | Where-Object { $_ -notmatch '^\s*TMAP_API_KEY\s*=' })
    }
    $lines += 'TMAP_API_KEY=' + $plainKey
    [System.IO.File]::WriteAllLines($target, [string[]]$lines, [System.Text.UTF8Encoding]::new($false))
    Write-Host 'TMAP key saved locally. Existing keys were preserved. Vercel is not updated yet.'
} finally { $plainKey = $null; $credential = $null; $secureKey.Dispose() }
