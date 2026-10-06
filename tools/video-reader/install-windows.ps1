# Installe le MCP « video-reader » pour Claude Desktop (Windows).
# Usage : double-cliquer sur install-windows.bat
$ErrorActionPreference = "Stop"

$Src = $PSScriptRoot
$Dest = Join-Path $env:USERPROFILE ".claude-video-reader"
$Packages = @("mcp>=1.2,<2", "yt-dlp[default,curl-cffi]", "youtube-transcript-api>=1.0", "faster-whisper", "av<17")

function Check($step) {
    if ($LASTEXITCODE -ne 0) { throw "Echec a l'etape : $step" }
}

Write-Host "> 1/5 Installation de uv (gestionnaire Python)..."
$Uv = Join-Path $env:USERPROFILE ".local\bin\uv.exe"
if (Get-Command uv -ErrorAction SilentlyContinue) {
    $Uv = (Get-Command uv).Source
} elseif (-not (Test-Path $Uv)) {
    powershell -ExecutionPolicy Bypass -c "irm https://astral.sh/uv/install.ps1 | iex"
    Check "installation de uv"
}

Write-Host "> 2/5 Creation de l'environnement Python dans $Dest..."
New-Item -ItemType Directory -Force -Path $Dest | Out-Null
Copy-Item (Join-Path $Src "server.py"), (Join-Path $Src "configure_claude.py") $Dest -Force
& $Uv venv --quiet --allow-existing --python 3.12 (Join-Path $Dest ".venv"); Check "creation du venv"
$Py = Join-Path $Dest ".venv\Scripts\python.exe"

Write-Host "> 3/5 Installation des dependances (yt-dlp, Whisper, MCP)..."
& $Uv pip install --quiet --upgrade --python $Py @Packages; Check "installation des dependances"
& $Py (Join-Path $Dest "server.py") --selftest | Out-Null; Check "verification"

Write-Host "> 4/5 Telechargement du modele Whisper (une seule fois, ~150 Mo)..."
& $Py -c "from faster_whisper import WhisperModel; WhisperModel('base', device='cpu', compute_type='int8')"
Check "modele Whisper"

Write-Host "> 5/5 Configuration de Claude Desktop..."
& $Py (Join-Path $Dest "configure_claude.py") $Py (Join-Path $Dest "server.py"); Check "configuration"

Write-Host ""
Write-Host "Installation terminee." -ForegroundColor Green
Write-Host "-> Quitte completement Claude Desktop (icone de la barre des taches > Quitter), puis rouvre-le."
Write-Host "-> Teste avec : 'Lis cette video et resume-la en etapes : <lien YouTube ou TikTok>'"
Write-Host ""
Write-Host "Transcrire une longue video dans le terminal :"
Write-Host "   & `"$Py`" `"$Dest\server.py`" --cli `"<URL>`""
