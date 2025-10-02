$outFile = Join-Path $PSScriptRoot 'icon-usage.txt'
if (Test-Path $outFile) { Remove-Item $outFile }

$icons = Get-ChildItem -Path (Join-Path $PSScriptRoot '..\assets') -Filter 'icon-*.svg' -Name -ErrorAction SilentlyContinue
if (-not $icons) { Write-Output "No icons found"; exit }

foreach ($icon in $icons) {
    try {
        $matches = Select-String -Path (Join-Path $PSScriptRoot '..') -Recurse -Pattern $icon -SimpleMatch -List -ErrorAction SilentlyContinue
    } catch {
        $matches = $null
    }

    if ($matches) {
        Add-Content -Path $outFile -Value "---- $icon"
        $matches | Select-Object -ExpandProperty Path | Get-Unique | ForEach-Object { Add-Content -Path $outFile -Value $_ }
    } else {
        Add-Content -Path $outFile -Value "$icon - NO MATCH"
    }
}

Write-Output "Wrote report to $outFile"
