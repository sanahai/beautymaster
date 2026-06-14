Add-Type -AssemblyName System.Drawing

$srcPath = (Resolve-Path "public/logo.png").Path
$outDir = (Resolve-Path "public").Path
$iconsDir = Join-Path $outDir "icons"
if (-not (Test-Path $iconsDir)) { New-Item -ItemType Directory -Path $iconsDir | Out-Null }

$src = [System.Drawing.Image]::FromFile($srcPath)

function New-Icon($size, $file, $coverage, $bgHex) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $bg = [System.Drawing.ColorTranslator]::FromHtml($bgHex)
    $g.Clear($bg)

    # 로고를 비율 유지하며 정사각형 안에 가운데 배치
    $maxW = $size * $coverage
    $maxH = $size * $coverage
    $ratio = [Math]::Min($maxW / $src.Width, $maxH / $src.Height)
    $w = [int]($src.Width * $ratio)
    $h = [int]($src.Height * $ratio)
    $x = [int](($size - $w) / 2)
    $y = [int](($size - $h) / 2)
    $g.DrawImage($src, $x, $y, $w, $h)

    $path = Join-Path $iconsDir $file
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
    Write-Output "saved $file ($size x $size)"
}

# 일반 아이콘 (흰 배경, 로고 84%)
New-Icon 192  "icon-192.png"  0.84 "#FFFFFF"
New-Icon 512  "icon-512.png"  0.84 "#FFFFFF"
New-Icon 180  "apple-touch-icon.png" 0.84 "#FFFFFF"
# 마스커블 (가장자리 잘림 대비 안전영역, 로고 60%)
New-Icon 512  "icon-maskable-512.png" 0.60 "#FFFFFF"
# Capacitor 소스 (1024)
New-Icon 1024 "icon-1024.png" 0.84 "#FFFFFF"

$src.Dispose()
Write-Output "DONE"
