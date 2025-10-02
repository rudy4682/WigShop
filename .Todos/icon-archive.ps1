<#
Safe archival script for theme icons.
- Reads `.Todos/icon-usage.txt` and moves icons marked `NO MATCH` into `assets/legacy-icons/`.
- Default mode: dry-run (shows actions without moving files).
- Use `-Execute` switch to actually move files.
- Creates `assets/legacy-icons/` if missing.
Usage:
    powershell -ExecutionPolicy Bypass -File .Todos\icon-archive.ps1    # dry-run
    powershell -ExecutionPolicy Bypass -File .Todos\icon-archive.ps1 -Execute  # perform moves
#>
[CmdletBinding()]
param(
    [switch]$Execute
)
$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoRoot = Resolve-Path "$root\.."
$reportPath = Join-Path $repoRoot ".Todos\icon-usage.txt"
$assetsDir = Join-Path $repoRoot "assets"
$legacyDir = Join-Path $assetsDir "legacy-icons"
if (-not (Test-Path $reportPath)) {
    Write-Error "Report not found at $reportPath. Run .Todos/icon-scan.ps1 first."
    exit 1
}
if (-not (Test-Path $legacyDir)) {
    New-Item -ItemType Directory -Path $legacyDir | Out-Null
}
$report = Get-Content $reportPath | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
$noMatch = $report | Where-Object { $_ -match " - NO MATCH$" } | ForEach-Object { ($_ -replace " - NO MATCH$", "").Trim() }
if ($noMatch.Count -eq 0) {
    Write-Host "No NO MATCH icons found in report. Nothing to do."
    exit 0
}
Write-Host "Found $($noMatch.Count) icons marked NO MATCH:`n"
foreach ($icon in $noMatch) {
    $source = Join-Path $assetsDir $icon
    if (-not (Test-Path $source)) {
        Write-Warning "Icon not found in assets: $icon (skipping)"
        continue
    }
    $dest = Join-Path $legacyDir $icon
    if ($Execute) {
        Write-Host "Moving $icon -> assets/legacy-icons/"
        Move-Item -Path $source -Destination $dest -Force
    } else {
        Write-Host "[DRY-RUN] Would move: $icon -> assets/legacy-icons/"
    }
}
Write-Host "\nArchive script completed. Use -Execute to actually move files."
