# Lance le clipping sur une video (ou tout un dossier) sous Windows, en une commande.
#
#   Clic droit sur ce fichier > "Executer avec PowerShell"
#   ou : powershell -ExecutionPolicy Bypass -File run_windows.ps1 -Source "C:\chemin\video.mp4"
#
# Par defaut : recadrage plein ecran 9:16 (pas de bandes floues), silences coupes, pas de flash blanc.
param(
    [string]$Source = "C:\Users\anton\Downloads\telegram_live_alert\live_transcriber\recordings\test clipping live",
    [int]$Count = 5,
    [ValidateSet("crop", "blur", "split")] [string]$Layout = "crop",
    [string]$Facecam = "",          # pour -Layout split : "x,y,w,h" en pixels de la video source
    [string]$Extra = "--no-flash"   # autres options, ex: "--teaser cross --music beat.mp3"
)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$env:PYTHONIOENCODING = "utf-8"

# 1. ffmpeg complet (avec libass pour les sous-titres)
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Host "Installation de ffmpeg..." -ForegroundColor Cyan
    winget install --id Gyan.FFmpeg -e --accept-source-agreements --accept-package-agreements
    $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
}

# 2. Environnement Python
if (-not (Test-Path .venv)) { python -m venv .venv }
$py = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"
& $py -m pip install -q --disable-pip-version-check -r requirements.txt

# 3. Cle API (vide = selection sur les pics audio uniquement)
if (-not $env:ANTHROPIC_API_KEY) {
    $env:ANTHROPIC_API_KEY = Read-Host "Cle API Anthropic (Entree = mode sans IA)"
}
$mode = @()
if (-not $env:ANTHROPIC_API_KEY) { $mode = @("--no-llm") }
if ($Facecam) { $mode += @("--facecam", $Facecam) }

# 4. Videos a traiter
if (Test-Path -LiteralPath $Source -PathType Leaf) {
    $videos = @(Get-Item -LiteralPath $Source)
} else {
    $videos = @(Get-ChildItem -LiteralPath $Source -File | Where-Object { $_.Extension -match '^\.(mp4|mkv|mov|flv|ts|webm|m4v)$' })
}
if ($videos.Count -eq 0) { throw "Aucune video trouvee dans : $Source" }

foreach ($v in $videos) {
    $out = Join-Path $PSScriptRoot ("out\" + $v.BaseName)
    Write-Host "`n=== $($v.Name) -> $out ===" -ForegroundColor Green
    $extraArgs = @($Extra -split ' ' | Where-Object { $_ })
    & $py -m clipper $v.FullName --out $out --count $Count --layout $Layout --lang fr --font "Arial Black" @mode @extraArgs
    if ($LASTEXITCODE -ne 0) { Write-Host "Echec sur $($v.Name)" -ForegroundColor Red; continue }
    explorer.exe $out
}
Read-Host "`nTermine. Entree pour fermer"
