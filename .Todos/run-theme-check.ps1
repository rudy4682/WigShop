<#
run-theme-check.ps1
Helper script to attempt running theme-check using several fallbacks and save output to .Todos/theme-check-output.txt

Usage (PowerShell):
  .\.Todos\run-theme-check.ps1

What it does:
  - Tries `shopify theme check`
  - Falls back to `theme-check .` (global gem)
  - Falls back to `bundle exec theme-check` (bundle)
  - Falls back to Docker (ruby image installing theme-check)
  - Writes full stdout/stderr to .Todos/theme-check-output.txt and returns exit code

Note: This script does not install any software automatically. It only attempts to run the available commands and records results.
#>

$outputFile = Join-Path -Path $PSScriptRoot -ChildPath 'theme-check-output.txt'
Remove-Item -Path $outputFile -ErrorAction SilentlyContinue

<#
RunAndCapture removed: TryCommand (below) uses cmd.exe /c and captures output centrally. Keeping script small and robust for Windows.
#>

# Helper to run commands that might not be executables (like 'theme-check' which may be a Ruby gem executable in PATH)
function TryCommand {
    param(
        [string]$cmdLine
    )
    Write-Host "\n==> Attempting: $cmdLine" -ForegroundColor Yellow
    try {
        $procInfo = New-Object System.Diagnostics.ProcessStartInfo
        $procInfo.FileName = 'cmd.exe'
        $procInfo.Arguments = "/c $cmdLine"
        $procInfo.RedirectStandardOutput = $true
        $procInfo.RedirectStandardError = $true
        $procInfo.UseShellExecute = $false
        $procInfo.CreateNoWindow = $true

        $proc = [System.Diagnostics.Process]::Start($procInfo)
        $stdout = $proc.StandardOutput.ReadToEnd()
        $stderr = $proc.StandardError.ReadToEnd()
        $proc.WaitForExit()
        $exit = $proc.ExitCode

        Add-Content -Path $outputFile -Value "`n=== Command: $cmdLine`nExitCode: $exit`n--- STDOUT ---`n$stdout`n--- STDERR ---`n$stderr`n"
        Write-Host "Exit code: $exit" -ForegroundColor Green
        return $exit
    } catch {
        $err = $_.Exception.Message
        Add-Content -Path $outputFile -Value "`n=== Command: $cmdLine`nERROR: $err`n"
        Write-Host "Error running command: $err" -ForegroundColor Red
        return 127
    }
}

# 1) Try Shopify CLI (shopify theme check)
$rc = TryCommand 'shopify theme check'
if ($rc -eq 0) { Write-Host "shopify theme check succeeded." -ForegroundColor Green; Exit 0 }

# 2) Try theme-check directly (gem)
$rc = TryCommand 'theme-check .'
if ($rc -eq 0) { Write-Host "theme-check succeeded." -ForegroundColor Green; Exit 0 }

# 3) Try bundle exec
$rc = TryCommand 'bundle exec theme-check .'
if ($rc -eq 0) { Write-Host "bundle exec theme-check succeeded." -ForegroundColor Green; Exit 0 }

# 4) Docker fallback
Write-Host "\nNo local runner found; attempting Docker fallback (requires Docker Desktop)." -ForegroundColor Yellow
$dockerCmd = 'docker run --rm -v %cd%:/work -w /work ruby:3.2 bash -lc "gem install theme-check --no-document && theme-check ."'
$rc = TryCommand $dockerCmd
if ($rc -eq 0) { Write-Host "Docker theme-check succeeded." -ForegroundColor Green; Exit 0 }

Write-Host "\nAll attempts failed or returned non-zero exit codes. See .Todos/theme-check-output.txt for details." -ForegroundColor Red
Exit 1
