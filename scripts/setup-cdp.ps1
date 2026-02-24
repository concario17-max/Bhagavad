param(
    [int]$Port = 9000
)

# Antigravity CDP 설정 자동화 스크립트
# 단축아이콘을 검색하고 --remote-debugging-port 인자를 추가함

# 단축아이콘 검색 함수
function Get-AntigravityShortcuts {
    $searchLocations = @(
        [Environment]::GetFolderPath('Desktop'),
        "$env:USERPROFILE\Desktop",
        "$env:USERPROFILE\OneDrive\Desktop",
        "$env:APPDATA\Microsoft\Windows\Start Menu\Programs",
        "$env:ProgramData\Microsoft\Windows\Start Menu\Programs",
        "$env:USERPROFILE\AppData\Roaming\Microsoft\Internet Explorer\Quick Launch\User Pinned\TaskBar"
    )

    $found = @()
    foreach ($location in $searchLocations) {
        if (Test-Path $location) {
            $shortcuts = Get-ChildItem -Path $location -Recurse -Filter "*.lnk" -ErrorAction SilentlyContinue |
                Where-Object { $_.Name -like "*Antigravity*" }
            $found += $shortcuts
        }
    }
    return $found
}

# 단축아이콘 인자 업데이트 함수
function Update-ShortcutArgs {
    param($ShortcutFile, $NewPort)
    $WshShell = New-Object -ComObject WScript.Shell
    $shortcut = $WshShell.CreateShortcut($ShortcutFile.FullName)
    $originalArgs = $shortcut.Arguments
    $portArg = "--remote-debugging-port=$NewPort"

    # 기존 포트 설정이 있으면 교체, 없으면 추가
    if ($originalArgs -match "--remote-debugging-port=\d+") {
        $shortcut.Arguments = $originalArgs -replace "--remote-debugging-port=\d+", $portArg
    } else {
        $shortcut.Arguments = "$portArg " + $originalArgs
    }
    
    $shortcut.Save()
    Write-Host "업데이트 완료: $($ShortcutFile.Name)" -ForegroundColor Green
}

# 새 단축아이콘 생성 함수
function Create-NewShortcut {
    param($NewPort)
    $exePath = "$env:LOCALAPPDATA\Programs\Antigravity\Antigravity.exe"
    if (Test-Path $exePath) {
        $desktopPath = [Environment]::GetFolderPath('Desktop')
        $shortcutPath = "$desktopPath\Antigravity.lnk"
        $WshShell = New-Object -ComObject WScript.Shell
        $shortcut = $WshShell.CreateShortcut($shortcutPath)
        $shortcut.TargetPath = $exePath
        $shortcut.Arguments = "--remote-debugging-port=$NewPort"
        $shortcut.Save()
        Write-Host "새 단축아이콘 생성: $shortcutPath" -ForegroundColor Green
    } else {
        Write-Error "Antigravity.exe를 찾을 수 없음. 설치 상태를 확인해라."
        exit 1
    }
}

# 메인 실행 로직
Write-Host "=== Antigravity CDP Setup ===" -ForegroundColor Cyan
$shortcuts = Get-AntigravityShortcuts

if ($shortcuts.Count -eq 0) {
    Write-Host "기존 단축아이콘을 찾을 수 없음. 바탕화면에 새로 생성 시도..." -ForegroundColor Yellow
    Create-NewShortcut -NewPort $Port
} else {
    Write-Host "준비된 단축아이콘 $($shortcuts.Count)개 발견" -ForegroundColor Green
    foreach ($s in $shortcuts) {
        Update-ShortcutArgs -ShortcutFile $s -NewPort $Port
    }
}

Write-Host "`n=== 설정 완료 ===" -ForegroundColor Cyan
Write-Host "Antigravity를 완전히 종료(트레이 아이콘 포함)한 후 다시 실행해라." -ForegroundColor Yellow
